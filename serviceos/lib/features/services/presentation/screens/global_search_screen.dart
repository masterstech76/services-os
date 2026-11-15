import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../data/models/service_model.dart';
import '../../../../data/repositories/service_repository.dart';

class GlobalSearchScreen extends StatefulWidget {
  final ValueChanged<ServiceItemModel> onSelectService;
  final VoidCallback onBack;

  const GlobalSearchScreen({
    super.key,
    required this.onSelectService,
    required this.onBack,
  });

  @override
  State<GlobalSearchScreen> createState() => _GlobalSearchScreenState();
}

class _GlobalSearchScreenState extends State<GlobalSearchScreen> {
  final ServiceRepository _repository = ServiceRepository();
  final TextEditingController _searchController = TextEditingController();
  List<ServiceItemModel> _results = [];
  bool _isLoading = false;

  final List<String> _trendingSearches = [
    'Emergency Plumber',
    'AC Deep Clean',
    'Brake Pads',
    'Drain Snaking',
    'Water Heater Leak',
    'Electrical Panel',
  ];

  @override
  void initState() {
    super.initState();
    _loadInitialResults();
  }

  void _loadInitialResults() async {
    setState(() => _isLoading = true);
    final popular = await _repository.getPopularServices();
    if (mounted) {
      setState(() {
        _results = popular;
        _isLoading = false;
      });
    }
  }

  void _onSearchChanged(String query) async {
    if (query.trim().isEmpty) {
      _loadInitialResults();
      return;
    }
    final searched = await _repository.searchServices(query);
    if (mounted) {
      setState(() {
        _results = searched;
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppColors.nightSurface : AppColors.daySurface;
    final textPrimary = isDark ? AppColors.nightTextPrimary : AppColors.dayTextPrimary;
    final textSecondary = isDark ? AppColors.nightTextSecondary : AppColors.dayTextSecondary;
    final primaryBrand = isDark ? AppColors.nightPrimary : AppColors.dayPrimary;

    return Scaffold(
      backgroundColor: isDark ? AppColors.nightCanvas : AppColors.dayCanvas,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: widget.onBack,
        ),
        title: Container(
          height: 44,
          decoration: BoxDecoration(
            color: surfaceColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: primaryBrand, width: 1.5),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Row(
            children: [
              Icon(Icons.search, size: 20, color: primaryBrand),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _searchController,
                  autofocus: true,
                  onChanged: _onSearchChanged,
                  style: TextStyle(fontSize: 13, color: textPrimary),
                  decoration: InputDecoration(
                    hintText: 'Search 340+ home services, repairs...',
                    hintStyle: TextStyle(fontSize: 12, color: textSecondary),
                    border: InputBorder.none,
                    isDense: true,
                  ),
                ),
              ),
              if (_searchController.text.isNotEmpty)
                GestureDetector(
                  onTap: () {
                    _searchController.clear();
                    _onSearchChanged('');
                  },
                  child: Icon(Icons.close, size: 18, color: textSecondary),
                ),
            ],
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Trending Searches Chips
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'TRENDING SEARCHES',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: textSecondary,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: _trendingSearches.map((term) {
                      return ActionChip(
                        label: Text(term),
                        labelStyle: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: primaryBrand,
                        ),
                        backgroundColor: primaryBrand.withOpacity(0.08),
                        side: BorderSide(color: primaryBrand.withOpacity(0.2)),
                        onPressed: () {
                          _searchController.text = term;
                          _onSearchChanged(term);
                        },
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),

            const Divider(height: 16),

            // Results Counter
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Text(
                'Results (${_results.length} Services Available)',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: textPrimary,
                ),
              ),
            ),

            // Search Results List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _results.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final service = _results[index];
                        return InkWell(
                          onTap: () => widget.onSelectService(service),
                          borderRadius: BorderRadius.circular(14),
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: surfaceColor,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: isDark ? AppColors.nightBorder : AppColors.dayBorder,
                              ),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: primaryBrand.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Icon(
                                    Icons.home_repair_service_rounded,
                                    color: primaryBrand,
                                    size: 24,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        service.name,
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w700,
                                          color: textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        '${service.category} • ${service.durationMinutes} mins',
                                        style: TextStyle(
                                          fontSize: 11,
                                          color: textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      '\$${service.price.toStringAsFixed(0)}',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w800,
                                        color: primaryBrand,
                                      ),
                                    ),
                                    Row(
                                      children: [
                                        const Icon(Icons.star, size: 12, color: AppColors.ratingAmber),
                                        const SizedBox(width: 2),
                                        Text(
                                          service.rating.toStringAsFixed(1),
                                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: textSecondary),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
