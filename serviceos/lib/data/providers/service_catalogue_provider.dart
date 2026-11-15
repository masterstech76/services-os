import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/service_model.dart';
import '../repositories/service_repository.dart';

final serviceRepositoryProvider = Provider<IServiceRepository>((ref) {
  return ServiceRepository();
});

class CatalogueState {
  final List<CategoryItemModel> categories;
  final List<ServiceItemModel> popularServices;
  final List<ServiceItemModel> filteredServices;
  final String selectedCategorySlug;
  final String searchQuery;
  final bool isLoading;

  const CatalogueState({
    this.categories = const [],
    this.popularServices = const [],
    this.filteredServices = const [],
    this.selectedCategorySlug = 'all',
    this.searchQuery = '',
    this.isLoading = false,
  });

  CatalogueState copyWith({
    List<CategoryItemModel>? categories,
    List<ServiceItemModel>? popularServices,
    List<ServiceItemModel>? filteredServices,
    String? selectedCategorySlug,
    String? searchQuery,
    bool? isLoading,
  }) {
    return CatalogueState(
      categories: categories ?? this.categories,
      popularServices: popularServices ?? this.popularServices,
      filteredServices: filteredServices ?? this.filteredServices,
      selectedCategorySlug: selectedCategorySlug ?? this.selectedCategorySlug,
      searchQuery: searchQuery ?? this.searchQuery,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class CatalogueNotifier extends StateNotifier<CatalogueState> {
  final IServiceRepository _repository;

  CatalogueNotifier(this._repository) : super(const CatalogueState()) {
    loadCatalogue();
  }

  Future<void> loadCatalogue() async {
    state = state.copyWith(isLoading: true);
    final cats = await _repository.getCategories();
    final popular = await _repository.getPopularServices();
    final allServices = cats.expand((c) => c.services).toList();

    state = state.copyWith(
      categories: cats,
      popularServices: popular,
      filteredServices: allServices,
      isLoading: false,
    );
  }

  Future<void> selectCategory(String slug) async {
    state = state.copyWith(selectedCategorySlug: slug, isLoading: true);
    final services = await _repository.getServicesByCategory(slug);
    state = state.copyWith(filteredServices: services, isLoading: false);
  }

  Future<void> search(String query) async {
    state = state.copyWith(searchQuery: query);
    final results = await _repository.searchServices(query);
    state = state.copyWith(filteredServices: results);
  }
}

final catalogueProvider = StateNotifierProvider<CatalogueNotifier, CatalogueState>((ref) {
  final repo = ref.watch(serviceRepositoryProvider);
  return CatalogueNotifier(repo);
});
