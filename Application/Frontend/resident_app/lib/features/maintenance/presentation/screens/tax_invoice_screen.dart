import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class TaxInvoiceScreen extends StatelessWidget {
  final String invoiceNumber;
  final double amount;
  final String transactionId;
  final String? billingPeriod;
  final String? paymentMethod;
  final String? residentName;
  final String? flatNumber;
  final String? societyName;
  final String? paidAt;

  const TaxInvoiceScreen({
    super.key,
    required this.invoiceNumber,
    required this.amount,
    required this.transactionId,
    this.billingPeriod,
    this.paymentMethod,
    this.residentName,
    this.flatNumber,
    this.societyName,
    this.paidAt,
  });

  void _shareInvoiceSummary(BuildContext context) {
    final text = '''
🧾 *GateLink Official Tax Receipt & Invoice*
----------------------------------------
Invoice #: $invoiceNumber
Society: ${societyName ?? 'HomeHni Residency'}
Resident: ${residentName ?? 'Resident Owner'} (${flatNumber ?? 'Flat A-402'})
Billing Period: ${billingPeriod ?? 'Current Month'}

Amount Paid: ₹${amount.toStringAsFixed(2)}
Payment Status: PAID & VERIFIED ✓
Payment Method: ${paymentMethod ?? 'Online Cashfree Gateway'}
Transaction Ref / UTR: $transactionId
SAC Code: 999598 (Services by RWAs)

Issued via GateLink Society OS (gatelink.in)
----------------------------------------
''';
    Share.share(text, subject: 'Tax Invoice $invoiceNumber');
  }

  void _downloadInvoicePdf(BuildContext context) {
    _shareInvoiceSummary(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Tax Invoice $invoiceNumber receipt summary shared.'),
        backgroundColor: AppColors.primary,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final displayPeriod = billingPeriod ?? 'August 2026';
    final displayResident = residentName ?? 'Resident Owner';
    final displayFlat = flatNumber ?? 'Wing A - 402';
    final displaySociety = societyName ?? 'HomeHni Smart Residency';
    final displayDate = paidAt ?? '27 Aug 2026, 10:15 AM';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Tax Invoice & Receipt',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.textPrimary,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
          onPressed: () {
            if (Navigator.canPop(context)) {
              Navigator.pop(context);
            }
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded, color: AppColors.primary),
            tooltip: 'Share Invoice',
            onPressed: () => _shareInvoiceSummary(context),
          ),
          IconButton(
            icon: const Icon(Icons.picture_as_pdf_rounded, color: AppColors.primary),
            tooltip: 'Download PDF',
            onPressed: () => _downloadInvoicePdf(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          children: [
            // Main Official Tax Invoice Card
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.xl),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAlignment.start,
                children: [
                  // Top Header Banner (Navy Primary Token)
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    decoration: const BoxDecoration(
                      color: Color(0xFF1E3A8A), // Navy Primary
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(AppRadius.xl),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAlignment.start,
                            children: [
                              Text(
                                displaySociety.toUpperCase(),
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Official Society OS  •  gatelink.in',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFFE0F2FE),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'GSTIN: 07AAAAA0000A1Z5  •  SAC: 999598',
                                style: TextStyle(
                                  fontSize: 10,
                                  color: Color(0xFFBAE6FD),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981), // Green Paid Stamp
                            borderRadius: BorderRadius.circular(AppRadius.full),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.check_circle_rounded,
                                  color: Colors.white, size: 14),
                              SizedBox(width: 4),
                              Text(
                                'PAID',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w900,
                                  fontSize: 12,
                                  letterSpacing: 1,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Invoice Details Section
                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    child: Column(
                      crossAxisAlignment: CrossAlignment.start,
                      children: [
                        // Invoice # & Date Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAlignment.start,
                              children: [
                                const Text(
                                  'INVOICE NUMBER',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.textSecondary,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  invoiceNumber,
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w900,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAlignment.end,
                              children: [
                                const Text(
                                  'PAYMENT DATE',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.textSecondary,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  displayDate,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),

                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 14),
                          child: Divider(color: Color(0xFFE2E8F0)),
                        ),

                        // Billed To Box
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(AppRadius.md),
                            border: Border.all(color: const Color(0xFFF1F5F9)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAlignment.start,
                            children: [
                              const Text(
                                'BILLED TO (RESIDENT OWNER)',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.primary,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                displayResident,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Flat Unit: $displayFlat  •  Billing Period: $displayPeriod',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textSecondary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: AppSpacing.lg),

                        // Itemized Table Header
                        const Text(
                          'ITEMIZED CHARGES BREAKDOWN',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: AppColors.textSecondary,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 10),

                        _buildLineItem('Monthly Maintenance Charge',
                            amount > 500 ? (amount - 300) : amount),
                        if (amount > 500) ...[
                          const SizedBox(height: 6),
                          _buildLineItem('Water & Common Utility Surcharge', 200.0),
                          const SizedBox(height: 6),
                          _buildLineItem('Security & Reserve Fund Contribution', 100.0),
                        ],

                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 12),
                          child: Divider(color: Color(0xFFE2E8F0)),
                        ),

                        // Total Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'TOTAL AMOUNT PAID',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            Text(
                              '₹${amount.toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF1E3A8A), // Navy Primary
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: AppSpacing.lg),

                        // Audit Trail Box
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(AppRadius.md),
                            border: Border.all(color: const Color(0xFFBFDBFE)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAlignment.start,
                            children: [
                              const Text(
                                'PAYMENT AUDIT TRAIL',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF1E40AF),
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 6),
                              _buildAuditRow('Payment Gateway',
                                  paymentMethod ?? 'Online Cashfree Gateway'),
                              const SizedBox(height: 4),
                              _buildAuditRow('Gateway Ref / UTR', transactionId,
                                  isMono: true),
                              const SizedBox(height: 4),
                              _buildAuditRow('Status Verification', 'Verified & Settled Instant'),
                            ],
                          ),
                        ),

                        const SizedBox(height: AppSpacing.lg),

                        // IT Act Disclaimer
                        const Center(
                          child: Text(
                            'Computer-generated Tax Invoice & Digital Receipt issued via GateLink Society OS (gatelink.in). Valid without physical signature under Section 13(2) of IT Act 2000.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 10,
                              color: AppColors.textSecondary,
                              height: 1.4,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.xl),

            // Bottom Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _shareInvoiceSummary(context),
                    icon: const Icon(Icons.share_rounded, size: 18),
                    label: const Text('Share Invoice'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: const BorderSide(color: AppColors.primary),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _downloadInvoicePdf(context),
                    icon: const Icon(Icons.download_rounded, size: 18),
                    label: const Text('Save / Download'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLineItem(String title, double itemAmount) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Text(
          '₹${itemAmount.toStringAsFixed(2)}',
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildAuditRow(String label, String value, {bool isMono = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          '$label:',
          style: const TextStyle(
            fontSize: 11,
            color: Color(0xFF3B82F6),
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.end,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: const Color(0xFF1E3A8A),
              fontFamily: isMono ? 'monospace' : null,
            ),
          ),
        ),
      ],
    );
  }
}
