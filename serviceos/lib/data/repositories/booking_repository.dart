import '../models/booking_model.dart';
import '../datasources/supabase_remote_datasource.dart';
import '../datasources/local_fixture_datasource.dart';
import '../../core/network/supabase_service.dart';

abstract class IBookingRepository {
  Future<List<BookingModel>> getCustomerBookings();
  Future<BookingModel?> getActiveWorkOrder();
  Future<bool> approveExtraParts(String bookingId, double amount);
  Future<bool> completeWorkOrderWithSignature(String bookingId, String signatureBase64, {String? safetyPin});
  Future<BookingModel?> createBookingRequest({
    required String serviceTitle,
    required String category,
    required double basePrice,
    required double extraPartsTotal,
    required String customerAddress,
    required DateTime scheduledAt,
    bool isEmergencyRush = false,
  });
}

class BookingRepository implements IBookingRepository {
  final ISupabaseRemoteDataSource _remoteDataSource;
  final ILocalFixtureDataSource _fixtureDataSource;
  final SupabaseService _supabaseService;

  BookingRepository({
    ISupabaseRemoteDataSource? remoteDataSource,
    ILocalFixtureDataSource? fixtureDataSource,
    SupabaseService? supabaseService,
  })  : _remoteDataSource = remoteDataSource ?? SupabaseRemoteDataSource(),
        _fixtureDataSource = fixtureDataSource ?? LocalFixtureDataSource(),
        _supabaseService = supabaseService ?? SupabaseService.instance;

  List<BookingModel>? _cache;

  @override
  Future<List<BookingModel>> getCustomerBookings() async {
    if (_cache != null && _cache!.isNotEmpty) {
      return _cache!;
    }

    // Try Supabase if live connected (aligned 1:1 with 01_initial_schema.sql bookings columns)
    if (_supabaseService.isLiveConnected) {
      try {
        final remote = await _remoteDataSource.fetchBookings();
        if (remote.isNotEmpty) {
          _cache = remote.map((row) {
            final s = row['services'] as Map<String, dynamic>? ?? {};
            final totalCents = (row['total_authorized_cents'] as num?)?.toDouble() ??
                (row['labor_cost_cents'] as num?)?.toDouble() ??
                14900;
            final laborCents = (row['labor_cost_cents'] as num?)?.toDouble() ?? totalCents;
            final partsCents = (row['parts_total_cents'] as num?)?.toDouble() ?? 0;
            final feeCents = (row['platform_fee_cents'] as num?)?.toDouble() ?? (totalCents * 0.15);
            final netCents = (row['net_payout_cents'] as num?)?.toDouble() ?? (totalCents * 0.85);

            return BookingModel(
              id: row['id'] as String? ?? row['booking_reference'] as String? ?? 'SO-00000',
              serviceTitle: s['name'] as String? ?? 'Service Order',
              category: 'Home Service',
              basePrice: laborCents / 100,
              extraPartsTotal: partsCents / 100,
              platformFee: feeCents / 100,
              netTechPayout: netCents / 100,
              totalAuthorized: totalCents / 100,
              status: _parseBookingStatus(row['status'] as String? ?? 'REQUESTED'),
              customerAddress: row['address_text'] as String? ?? '',
              safetyPin: row['safety_pin'] as String? ?? '4892',
              technicianId: row['provider_id'] as String? ?? '',
              technicianName: 'Assigned Pro',
              scheduledAt: DateTime.tryParse(row['scheduled_start'] as String? ?? '') ?? DateTime.now(),
            );
          }).toList();
          return _cache!;
        }
      } catch (_) {}
    }

    // Fallback to external demo fixture
    _cache = await _fixtureDataSource.loadBookings();
    if (_cache != null && _cache!.isNotEmpty) {
      return _cache!;
    }

    return [];
  }

  @override
  Future<BookingModel?> getActiveWorkOrder() async {
    final list = await getCustomerBookings();
    if (list.isEmpty) return null;
    try {
      return list.firstWhere(
        (b) => b.status == BookingStatus.inProgress || b.status == BookingStatus.enRoute,
      );
    } catch (_) {
      return list.isNotEmpty ? list.first : null;
    }
  }

  @override
  Future<bool> approveExtraParts(String bookingId, double amount) async {
    if (_cache != null) {
      final idx = _cache!.indexWhere((b) => b.id == bookingId);
      if (idx != -1) {
        final current = _cache![idx];
        _cache![idx] = BookingModel(
          id: current.id,
          serviceTitle: current.serviceTitle,
          category: current.category,
          basePrice: current.basePrice,
          extraPartsTotal: amount,
          platformFee: current.platformFee,
          netTechPayout: current.netTechPayout + (amount * 0.85),
          totalAuthorized: current.totalAuthorized + amount,
          status: current.status,
          customerAddress: current.customerAddress,
          safetyPin: current.safetyPin,
          technicianId: current.technicianId,
          technicianName: current.technicianName,
          scheduledAt: current.scheduledAt,
        );
      }
    }
    return true;
  }

  @override
  Future<bool> completeWorkOrderWithSignature(String bookingId, String signatureBase64, {String? safetyPin}) async {
    if (_supabaseService.isLiveConnected) {
      final pinToUse = safetyPin ??
          _cache?.where((b) => b.id == bookingId).map((b) => b.safetyPin).firstOrNull ??
          '4892';
      final released = await _remoteDataSource.releaseEscrowToTechnician(
        bookingId: bookingId,
        pinCode: pinToUse,
      );
      if (!released) {
        await _remoteDataSource.updateBookingStatus(bookingId, 'COMPLETED');
      }
    }
    if (_cache != null) {
      final idx = _cache!.indexWhere((b) => b.id == bookingId);
      if (idx != -1) {
        final current = _cache![idx];
        _cache![idx] = BookingModel(
          id: current.id,
          serviceTitle: current.serviceTitle,
          category: current.category,
          basePrice: current.basePrice,
          extraPartsTotal: current.extraPartsTotal,
          platformFee: current.platformFee,
          netTechPayout: current.netTechPayout,
          totalAuthorized: current.totalAuthorized,
          status: BookingStatus.completed,
          customerAddress: current.customerAddress,
          safetyPin: current.safetyPin,
          technicianId: current.technicianId,
          technicianName: current.technicianName,
          scheduledAt: current.scheduledAt,
        );
      }
    }
    return true;
  }

  @override
  Future<BookingModel?> createBookingRequest({
    required String serviceTitle,
    required String category,
    required double basePrice,
    required double extraPartsTotal,
    required String customerAddress,
    required DateTime scheduledAt,
    bool isEmergencyRush = false,
  }) async {
    final newRef = 'SO-${10000 + (DateTime.now().millisecondsSinceEpoch % 90000)}';
    final rushFee = isEmergencyRush ? 49.00 : 0.00;
    final total = basePrice + extraPartsTotal + rushFee;
    final platformFee = total * 0.15;
    final netPayout = total * 0.85;
    final safetyPin = '${1000 + (DateTime.now().millisecond % 9000)}';

    final newBooking = BookingModel(
      id: newRef,
      serviceTitle: serviceTitle,
      category: category,
      basePrice: basePrice,
      extraPartsTotal: extraPartsTotal,
      platformFee: platformFee,
      netTechPayout: netPayout,
      totalAuthorized: total,
      status: BookingStatus.requested,
      customerAddress: customerAddress,
      safetyPin: safetyPin,
      technicianId: 'tech_01',
      technicianName: 'Matching Pro...',
      scheduledAt: scheduledAt,
    );

    _cache ??= [];
    _cache!.insert(0, newBooking);
    return newBooking;
  }

  BookingStatus _parseBookingStatus(String status) {
    switch (status.toUpperCase()) {
      case 'EN_ROUTE':
        return BookingStatus.enRoute;
      case 'IN_PROGRESS':
        return BookingStatus.inProgress;
      case 'COMPLETED':
        return BookingStatus.completed;
      case 'CANCELLED':
        return BookingStatus.cancelled;
      default:
        return BookingStatus.requested;
    }
  }
}
