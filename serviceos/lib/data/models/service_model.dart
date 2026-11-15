class ServiceItemModel {
  final String id;
  final String name;
  final String category;
  final double price;
  final int durationMinutes;
  final double rating;
  final int reviewCount;
  final bool popular;
  final String description;

  const ServiceItemModel({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.durationMinutes,
    required this.rating,
    required this.reviewCount,
    required this.popular,
    required this.description,
  });

  factory ServiceItemModel.fromJson(Map<String, dynamic> json) {
    return ServiceItemModel(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
      price: (json['price'] as num).toDouble(),
      durationMinutes: json['durationMinutes'] as int? ?? 60,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      reviewCount: json['reviewCount'] as int? ?? 120,
      popular: json['popular'] as bool? ?? false,
      description: json['description'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'price': price,
      'durationMinutes': durationMinutes,
      'rating': rating,
      'reviewCount': reviewCount,
      'popular': popular,
      'description': description,
    };
  }
}

class CategoryItemModel {
  final String id;
  final String slug;
  final String title;
  final String shortTitle;
  final int priority;
  final String iconName;
  final String image;
  final int totalServices;
  final List<ServiceItemModel> services;

  const CategoryItemModel({
    required this.id,
    required this.slug,
    required this.title,
    required this.shortTitle,
    required this.priority,
    required this.iconName,
    required this.image,
    required this.totalServices,
    required this.services,
  });

  factory CategoryItemModel.fromJson(Map<String, dynamic> json) {
    var rawServices = json['services'] as List<dynamic>? ?? [];
    List<ServiceItemModel> parsedServices = rawServices
        .map((s) => ServiceItemModel.fromJson(s as Map<String, dynamic>))
        .toList();

    return CategoryItemModel(
      id: json['id'] as String,
      slug: json['slug'] as String,
      title: json['title'] as String,
      shortTitle: json['shortTitle'] as String,
      priority: json['priority'] as int? ?? 1,
      iconName: json['iconName'] as String? ?? 'Wrench',
      image: json['image'] as String? ?? '',
      totalServices: json['totalServices'] as int? ?? parsedServices.length,
      services: parsedServices,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'slug': slug,
      'title': title,
      'shortTitle': shortTitle,
      'priority': priority,
      'iconName': iconName,
      'image': image,
      'totalServices': totalServices,
      'services': services.map((s) => s.toJson()).toList(),
    };
  }
}
