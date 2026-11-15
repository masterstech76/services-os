import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';


class ServiceOSAppHeader extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback onThemeToggle;
  final bool isDarkMode;
  final VoidCallback? onProfileTap;

  const ServiceOSAppHeader({
    super.key,
    required this.onThemeToggle,
    required this.isDarkMode,
    this.onProfileTap,
  });

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    final surfaceColor = isDarkMode ? AppColors.nightSurface : AppColors.daySurface;
    final borderColor = isDarkMode ? AppColors.nightBorder : AppColors.dayBorder;
    final textPrimary = isDarkMode ? AppColors.nightTextPrimary : AppColors.dayTextPrimary;
    final textSecondary = isDarkMode ? AppColors.nightTextSecondary : AppColors.dayTextSecondary;
    final primaryBrand = isDarkMode ? AppColors.nightPrimary : AppColors.dayPrimary;

    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: surfaceColor,
        border: Border(bottom: BorderSide(color: borderColor, width: 1)),
      ),
      child: SafeArea(
        bottom: false,
        child: Row(
          children: [
            // Brand Logo & Badge
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: primaryBrand,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: primaryBrand.withOpacity(0.35),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'S',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 20,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'ServiceOS',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: textPrimary,
                        letterSpacing: -0.4,
                      ),
                    ),
                    Text(
                      'Book • Work • Grow',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: textSecondary,
                      ),
                    ),
                  ],
                ),
              ],
            ),

            const Spacer(),

            // Day / Night Vision Instant Toggle
            IconButton(
              onPressed: onThemeToggle,
              tooltip: isDarkMode ? 'Switch to Day Vision (Light)' : 'Switch to Night Vision (Dark)',
              icon: Icon(
                isDarkMode ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
                color: isDarkMode ? AppColors.ratingAmber : const Color(0xFF475569),
                size: 22,
              ),
            ),

            // Notification Bell with Badge
            Stack(
              alignment: Alignment.topRight,
              children: [
                IconButton(
                  onPressed: () {},
                  icon: Icon(
                    Icons.notifications_none_rounded,
                    color: textSecondary,
                    size: 22,
                  ),
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: AppColors.errorRed,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(width: 4),

            // Profile Avatar
            GestureDetector(
              onTap: onProfileTap,
              child: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: primaryBrand, width: 2),
                  image: const DecorationImage(
                    image: NetworkImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
