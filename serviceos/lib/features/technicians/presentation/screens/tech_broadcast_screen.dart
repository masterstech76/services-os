import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class TechBroadcastScreen extends StatefulWidget {
  final VoidCallback onAccept;
  final VoidCallback onDecline;
  final double netPayout;
  final String jobTitle;
  final String distanceText;
  final String customerInfo;

  const TechBroadcastScreen({
    super.key,
    required this.onAccept,
    required this.onDecline,
    this.netPayout = 0.00,
    this.jobTitle = 'On-Demand Service Request',
    this.distanceText = 'Proximity calculated upon dispatch',
    this.customerInfo = 'Verified Customer Order',
  });

  @override
  State<TechBroadcastScreen> createState() => _TechBroadcastScreenState();
}

class _TechBroadcastScreenState extends State<TechBroadcastScreen> {
  int _secondsRemaining = 48;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppColors.nightSurface : AppColors.daySurface;
    final textPrimary = isDark ? AppColors.nightTextPrimary : AppColors.dayTextPrimary;
    final textSecondary = isDark ? AppColors.nightTextSecondary : AppColors.dayTextSecondary;

    return Scaffold(
      backgroundColor: isDark ? AppColors.nightCanvas : AppColors.dayCanvas,
      appBar: AppBar(
        title: const Text('New Dispatch Alert', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: widget.onDecline,
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 60-Second Countdown Indicator Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEF4444),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text('EMERGENCY RUSH', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800)),
                  ),
                  Text('⏱️ $_secondsRemaining s remaining', style: const TextStyle(color: Color(0xFFEF4444), fontSize: 13, fontWeight: FontWeight.w800)),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: _secondsRemaining / 60.0,
                  backgroundColor: isDark ? Colors.white10 : Colors.black12,
                  valueColor: const AlwaysStoppedAnimation(Color(0xFFEF4444)),
                  minHeight: 6,
                ),
              ),

              const SizedBox(height: 24),

              // Guaranteed Net Payout Box (85% Split)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('GUARANTEED NET PAYOUT (85% ESCROW)', style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                    const SizedBox(height: 4),
                    Text('\$${widget.netPayout.toStringAsFixed(2)}', style: const TextStyle(color: Color(0xFF10B981), fontSize: 36, fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                    const SizedBox(height: 4),
                    Text('Direct Stripe Express deposit immediately upon customer sign-off.', style: TextStyle(color: textSecondary, fontSize: 12)),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Job Parameters Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: surfaceColor,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: isDark ? AppColors.nightBorder : AppColors.dayBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.jobTitle, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textPrimary)),
                    const SizedBox(height: 8),
                    _buildParamRow(Icons.location_on_outlined, widget.distanceText, textSecondary),
                    const SizedBox(height: 6),
                    _buildParamRow(Icons.person_outline, widget.customerInfo, textSecondary),
                    const SizedBox(height: 6),
                    _buildParamRow(Icons.home_outlined, 'Access Instructions Provided in Work Order', textSecondary),
                  ],
                ),
              ),

              const Spacer(),

              // Accept / Decline Buttons
              Row(
                children: [
                  Expanded(
                    flex: 1,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: widget.onDecline,
                      child: const Text('Decline', style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: widget.onAccept,
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('ACCEPT JOB', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
                          SizedBox(width: 6),
                          Icon(Icons.arrow_forward_rounded, size: 18),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildParamRow(IconData icon, String text, Color color) {
    return Row(
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 8),
        Expanded(child: Text(text, style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.w500))),
      ],
    );
  }
}
