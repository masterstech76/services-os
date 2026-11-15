import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

/// Screen C35: Invoice PDF Viewer & Itemized Receipt
/// Production financial settlement view with taxes, escrow breakdown, and PDF export actions.
class InvoiceReceiptScreen extends StatelessWidget {
  final String invoiceNumber;
  final String bookingReference;
  final String dateText;
  final String serviceName;
  final String customerName;
  final String customerAddress;
  final String techName;
  final String techLicense;
  final double laborCost;
  final double diagnosticFee;
  final List<Map<String, dynamic>> parts;
  final double taxRate;
  final String paymentMethod;
  final VoidCallback? onBack;
  final VoidCallback? onDownloadPdf;
  final VoidCallback? onShareInvoice;

  const InvoiceReceiptScreen({
    super.key,
    this.invoiceNumber = 'INV-SERVICE-001',
    this.bookingReference = 'SVC-001',
    this.dateText = 'Today',
    this.serviceName = 'Field Service Order',
    this.customerName = 'Customer',
    this.customerAddress = 'Customer Service Address',
    this.techName = 'Certified Technician',
    this.techLicense = 'State Certified License',
    this.laborCost = 0.00,
    this.diagnosticFee = 0.00,
    this.parts = const [],
    this.taxRate = 0.00,
    this.paymentMethod = 'Authorized Payment Method',
    this.onBack,
    this.onDownloadPdf,
    this.onShareInvoice,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppColors.nightSurface : AppColors.daySurface;
    final canvasColor = isDark ? AppColors.nightCanvas : AppColors.dayCanvas;
    final textPrimary = isDark ? AppColors.nightTextPrimary : AppColors.dayTextPrimary;
    final textSecondary = isDark ? AppColors.nightTextSecondary : AppColors.dayTextSecondary;
    final borderColor = isDark ? AppColors.nightBorder : AppColors.dayBorder;

    final double partsTotal = parts.fold(0.0, (sum, item) => sum + (item['price'] as double));
    final double subtotal = laborCost + diagnosticFee + partsTotal;
    final double taxAmount = subtotal * taxRate;
    final double grandTotal = subtotal + taxAmount;

    return Scaffold(
      backgroundColor: canvasColor,
      appBar: AppBar(
        backgroundColor: surfaceColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: textPrimary),
          onPressed: onBack ?? () => Navigator.of(context).pop(),
        ),
        title: Text(
          'Tax Invoice & Receipt',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.share_outlined, color: textPrimary),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Invoice link copied to clipboard')),
              );
              onShareInvoice?.call();
            },
          ),
          IconButton(
            icon: Icon(Icons.file_download_outlined, color: textPrimary),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Generating high-res PDF receipt...')),
              );
              onDownloadPdf?.call();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Formal Receipt Card
            Container(
              decoration: BoxDecoration(
                color: surfaceColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: borderColor),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Brand & Status Strip
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: (isDark ? AppColors.nightPrimary : AppColors.dayPrimary).withOpacity(0.12),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Icon(
                              Icons.verified_user_rounded,
                              color: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'ServiceOS Platform',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: textPrimary,
                                ),
                              ),
                              Text(
                                'Official Service Settlement Receipt',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.verifiedEmerald.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.check_circle, size: 14, color: AppColors.verifiedEmerald),
                            SizedBox(width: 4),
                            Text(
                              'PAID',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                color: AppColors.verifiedEmerald,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Divider(height: 1),
                  const SizedBox(height: 16),

                  // Metadata Grid
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Invoice No.', style: TextStyle(fontSize: 11, color: textSecondary)),
                          const SizedBox(height: 2),
                          Text(invoiceNumber, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('Date of Service', style: TextStyle(fontSize: 11, color: textSecondary)),
                          const SizedBox(height: 2),
                          Text(dateText, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Booking Ref', style: TextStyle(fontSize: 11, color: textSecondary)),
                          const SizedBox(height: 2),
                          Text(bookingReference, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('Payment Method', style: TextStyle(fontSize: 11, color: textSecondary)),
                          const SizedBox(height: 2),
                          Text(paymentMethod, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  const Divider(height: 1),
                  const SizedBox(height: 16),

                  // Parties
                  Text('Service Location & Customer:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: textSecondary)),
                  const SizedBox(height: 4),
                  Text(customerName, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: textPrimary)),
                  Text(customerAddress, style: TextStyle(fontSize: 13, color: textSecondary)),
                  const SizedBox(height: 12),

                  Text('Authorized Professional Provider:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: textSecondary)),
                  const SizedBox(height: 4),
                  Text(techName, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: textPrimary)),
                  Text(techLicense, style: TextStyle(fontSize: 12, color: textSecondary)),

                  const SizedBox(height: 20),
                  Text('Line Items:', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: textPrimary)),
                  const SizedBox(height: 10),

                  // Line Items Table
                  _buildItemRow('Labor: $serviceName', 1, laborCost, textPrimary, textSecondary),
                  _buildItemRow('Emergency Diagnostic & Van Dispatch', 1, diagnosticFee, textPrimary, textSecondary),
                  for (final part in parts)
                    _buildItemRow(part['description'] as String, part['qty'] as int, part['price'] as double, textPrimary, textSecondary),

                  const SizedBox(height: 14),
                  const Divider(height: 1),
                  const SizedBox(height: 14),

                  // Calculation
                  _buildSummaryRow('Subtotal', '\$${subtotal.toStringAsFixed(2)}', textPrimary, textSecondary),
                  const SizedBox(height: 6),
                  _buildSummaryRow('Applicable Sales Tax', '\$${taxAmount.toStringAsFixed(2)}', textPrimary, textSecondary),
                  const SizedBox(height: 6),
                  _buildSummaryRow('Escrow Guarantee & Protection', 'FREE', AppColors.verifiedEmerald, textSecondary),
                  const SizedBox(height: 12),
                  const Divider(height: 1),
                  const SizedBox(height: 12),

                  // Total Paid
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Total Amount Paid',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: textPrimary,
                        ),
                      ),
                      Text(
                        '\$${grandTotal.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Actions & Protection Banner
            Container(
              decoration: BoxDecoration(
                color: (isDark ? AppColors.nightPrimary : AppColors.dayPrimary).withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: (isDark ? AppColors.nightPrimary : AppColors.dayPrimary).withOpacity(0.2),
                ),
              ),
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  Icon(
                    Icons.shield_outlined,
                    color: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '100% ServiceOS Guarantee Backed',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: textPrimary,
                          ),
                        ),
                        Text(
                          'All workmanship backed by our 30-day rework warranty. Funds held in Stripe escrow until customer sign-off.',
                          style: TextStyle(fontSize: 11, color: textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Bottom Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: textPrimary,
                      side: BorderSide(color: borderColor),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Dispute & Warranty Support form opened.')),
                      );
                    },
                    icon: const Icon(Icons.report_problem_outlined, size: 18),
                    label: const Text('Report Issue', style: TextStyle(fontWeight: FontWeight.w600)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isDark ? AppColors.nightPrimary : AppColors.dayPrimary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('PDF invoice saved to downloads.')),
                      );
                      onDownloadPdf?.call();
                    },
                    icon: const Icon(Icons.download, size: 18),
                    label: const Text('Export PDF', style: TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildItemRow(String name, int qty, double price, Color textPrimary, Color textSecondary) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              '$name ${qty > 1 ? "(x$qty)" : ""}',
              style: TextStyle(fontSize: 13, color: textPrimary),
            ),
          ),
          Text(
            '\$${price.toStringAsFixed(2)}',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String title, String value, Color valueColor, Color textSecondary) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: TextStyle(fontSize: 13, color: textSecondary)),
        Text(value, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: valueColor)),
      ],
    );
  }
}
