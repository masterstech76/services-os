import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

/// Screen P26, P27, P30, P31, P32, P34, P35: Technician Performance, Past Jobs, Van Inventory & Profile
class TechHistoryScreen extends StatefulWidget {
  final VoidCallback? onBack;

  const TechHistoryScreen({super.key, this.onBack});

  @override
  State<TechHistoryScreen> createState() => _TechHistoryScreenState();
}

class _TechHistoryScreenState extends State<TechHistoryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _completedJobs = [];

  final List<Map<String, dynamic>> _vanInventory = [
    {'item': 'Rigid K-400 Drain Snaking Drum Machine', 'status': 'Inspected & Ready', 'checked': true},
    {'item': 'Milwaukee M18 ProPEX Expansion Tool', 'status': 'Battery 100%', 'checked': true},
    {'item': 'Digital Inspection Borescope Camera', 'status': 'Operational', 'checked': true},
    {'item': 'Emergency Pipe Clamps & Rubber Sleeves (Assorted)', 'status': 'Stocked (12 units)', 'checked': true},
    {'item': 'OSHA First Aid & Chemical Splash Kit', 'status': 'Compliant', 'checked': true},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppColors.nightSurface : AppColors.daySurface;
    final canvasColor = isDark ? AppColors.nightCanvas : AppColors.dayCanvas;
    final textPrimary = isDark ? AppColors.nightTextPrimary : AppColors.dayTextPrimary;
    final textSecondary = isDark ? AppColors.nightTextSecondary : AppColors.dayTextSecondary;
    final borderColor = isDark ? AppColors.nightBorder : AppColors.dayBorder;

    return Scaffold(
      backgroundColor: canvasColor,
      appBar: AppBar(
        backgroundColor: surfaceColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: textPrimary),
          onPressed: widget.onBack ?? () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Tech Records & Scorecard',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
          indicatorWeight: 3,
          labelColor: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
          unselectedLabelColor: textSecondary,
          labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
          tabs: const [
            Tab(text: 'Scorecard'),
            Tab(text: 'Job History'),
            Tab(text: 'Van Checklist'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildScorecardTab(isDark, surfaceColor, borderColor, textPrimary, textSecondary),
          _buildJobHistoryTab(isDark, surfaceColor, borderColor, textPrimary, textSecondary),
          _buildVanChecklistTab(isDark, surfaceColor, borderColor, textPrimary, textSecondary),
        ],
      ),
    );
  }

  Widget _buildScorecardTab(
    bool isDark,
    Color surfaceColor,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Top Pro Tier Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.ratingAmber.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppColors.ratingAmber.withOpacity(0.4)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.workspace_premium, size: 14, color: AppColors.ratingAmber),
                        SizedBox(width: 4),
                        Text(
                          'PLATINUM PRO TIER',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: AppColors.ratingAmber,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Text('Verified Service Pro', style: TextStyle(fontSize: 11, color: Colors.white70)),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                'Technician Scorecard & Status',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
              ),
              const Text(
                'Certified Field Service Specialist • Active Duty Status',
                style: TextStyle(fontSize: 12, color: Colors.white70),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildWhiteStat('5.0 ★', 'Target CSAT Rating'),
                  _buildWhiteStat('100%', 'On-Time Benchmark'),
                  _buildWhiteStat('100%', 'First-Time Fix'),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        Text('Performance Breakdown', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textPrimary)),
        const SizedBox(height: 12),

        _buildMetricTile(
          icon: Icons.timer,
          title: 'Average Response Time',
          value: '42 seconds to accept',
          subtitle: 'Priority broadcast acceptance target: < 60s',
          isGood: true,
          surfaceColor: surfaceColor,
          borderColor: borderColor,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
        ),
        const SizedBox(height: 10),
        _buildMetricTile(
          icon: Icons.check_circle_outline,
          title: 'Zero Warranty Rework Rate',
          value: '99.1% First Fix',
          subtitle: 'Less than 1 call-back per 100 jobs',
          isGood: true,
          surfaceColor: surfaceColor,
          borderColor: borderColor,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
        ),
        const SizedBox(height: 10),
        _buildMetricTile(
          icon: Icons.camera_alt_outlined,
          title: 'Photo Proof Compliance',
          value: '100% Verified',
          subtitle: 'Before & after photo pairs uploaded for all jobs',
          isGood: true,
          surfaceColor: surfaceColor,
          borderColor: borderColor,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
        ),
      ],
    );
  }

  Widget _buildJobHistoryTab(
    bool isDark,
    Color surfaceColor,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (_completedJobs.isEmpty)
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: surfaceColor,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              children: [
                Icon(Icons.history_outlined, size: 48, color: textSecondary.withOpacity(0.4)),
                const SizedBox(height: 12),
                Text('No Completed Jobs Yet', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: textPrimary)),
                const SizedBox(height: 6),
                Text('Dispatched work orders will be archived here upon customer sign-off.', textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: textSecondary)),
              ],
            ),
          ),
        for (final job in _completedJobs)
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: surfaceColor,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      job['id'] as String,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                      ),
                    ),
                    Text(
                      'Net Payout: \$${(job['net'] as double).toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: AppColors.verifiedEmerald,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  job['service'] as String,
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: textPrimary),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.location_on, size: 13, color: textSecondary),
                    const SizedBox(width: 4),
                    Text('${job['customer']} • ${job['location']}', style: TextStyle(fontSize: 12, color: textSecondary)),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.star, size: 14, color: AppColors.ratingAmber),
                        const SizedBox(width: 4),
                        Text('${job['rating']} Rating', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: textPrimary)),
                        const SizedBox(width: 8),
                        Text('+ \$${(job['tip'] as double).toStringAsFixed(0)} Tip', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.verifiedEmerald)),
                      ],
                    ),
                    Text(job['date'] as String, style: TextStyle(fontSize: 11, color: textSecondary)),
                  ],
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildVanChecklistTab(
    bool isDark,
    Color surfaceColor,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Daily Van Equipment & OSHA Safety Audit',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textPrimary),
        ),
        const SizedBox(height: 4),
        Text('Required each morning before turning on GPS Radar availability.', style: TextStyle(fontSize: 12, color: textSecondary)),
        const SizedBox(height: 16),
        for (int i = 0; i < _vanInventory.length; i++)
          Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: surfaceColor,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: borderColor),
            ),
            child: Row(
              children: [
                Checkbox(
                  value: _vanInventory[i]['checked'] as bool,
                  activeColor: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                  onChanged: (val) {
                    setState(() {
                      _vanInventory[i]['checked'] = val ?? false;
                    });
                  },
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _vanInventory[i]['item'] as String,
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary),
                      ),
                      Text(
                        _vanInventory[i]['status'] as String,
                        style: TextStyle(fontSize: 11, color: textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        const SizedBox(height: 16),
        ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Equipment checklist signed & verified for today!')),
            );
          },
          icon: const Icon(Icons.verified, size: 18),
          label: const Text('Certify Van Ready for Dispatch', style: TextStyle(fontWeight: FontWeight.w700)),
        ),
      ],
    );
  }

  Widget _buildWhiteStat(String value, String label) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.white70)),
      ],
    );
  }

  Widget _buildMetricTile({
    required IconData icon,
    required String title,
    required String value,
    required String subtitle,
    required bool isGood,
    required Color surfaceColor,
    required Color borderColor,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.verifiedEmerald.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppColors.verifiedEmerald, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary)),
                Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.verifiedEmerald)),
                Text(subtitle, style: TextStyle(fontSize: 11, color: textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
