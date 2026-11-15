enum BookingStatus {
  draft,
  requested,
  broadcasting,
  assigned,
  enRoute,
  arrived,
  inProgress,
  completed,
  settled,
  cancelled
}

class BookingModel {
  final String id;
  final String serviceTitle;
  final String category;
  final double basePrice;
  final double extraPartsTotal;
  final double platformFee;
  final double netTechPayout;
  final double totalAuthorized;
  final BookingStatus status;
  final String customerAddress;
  final String safetyPin;
  final String technicianId;
  final String technicianName;
  final DateTime scheduledAt;
  final DateTime? completedAt;

  const BookingModel({
    required this.id,
    required this.serviceTitle,
    required this.category,
    required this.basePrice,
    required this.extraPartsTotal,
    required this.platformFee,
    required this.netTechPayout,
    required this.totalAuthorized,
    required this.status,
    required this.customerAddress,
    required this.safetyPin,
    required this.technicianId,
    required this.technicianName,
    required this.scheduledAt,
    this.completedAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as String? ?? 'SO-88219',
      serviceTitle: json['serviceTitle'] as String? ?? 'Drain Cleaning & Snaking',
      category: json['category'] as String? ?? 'Plumbing Services',
      basePrice: (json['basePrice'] as num?)?.toDouble() ?? 149.00,
      extraPartsTotal: (json['extraPartsTotal'] as num?)?.toDouble() ?? 0.0,
      platformFee: (json['platformFee'] as num?)?.toDouble() ?? 0.0,
      netTechPayout: (json['netTechPayout'] as num?)?.toDouble() ?? 0.0,
      totalAuthorized: (json['totalAuthorized'] as num?)?.toDouble() ?? 0.0,
      status: BookingStatus.values.firstWhere(
        (e) => e.name.toLowerCase() == (json['status'] as String? ?? 'requested').toLowerCase(),
        orElse: () => BookingStatus.requested,
      ),
      customerAddress: json['customerAddress'] as String? ?? '',
      safetyPin: json['safetyPin'] as String? ?? '',
      technicianId: json['technicianId'] as String? ?? '',
      technicianName: json['technicianName'] as String? ?? 'Assigned Professional',
      scheduledAt: DateTime.tryParse(json['scheduledAt'] as String? ?? '') ?? DateTime.now(),
      completedAt: json['completedAt'] != null ? DateTime.tryParse(json['completedAt'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'serviceTitle': serviceTitle,
      'category': category,
      'basePrice': basePrice,
      'extraPartsTotal': extraPartsTotal,
      'platformFee': platformFee,
      'netTechPayout': netTechPayout,
      'totalAuthorized': totalAuthorized,
      'status': status.name,
      'customerAddress': customerAddress,
      'safetyPin': safetyPin,
      'technicianId': technicianId,
      'technicianName': technicianName,
      'scheduledAt': scheduledAt.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
    };
  }
}
