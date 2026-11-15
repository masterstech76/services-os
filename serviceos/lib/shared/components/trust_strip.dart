import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';


class TrustVerificationStrip extends StatelessWidget {
  final VoidCallback onViewAllTap;

  const TrustVerificationStrip({
    super.key,
    required this.onViewAllTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppColors.nightSurface : AppColors.daySurface;
    final borderColor = isDark ? AppColors.nightBorder : AppColors.dayBorder;
    final textPrimary = isDark ? AppColors.nightTextPrimary : AppColors.dayTextPrimary;
    final textSecondary = isDark ? AppColors.nightTextSecondary : AppColors.dayTextSecondary;
    final primaryBrand = isDark ? AppColors.nightPrimary : AppColors.dayPrimary;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.2 : 0.03),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // 4-Node Trust Grid
          Row(
            children: [
              _buildTrustNode(
                icon: Icons.verified_user_rounded,
                iconColor: AppColors.verifiedEmerald,
                title: 'Verified Pros',
                subtitle: '100% Background-checked',
                textPrimary: textPrimary,
                textSecondary: textSecondary,
              ),
              _buildTrustNode(
                icon: Icons.bolt_rounded,
                iconColor: AppColors.ratingAmber,
                title: 'Instant Booking',
                subtitle: '60-min arrival guarantee',
                textPrimary: textPrimary,
                textSecondary: textSecondary,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _buildTrustNode(
                icon: Icons.lock_rounded,
                iconColor: primaryBrand,
                title: 'Escrow Security',
                subtitle: 'Pay after work completion',
                textPrimary: textPrimary,
                textSecondary: textSecondary,
              ),
              _buildTrustNode(
                icon: Icons.support_agent_rounded,
                iconColor: const Color(0xFFEC4899),
                title: '24/7 Support',
                subtitle: 'Live dispatch assistance',
                textPrimary: textPrimary,
                textSecondary: textSecondary,
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Divider
          Divider(color: borderColor, height: 1),

          const SizedBox(height: 16),

          // "View All Services" Action Link
          InkWell(
            onTap: onViewAllTap,
            borderRadius: BorderRadius.circular(10),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'View All 340 Home Services',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: primaryBrand,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Icon(
                    Icons.arrow_forward_rounded,
                    size: 16,
                    color: primaryBrand,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustNode({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    return Expanded(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 18, color: iconColor),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 11,
                    color: textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
