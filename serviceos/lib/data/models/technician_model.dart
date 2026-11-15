class TechnicianModel {
  final String id;
  final String name;
  final String tradeTitle;
  final String licenseNumber;
  final String photoUrl;
  final double rating;
  final int reviewCount;
  final int completedJobs;
  final bool isOnline;
  final bool isVerified;
  final double distanceMiles;
  final String vehicleModel;
  final String licensePlate;
  final double hourlyRate;
  final double emergencySurgeRate;
  final String phone;

  const TechnicianModel({
    required this.id,
    required this.name,
    required this.tradeTitle,
    required this.licenseNumber,
    required this.photoUrl,
    required this.rating,
    required this.reviewCount,
    required this.completedJobs,
    required this.isOnline,
    required this.isVerified,
    required this.distanceMiles,
    required this.vehicleModel,
    required this.licensePlate,
    required this.hourlyRate,
    required this.emergencySurgeRate,
    required this.phone,
  });

  factory TechnicianModel.fromJson(Map<String, dynamic> json) {
    return TechnicianModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? 'Verified Technician',
      tradeTitle: json['tradeTitle'] as String? ?? 'Certified Professional',
      licenseNumber: json['licenseNumber'] as String? ?? '',
      photoUrl: json['photoUrl'] as String? ?? 'assets/images/banner_woman.png',
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
      reviewCount: json['reviewCount'] as int? ?? 0,
      completedJobs: json['completedJobs'] as int? ?? 0,
      isOnline: json['isOnline'] as bool? ?? false,
      isVerified: json['isVerified'] as bool? ?? true,
      distanceMiles: (json['distanceMiles'] as num?)?.toDouble() ?? 0.0,
      vehicleModel: json['vehicleModel'] as String? ?? 'Service Fleet Vehicle',
      licensePlate: json['licensePlate'] as String? ?? '',
      hourlyRate: (json['hourlyRate'] as num?)?.toDouble() ?? 0.0,
      emergencySurgeRate: (json['emergencySurgeRate'] as num?)?.toDouble() ?? 0.0,
      phone: json['phone'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'tradeTitle': tradeTitle,
      'licenseNumber': licenseNumber,
      'photoUrl': photoUrl,
      'rating': rating,
      'reviewCount': reviewCount,
      'completedJobs': completedJobs,
      'isOnline': isOnline,
      'isVerified': isVerified,
      'distanceMiles': distanceMiles,
      'vehicleModel': vehicleModel,
      'licensePlate': licensePlate,
      'hourlyRate': hourlyRate,
      'emergencySurgeRate': emergencySurgeRate,
      'phone': phone,
    };
  }
}
