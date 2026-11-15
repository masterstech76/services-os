import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

/// Screen X09, X10, X11, X12, X13, X14, X15: System Notifications, Offline Sync Queue, Network Recovery & App Update
class CommonUtilitiesScreen extends StatefulWidget {
  final int initialMode; // 0: Notifications, 1: Offline Queue, 2: Network Error, 3: Mandatory Update
  final VoidCallback? onBack;

  const CommonUtilitiesScreen({
    super.key,
    this.initialMode = 0,
    this.onBack,
  });

  @override
  State<CommonUtilitiesScreen> createState() => _CommonUtilitiesScreenState();
}

class _CommonUtilitiesScreenState extends State<CommonUtilitiesScreen> {
  late int _mode;

  @override
  void initState() {
    super.initState();
    _mode = widget.initialMode;
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
          _getTitle(),
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
        ),
        actions: [
          PopupMenuButton<int>(
            icon: Icon(Icons.more_vert, color: textPrimary),
            onSelected: (mode) => setState(() => _mode = mode),
            itemBuilder: (context) => const [
              PopupMenuItem(value: 0, child: Text('Notifications Hub (X11)')),
              PopupMenuItem(value: 1, child: Text('Offline Sync Queue (X12)')),
              PopupMenuItem(value: 2, child: Text('Network Disconnect (X13)')),
              PopupMenuItem(value: 3, child: Text('Mandatory App Update (X14)')),
            ],
          ),
        ],
      ),
      body: _buildCurrentBody(isDark, surfaceColor, borderColor, textPrimary, textSecondary),
    );
  }

  String _getTitle() {
    switch (_mode) {
      case 0:
        return 'Notification Hub';
      case 1:
        return 'Offline Sync Queue';
      case 2:
        return 'Connection Lost';
      case 3:
        return 'Update ServiceOS';
      default:
        return 'System Utilities';
    }
  }

  Widget _buildCurrentBody(
    bool isDark,
    Color surfaceColor,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    switch (_mode) {
      case 0:
        return _buildNotificationsHub(isDark, surfaceColor, borderColor, textPrimary, textSecondary);
      case 1:
        return _buildOfflineQueue(isDark, surfaceColor, borderColor, textPrimary, textSecondary);
      case 2:
        return _buildNetworkError(isDark, surfaceColor, borderColor, textPrimary, textSecondary);
      case 3:
        return _buildAppUpdate(isDark, surfaceColor, borderColor, textPrimary, textSecondary);
      default:
        return const SizedBox();
    }
  }

  // X11: Notification Hub
  Widget _buildNotificationsHub(
    bool isDark,
    Color surfaceColor,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    final notifications = [
      {
        'title': 'Technician is en route (12 mins away)',
        'subtitle': 'Service Fleet Vehicle • Live GPS Active',
        'time': 'Just now',
        'icon': Icons.directions_car,
        'color': AppColors.dayPrimary,
        'unread': true,
      },
      {
        'title': 'Extra Parts Approval Requested (\$38.50)',
        'subtitle': 'Heavy-duty brass P-trap replacement required for leak seal',
        'time': '25m ago',
        'icon': Icons.handyman,
        'color': AppColors.warningOrange,
        'unread': true,
      },
      {
        'title': 'Escrow Hold Authorized (\$187.50)',
        'subtitle': 'Payment held safely in Stripe Escrow pending sign-off',
        'time': '2 hours ago',
        'icon': Icons.lock,
        'color': AppColors.verifiedEmerald,
        'unread': false,
      },
      {
        'title': 'Seasonal VIP Promo: 20% Off HVAC Tune-up',
        'subtitle': 'Code FALL20 applied to your promotional coupon wallet',
        'time': 'Yesterday',
        'icon': Icons.local_offer,
        'color': AppColors.dayAccent,
        'unread': false,
      },
    ];

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: notifications.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final notif = notifications[index];
        final unread = notif['unread'] as bool;

        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: surfaceColor,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: unread ? (isDark ? AppColors.nightPrimary : AppColors.dayPrimary) : borderColor,
              width: unread ? 1.5 : 1,
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: (notif['color'] as Color).withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(notif['icon'] as IconData, color: notif['color'] as Color, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            notif['title'] as String,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: unread ? FontWeight.w800 : FontWeight.w600,
                              color: textPrimary,
                            ),
                          ),
                        ),
                        Text(
                          notif['time'] as String,
                          style: TextStyle(fontSize: 10, color: textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notif['subtitle'] as String,
                      style: TextStyle(fontSize: 12, color: textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // X12: Offline Queue
  Widget _buildOfflineQueue(
    bool isDark,
    Color surfaceColor,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.ratingAmber.withOpacity(0.12),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.ratingAmber.withOpacity(0.3)),
          ),
          child: const Row(
            children: [
              Icon(Icons.cloud_off, color: AppColors.ratingAmber, size: 24),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '3 Actions Pending Sync',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.ratingAmber),
                    ),
                    Text(
                      'Changes recorded locally. Will upload immediately when LTE / Wi-Fi resumes.',
                      style: TextStyle(fontSize: 11, color: AppColors.dayTextSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        _buildQueueItem('Customer Digital Signature #SVC-2026-1001', 'Queued for Cloud Supabase sync', Icons.draw, surfaceColor, borderColor, textPrimary, textSecondary),
        const SizedBox(height: 10),
        _buildQueueItem('After-Photo Proof (2 images)', 'Stored in local encrypted cache (4.2 MB)', Icons.camera_alt, surfaceColor, borderColor, textPrimary, textSecondary),
        const SizedBox(height: 10),
        _buildQueueItem('GPS Geofence Arrival Check-In', 'Timestamp: 02:30:14 PM', Icons.location_on, surfaceColor, borderColor, textPrimary, textSecondary),
        const SizedBox(height: 24),
        ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Attempting cloud re-sync...')),
            );
          },
          icon: const Icon(Icons.sync, size: 18),
          label: const Text('Force Cloud Sync Now', style: TextStyle(fontWeight: FontWeight.w700)),
        ),
      ],
    );
  }

  Widget _buildQueueItem(String title, String subtitle, IconData icon, Color surfaceColor, Color borderColor, Color textPrimary, Color textSecondary) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        children: [
          Icon(icon, size: 20, color: textSecondary),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary)),
                Text(subtitle, style: TextStyle(fontSize: 11, color: textSecondary)),
              ],
            ),
          ),
          const SizedBox(
            height: 16,
            width: 16,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
        ],
      ),
    );
  }

  // X13: Network Error
  Widget _buildNetworkError(
    bool isDark,
    Color surfaceColor,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.errorRed.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.wifi_off_rounded, size: 56, color: AppColors.errorRed),
            ),
            const SizedBox(height: 24),
            Text(
              'No Internet Connection',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textPrimary),
            ),
            const SizedBox(height: 8),
            Text(
              'ServiceOS operates offline for active in-progress work orders. Reconnect to sync payment settlement and live GPS.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: textSecondary, height: 1.4),
            ),
            const SizedBox(height: 28),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Checking gateway connectivity... Connected!')),
                );
              },
              icon: const Icon(Icons.refresh, size: 18),
              label: const Text('Retry Connection', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }

  // X14: App Update Required
  Widget _buildAppUpdate(
    bool isDark,
    Color surfaceColor,
    Color borderColor,
    Color textPrimary,
    Color textSecondary,
  ) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: (isDark ? AppColors.nightPrimary : AppColors.dayPrimary).withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.system_update_rounded,
                size: 56,
                color: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Update Available (v2.4.0)',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textPrimary),
            ),
            const SizedBox(height: 8),
            Text(
              'This release introduces real-time radar GPS precision, instant Stripe Express bank payouts, and 340 home service catalogue categories.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: textSecondary, height: 1.4),
            ),
            const SizedBox(height: 28),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Opening Google Play / Apple App Store...')),
                );
              },
              child: const Text('Update Now to Continue', style: TextStyle(fontWeight: FontWeight.w800)),
            ),
          ],
        ),
      ),
    );
  }
}
