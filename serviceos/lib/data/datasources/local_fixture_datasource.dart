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
  Future<List<CategoryItemModel>> loadCategories() async => [];

  @override
  Future<List<BookingModel>> loadBookings() async => [];

  @override
  Future<List<TechnicianModel>> loadTechnicians() async => [];

  @override
  Future<List<Map<String, dynamic>>> loadInventory() async => [];
}
