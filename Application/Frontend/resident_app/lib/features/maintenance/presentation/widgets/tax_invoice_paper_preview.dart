import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/theme/app_spacing.dart';

/// Widget rendering the realistic, paper-style tax invoice preview with stamps, breakdowns, and QR code.
class TaxInvoicePaperPreview extends StatelessWidget {
  final String invoiceNumber;
  final double amount;
  final String transactionId;
  final String? billingPeriod;
  final String? paymentMethod;
  final String? residentName;
  final String? flatNumber;
  final String? blockName;
  final String? societyName;
  final String? paidAt;

  const TaxInvoicePaperPreview({
    super.key,
    required this.invoiceNumber,
    required this.amount,
    required this.transactionId,
    this.billingPeriod,
    this.paymentMethod,
    this.residentName,
    this.flatNumber,
    this.blockName,
    this.societyName,
    this.paidAt,
  });

  @override
  Widget build(BuildContext context) {
    final displayPeriod = billingPeriod ?? 'August 2026';
    final displayResident = residentName ?? 'Mohammed Faisal Hasan';
    final displayFlat = flatNumber ?? '402';
    final displayBlock = blockName ?? 'Block A';
    final displaySociety = societyName ?? 'Royal Residency Apartments RWA';
    final displayDate = paidAt ?? '27 Aug 2026, 10:15 AM';

    final double mainCharge = amount > 800 ? (amount - 800) : amount;
    final double waterCharge = amount > 800 ? 300.0 : 0.0;
    final double sinkingCharge = amount > 800 ? 200.0 : 0.0;
    final double parkingCharge = amount > 800 ? 300.0 : 0.0;

    final qrVerificationUrl =
        'https://gatelink.in/verify-invoice?id=${Uri.encodeComponent(invoiceNumber)}&utr=${Uri.encodeComponent(transactionId)}';

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFFFDF9), // Warm Off-White Cream Paper Texture
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFCBD5E1), width: 1.5),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 16,
            spreadRadius: 2,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Paper Clip Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
            decoration: const BoxDecoration(
              color: Color(0xFF0F172A),
              borderRadius: BorderRadius.vertical(top: Radius.circular(6)),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '📄 PHYSICAL TAX RECEIPT COPY',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF38BDF8),
                    letterSpacing: 1,
                  ),
                ),
                Text(
                  'ORIGINAL FOR RECIPIENT',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. PAPER HEADER - Double Line Rule Stationery Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Image.asset(
                          'assets/images/gatelink_logo.png',
                          height: 38,
                          fit: BoxFit.contain,
                          errorBuilder: (ctx, err, stack) => const Text(
                            'GateLink',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF1E3A8A),
                              letterSpacing: -0.5,
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Smart Society OS • gatelink.in',
                          style: TextStyle(
                            fontSize: 11,
                            color: Color(0xFF475569),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),

                    // Authentic Physical Circular Stamp Watermark
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFF059669), width: 2.5),
                        color: const Color(0xFFECFDF5),
                      ),
                      child: const Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.verified_rounded, color: Color(0xFF059669), size: 20),
                          Text(
                            'VERIFIED',
                            style: TextStyle(
                              fontSize: 8,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF059669),
                            ),
                          ),
                          Text(
                            'PAID',
                            style: TextStyle(
                              fontSize: 7,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF059669),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 12),
                Container(height: 2, color: const Color(0xFF1E3A8A)),
                const SizedBox(height: 2),
                Container(height: 1, color: const Color(0xFF1E3A8A)),
                const SizedBox(height: 14),

                // Title Bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'TAX INVOICE',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                        letterSpacing: 0.5,
                        fontFamily: 'serif',
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: const Color(0xFFCBD5E1)),
                      ),
                      child: const Text(
                        'SAC CODE: 999598',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF334155),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // 2. ISSUER & BILLED-TO 2-COLUMN PAPER GRID
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Issuer Society Info
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'ISSUER / SOCIETY:',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF1E3A8A),
                                letterSpacing: 0.5,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              displaySociety,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              'Main Road, Sector 14',
                              style: TextStyle(fontSize: 10, color: Color(0xFF475569)),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              'GSTIN: 29AAAAA0000A1Z5',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF334155)),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(width: 10),

                    // Billed To Resident Info
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'BILLED TO (RESIDENT):',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF1E3A8A),
                                letterSpacing: 0.5,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              displayResident,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '$displayBlock — Flat $displayFlat',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Period: $displayPeriod',
                              style: const TextStyle(fontSize: 10, color: Color(0xFF475569)),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                // AUDIT STRIP BOX
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        flex: 4,
                        child: _buildPaperMeta('INVOICE NO.', invoiceNumber),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        flex: 4,
                        child: _buildPaperMeta('PAYMENT DATE', displayDate),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        flex: 3,
                        child: _buildPaperMeta('STATUS', 'PAID ✓', valueColor: const Color(0xFF059669)),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // 3. REAL ITEM TABLE
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: const Color(0xFFCBD5E1)),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Column(
                    children: [
                      // Header
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        decoration: const BoxDecoration(
                          color: Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.vertical(top: Radius.circular(5)),
                        ),
                        child: const Row(
                          children: [
                            Expanded(flex: 3, child: Text('DESCRIPTION', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF475569)))),
                            Expanded(flex: 1, child: Text('SAC', textAlign: TextAlign.center, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF475569)))),
                            Expanded(flex: 2, child: Text('AMOUNT (₹)', textAlign: TextAlign.end, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF475569)))),
                          ],
                        ),
                      ),

                      _buildTableRow('Monthly Society Maintenance Charge', '999598', mainCharge),
                      if (amount > 800) ...[
                        const Divider(height: 1, color: Color(0xFFE2E8F0)),
                        _buildTableRow('Water & Common Utility Charges', '999598', waterCharge),
                        const Divider(height: 1, color: Color(0xFFE2E8F0)),
                        _buildTableRow('Security & Sinking Reserve Fund', '999598', sinkingCharge),
                        const Divider(height: 1, color: Color(0xFFE2E8F0)),
                        _buildTableRow('Parking Bay Allocation Fee', '999598', parkingCharge),
                      ],

                      // Total Block
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(
                          color: Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.vertical(bottom: Radius.circular(5)),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Subtotal:', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                                Text('₹${amount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                              ],
                            ),
                            const SizedBox(height: 2),
                            const Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('GST (Exempt < ₹7,500/mo Threshold):', style: TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                                Text('₹0.00', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700)),
                              ],
                            ),
                            const Padding(
                              padding: EdgeInsets.symmetric(vertical: 6),
                              child: Divider(color: Color(0xFFCBD5E1)),
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'NET AMOUNT PAID:',
                                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                                ),
                                Text(
                                  '₹${amount.toStringAsFixed(2)}',
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF1E3A8A)),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 14),

                // UTR & QR CODE VERIFICATION ROW
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFBFDBFE)),
                  ),
                  child: Row(
                    children: [
                      // Verification QR Code
                      QrImageView(
                        data: qrVerificationUrl,
                        version: QrVersions.auto,
                        size: 54.0,
                        eyeStyle: const QrEyeStyle(eyeShape: QrEyeShape.square, color: Color(0xFF1E3A8A)),
                        dataModuleStyle: const QrDataModuleStyle(dataModuleShape: QrDataModuleShape.square, color: Color(0xFF1E3A8A)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'VERIFIED TRANSACTION UTR:',
                              style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF1E40AF), letterSpacing: 0.5),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              transactionId,
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF1E3A8A), fontFamily: 'monospace'),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Gateway: ${paymentMethod ?? "Cashfree Instant PG"}',
                              style: const TextStyle(fontSize: 10, color: Color(0xFF3B82F6)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // SIGNATURE SEAL BLOCK
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Computer Generated Receipt', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                        Text('Sec 31 CGST Act Compliant', style: TextStyle(fontSize: 8, color: Color(0xFF94A3B8))),
                      ],
                    ),
                    Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            border: Border.all(color: const Color(0xFF1E3A8A)),
                            borderRadius: BorderRadius.circular(2),
                          ),
                          child: const Text(
                            'GateLink Digital Signature Seal',
                            style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF1E3A8A)),
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text('Authorized Signatory', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 10),
                const Divider(color: Color(0xFFE2E8F0)),
                const Center(
                  child: Text(
                    'GateLink Society OS (gatelink.in) • Official Document Receipt Copy',
                    style: TextStyle(fontSize: 9, color: Color(0xFF94A3B8), fontStyle: FontStyle.italic),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaperMeta(String title, String value, {Color? valueColor}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 8,
            fontWeight: FontWeight.w900,
            color: Color(0xFF64748B),
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w800,
            color: valueColor ?? const Color(0xFF0F172A),
          ),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }

  Widget _buildTableRow(String description, String sac, double rowAmount) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(
              description,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: Color(0xFF0F172A),
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Text(
              sac,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 9,
                color: Color(0xFF64748B),
                fontFamily: 'monospace',
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              '₹${rowAmount.toStringAsFixed(2)}',
              textAlign: TextAlign.end,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: Color(0xFF0F172A),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
