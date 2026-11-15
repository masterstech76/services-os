import '../models/service_model.dart';
import '../models/booking_model.dart';
import '../models/technician_model.dart';

abstract class ILocalFixtureDataSource {
  Future<List<CategoryItemModel>> loadCategories();
  Future<List<BookingModel>> loadBookings();
  Future<List<TechnicianModel>> loadTechnicians();
  Future<List<Map<String, dynamic>>> loadInventory();
}

class LocalFixtureDataSource implements ILocalFixtureDataSource {
  @override
  Future<List<CategoryItemModel>> loadCategories() async {
    return [
      CategoryItemModel(
        id: 'cat-hvac',
        name: 'AC & Heating',
        slug: 'hvac',
        icon: 'snowflake',
        bannerUrl: 'assets/images/banner_woman.png',
        services: [
          ServiceItemModel(
            id: 'srv-ac-diagnostic',
            name: 'AC Diagnostic & Inspection',
            category: 'AC & Heating',
            description: 'Comprehensive 24-point HVAC inspection, refrigerant check, and performance test.',
            price: 89.0,
            durationMinutes: 60,
            imageUrl: 'assets/images/banner_woman.png',
            rating: 4.9,
          ),
          ServiceItemModel(
            id: 'srv-ac-tuneup',
            name: 'Seasonal AC Maintenance Tune-Up',
            category: 'AC & Heating',
            description: 'Coil cleaning, filter replacement, electrical component test, and airflow optimization.',
            price: 129.0,
            durationMinutes: 90,
            imageUrl: 'assets/images/banner_woman.png',
            rating: 4.9,
          ),
        ],
      ),
      CategoryItemModel(
        id: 'cat-plumbing',
        name: 'Plumbing',
        slug: 'plumbing',
        icon: 'wrench',
        bannerUrl: 'assets/images/banner_woman.png',
        services: [
          ServiceItemModel(
            id: 'srv-drain-cleaning',
            name: 'Hydro-Jet Drain Cleaning',
            category: 'Plumbing',
            description: 'High-pressure water jetting to clear stubborn sewer and drain blockages.',
            price: 149.0,
            durationMinutes: 60,
            imageUrl: 'assets/images/banner_woman.png',
            rating: 4.8,
          ),
          ServiceItemModel(
            id: 'srv-leak-repair',
            name: 'Pipe Leak Detection & Repair',
            category: 'Plumbing',
            description: 'Acoustic and electronic leak detection with precision pipe repair.',
            price: 175.0,
            durationMinutes: 90,
            imageUrl: 'assets/images/banner_woman.png',
            rating: 4.9,
          ),
        ],
      ),
      CategoryItemModel(
        id: 'cat-electrical',
        name: 'Electrical',
        slug: 'electrical',
        icon: 'zap',
        bannerUrl: 'assets/images/banner_woman.png',
        services: [
          ServiceItemModel(
            id: 'srv-panel-upgrade',
            name: 'Circuit Breaker & Panel Inspection',
            category: 'Electrical',
            description: 'Load calculation, thermal inspection, and safety breaker testing.',
            price: 119.0,
            durationMinutes: 60,
            imageUrl: 'assets/images/banner_woman.png',
            rating: 4.9,
          ),
          ServiceItemModel(
            id: 'srv-outlet-install',
            name: 'EV Charger & Dedicated Outlet Install',
            category: 'Electrical',
            description: '240V Level 2 EV charging station or high-draw dedicated circuit installation.',
            price: 299.0,
            durationMinutes: 120,
            imageUrl: 'assets/images/banner_woman.png',
            rating: 5.0,
          ),
        ],
      ),
      CategoryItemModel(
        id: 'cat-cleaning',
        name: 'Home Cleaning',
        slug: 'cleaning',
        icon: 'sparkles',
        bannerUrl: 'assets/images/banner_woman.png',
        services: [
          ServiceItemModel(
            id: 'srv-deep-clean',
            name: 'Whole-Home Deep Cleaning',
            category: 'Home Cleaning',
            description: 'Hospital-grade sanitization, kitchen degreasing, bathroom descaling, and dusting.',
            price: 169.0,
            durationMinutes: 180,
            imageUrl: 'assets/images/banner_woman.png',
            rating: 4.8,
          ),
        ],
      ),
    ];
  }

  @override
  Future<List<BookingModel>> loadBookings() async => [];

  @override
  Future<List<TechnicianModel>> loadTechnicians() async => [];

  @override
  Future<List<Map<String, dynamic>>> loadInventory() async => [];
}
