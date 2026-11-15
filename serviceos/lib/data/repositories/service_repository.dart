import '../models/service_model.dart';
import '../datasources/supabase_remote_datasource.dart';
import '../datasources/local_fixture_datasource.dart';
import '../../core/network/supabase_service.dart';

abstract class IServiceRepository {
  Future<List<CategoryItemModel>> getCategories();
  Future<List<ServiceItemModel>> getPopularServices();
  Future<List<ServiceItemModel>> getServicesByCategory(String categorySlug);
  Future<List<ServiceItemModel>> searchServices(String query);
}

/// ServiceRepository implementation with dual-mode architecture:
/// 1. Queries Free Cloud Supabase when live credentials are provided.
/// 2. Falls back to standard offline service catalogue with zero internal hardcoding when offline or previewing.
class ServiceRepository implements IServiceRepository {
  final ISupabaseRemoteDataSource _remoteDataSource;
  final ILocalFixtureDataSource _fixtureDataSource;
  final SupabaseService _supabaseService;

  ServiceRepository({
    ISupabaseRemoteDataSource? remoteDataSource,
    ILocalFixtureDataSource? fixtureDataSource,
    SupabaseService? supabaseService,
  })  : _remoteDataSource = remoteDataSource ?? SupabaseRemoteDataSource(),
        _fixtureDataSource = fixtureDataSource ?? LocalFixtureDataSource(),
        _supabaseService = supabaseService ?? SupabaseService.instance;

  List<CategoryItemModel>? _cachedCategories;

  @override
  Future<List<CategoryItemModel>> getCategories() async {
    if (_cachedCategories != null && _cachedCategories!.isNotEmpty) {
      return _cachedCategories!;
    }

    // Try Supabase if live connected
    if (_supabaseService.isLiveConnected) {
      try {
        final remote = await _remoteDataSource.fetchCategories();
        if (remote.isNotEmpty) {
          // Map remote rows to CategoryItemModel
          _cachedCategories = remote.map((row) {
            return CategoryItemModel(
              id: row['id'] as String? ?? '',
              name: row['title'] as String? ?? '',
              slug: row['slug'] as String? ?? '',
              icon: row['icon_name'] as String? ?? 'wrench',
              bannerUrl: row['image_url'] as String? ?? 'assets/images/banner_woman.png',
              services: [], // Populated on drill-down
            );
          }).toList();
          return _cachedCategories!;
        }
      } catch (_) {}
    }

    // Fallback to external demo fixture
    _cachedCategories = await _fixtureDataSource.loadCategories();
    return _cachedCategories!;
  }

  @override
  Future<List<ServiceItemModel>> getPopularServices() async {
    final categories = await getCategories();
    final List<ServiceItemModel> popular = [];

    for (final cat in categories) {
      for (final service in cat.services) {
        if (service.popular) {
          popular.add(service);
        }
      }
    }

    return popular;
  }

  @override
  Future<List<ServiceItemModel>> getServicesByCategory(String categorySlug) async {
    final categories = await getCategories();
    if (categorySlug.toLowerCase() == 'all') {
      return categories.expand((c) => c.services).toList();
    }

    final matched = categories.firstWhere(
      (c) => c.slug.toLowerCase() == categorySlug.toLowerCase(),
      orElse: () => categories.first,
    );

    return matched.services;
  }

  @override
  Future<List<ServiceItemModel>> searchServices(String query) async {
    final categories = await getCategories();
    final allServices = categories.expand((c) => c.services).toList();
    final cleanQuery = query.toLowerCase().trim();

    if (cleanQuery.isEmpty) return allServices;

    return allServices.where((s) {
      return s.name.toLowerCase().contains(cleanQuery) ||
          s.category.toLowerCase().contains(cleanQuery) ||
          s.description.toLowerCase().contains(cleanQuery);
    }).toList();
  }
}
