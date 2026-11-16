import '../models/technician_model.dart';
import '../datasources/supabase_remote_datasource.dart';
import '../datasources/local_fixture_datasource.dart';
import '../../core/network/supabase_service.dart';

abstract class ITechnicianRepository {
  Future<List<TechnicianModel>> getNearbyTechnicians();
  Future<TechnicianModel?> getTechnicianById(String id);
  Future<bool> updateDutyStatus(String technicianId, bool isOnline);
}

class TechnicianRepository implements ITechnicianRepository {
  final ISupabaseRemoteDataSource _remoteDataSource;
  final ILocalFixtureDataSource _fixtureDataSource;
  final SupabaseService _supabaseService;

  TechnicianRepository({
    ISupabaseRemoteDataSource? remoteDataSource,
    ILocalFixtureDataSource? fixtureDataSource,
    SupabaseService? supabaseService,
  })  : _remoteDataSource = remoteDataSource ?? SupabaseRemoteDataSource(),
        _fixtureDataSource = fixtureDataSource ?? LocalFixtureDataSource(),
        _supabaseService = supabaseService ?? SupabaseService.instance;

  List<TechnicianModel>? _cache;

  @override
  Future<List<TechnicianModel>> getNearbyTechnicians() async {
    if (_cache != null && _cache!.isNotEmpty) {
      return _cache!;
    }

    // Try Supabase if live connected (PostGIS spatial query)
    if (_supabaseService.isLiveConnected) {
      try {
        final remote = await _remoteDataSource.fetchNearbyTechnicians(
          latitude: 25.7617,
          longitude: -80.1918,
          radiusMeters: 25000,
        );
        if (remote.isNotEmpty) {
          _cache = remote.map((row) {
            final u = row['users'] is Map<String, dynamic> ? row['users'] as Map<String, dynamic> : null;
            final firstName = row['first_name'] as String? ?? u?['first_name'] as String? ?? '';
            final lastName = row['last_name'] as String? ?? u?['last_name'] as String? ?? '';
            final fullName = '$firstName $lastName'.trim();
            final phone = row['phone'] as String? ?? u?['phone'] as String? ?? '';
            final id = row['provider_id'] as String? ?? row['id'] as String? ?? '';
            final tradeTitle = row['trade_category'] as String? ?? 'Certified Service Pro';
            final vehicleModel = row['vehicle_make_model'] as String? ?? row['vehicle_model'] as String? ?? 'Fleet Vehicle';
            final plate = row['vehicle_plate'] as String? ?? row['license_plate'] as String? ?? '';
            final rating = (row['average_rating'] as num?)?.toDouble() ?? 0.0;
            final reviewCount = (row['reviews_count'] as num?)?.toInt() ?? (row['review_count'] as num?)?.toInt() ?? 0;
            final distance = (row['distance_miles'] as num?)?.toDouble() ?? 0.0;

            return TechnicianModel(
              id: id,
              name: fullName.isEmpty ? 'Field Pro' : fullName,
              tradeTitle: tradeTitle,
              licenseNumber: row['trade_license_number'] as String? ?? '',
              photoUrl: 'assets/images/banner_woman.png',
              rating: rating,
              reviewCount: reviewCount,
              completedJobs: (row['completed_jobs_count'] as num?)?.toInt() ?? (row['completed_jobs'] as num?)?.toInt() ?? 0,
              isOnline: row['is_online'] as bool? ?? true,
              isVerified: row['is_verified'] as bool? ?? true,
              distanceMiles: distance,
              vehicleModel: vehicleModel,
              licensePlate: plate,
              hourlyRate: ((row['hourly_rate_cents'] as num?)?.toDouble() ?? 0.0) / 100,
              emergencySurgeRate: ((row['emergency_surge_rate_cents'] as num?)?.toDouble() ?? 0.0) / 100,
              phone: phone,
            );
          }).toList();
          return _cache!;
        }
      } catch (_) {}
    }

    // Fallback when offline or not configured
    _cache = await _fixtureDataSource.loadTechnicians();
    return _cache ?? [];
  }

  @override
  Future<TechnicianModel?> getTechnicianById(String id) async {
    final list = await getNearbyTechnicians();
    try {
      return list.firstWhere((t) => t.id == id);
    } catch (_) {
      return list.isNotEmpty ? list.first : null;
    }
  }

  @override
  Future<bool> updateDutyStatus(String technicianId, bool isOnline) async {
    if (_cache != null) {
      final idx = _cache!.indexWhere((t) => t.id == technicianId);
      if (idx != -1) {
        final current = _cache![idx];
        _cache![idx] = TechnicianModel(
          id: current.id,
          name: current.name,
          tradeTitle: current.tradeTitle,
          licenseNumber: current.licenseNumber,
          photoUrl: current.photoUrl,
          rating: current.rating,
          reviewCount: current.reviewCount,
          completedJobs: current.completedJobs,
          isOnline: isOnline,
          isVerified: current.isVerified,
          distanceMiles: current.distanceMiles,
          vehicleModel: current.vehicleModel,
          licensePlate: current.licensePlate,
          hourlyRate: current.hourlyRate,
          emergencySurgeRate: current.emergencySurgeRate,
          phone: current.phone,
        );
      }
    }
    return true;
  }
}
