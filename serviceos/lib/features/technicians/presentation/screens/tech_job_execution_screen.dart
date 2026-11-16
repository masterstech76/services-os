import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class TechJobExecutionScreen extends StatefulWidget {
  final VoidCallback onJobCompleted;
  final String workOrderNumber;

  const TechJobExecutionScreen({
    super.key,
    required this.onJobCompleted,
    this.workOrderNumber = '',
  });

  @override
  State<TechJobExecutionScreen> createState() => _TechJobExecutionScreenState();
}

class _TechJobExecutionScreenState extends State<TechJobExecutionScreen> {
  int _currentStep = 1; // 1: Arrived, 2: Before Photos, 3: In Progress, 4: After Photos, 5: Signature
  bool _beforePhotosUploaded = false;
  bool _afterPhotosUploaded = false;
  bool _hasExtraPart = false;

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
        title: Text(
          widget.workOrderNumber.isNotEmpty ? 'Active Work Order #${widget.workOrderNumber}' : 'Active Work Order',
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Timer & Customer Bar
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: surfaceColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isDark ? AppColors.nightBorder : AppColors.dayBorder),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Customer Work Order', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: textPrimary)),
                        Text('Service Delivery Address Verified', style: TextStyle(fontSize: 11, color: textSecondary)),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: primaryBrand.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text('⏱️ 00:42:15', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: primaryBrand)),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // Step 1: Geofenced Arrival Check-In
              _buildStepCard(
                stepNum: 1,
                title: 'Geofenced Arrival Check-In',
                subtitle: 'Verified within 35 meters of customer address',
                isCompleted: true,
                surfaceColor: surfaceColor,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
              ),

              // Step 2: Mandatory 2 Before-Photos
              _buildStepCard(
                stepNum: 2,
                title: 'Mandatory Before-Photos',
                subtitle: '2 clear photos of leak before starting repair',
                isCompleted: _beforePhotosUploaded,
                surfaceColor: surfaceColor,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                action: _beforePhotosUploaded
                    ? null
                    : ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: primaryBrand, foregroundColor: Colors.white),
                        onPressed: () => setState(() => _beforePhotosUploaded = true),
                        child: const Text('Capture 2 Photos 📷', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                      ),
              ),

              // Step 3: Extra Replacement Parts (Optional)
              _buildStepCard(
                stepNum: 3,
                title: 'Extra Replacement Parts',
                subtitle: _hasExtraPart ? 'Extra Replacement Part (Approved ✓)' : 'Optional line item with customer push approval',
                isCompleted: _hasExtraPart,
                surfaceColor: surfaceColor,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                action: _hasExtraPart
                    ? null
                    : OutlinedButton(
                        onPressed: () => setState(() => _hasExtraPart = true),
                        child: const Text('+ Add Part', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                      ),
              ),

              // Step 4: Mandatory 2 After-Photos
              _buildStepCard(
                stepNum: 4,
                title: 'Mandatory After-Photos',
                subtitle: '2 clear photos showing completed repair and clean area',
                isCompleted: _afterPhotosUploaded,
                surfaceColor: surfaceColor,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                action: _afterPhotosUploaded
                    ? null
                    : ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: primaryBrand, foregroundColor: Colors.white),
                        onPressed: () => setState(() => _afterPhotosUploaded = true),
                        child: const Text('Capture After Photos 📷', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                      ),
              ),

              // Step 5: Digital Glass Signature
              _buildStepCard(
                stepNum: 5,
                title: 'Customer Sign-Off on Glass',
                subtitle: 'Present phone to customer to sign and release escrow',
                isCompleted: false,
                surfaceColor: surfaceColor,
                textPrimary: textPrimary,
                textSecondary: textSecondary,
                action: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981), foregroundColor: Colors.white),
                  onPressed: widget.onJobCompleted,
                  child: const Text('Present Signature Pad ✍️', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepCard({
    required int stepNum,
    required String title,
    required String subtitle,
    required bool isCompleted,
    required Color surfaceColor,
    required Color textPrimary,
    required Color textSecondary,
    Widget? action,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isCompleted ? const Color(0xFF10B981) : const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isCompleted ? const Color(0xFF10B981) : Colors.grey.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: isCompleted
                      ? const Icon(Icons.check, size: 14, color: Colors.white)
                      : Text('$stepNum', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: textPrimary)),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.only(left: 34, top: 4),
            child: Text(subtitle, style: TextStyle(fontSize: 11, color: textSecondary)),
          ),
          if (action != null)
            Padding(
              padding: const EdgeInsets.only(left: 34, top: 10),
              child: action,
            ),
        ],
      ),
    );
  }
}
