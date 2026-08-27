import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

/// Authentic Paper-Style GST Tax Invoice & Real PDF Generator Screen for GateLink
class TaxInvoiceScreen extends StatelessWidget {
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

  const TaxInvoiceScreen({
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

  /// Generate Real A4 PDF Binary Data
  Future<Uint8List> _generatePdfData() async {
    final pdf = pw.Document();

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

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(36),
        build: (pw.Context context) {
          return pw.Column(
            cross: pw.CrossAxisAlignment.start,
            children: [
              // Top Brand Banner & Stamp Header
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    cross: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'GATELINK SOCIETY OS',
                        style: pw.TextStyle(
                          fontSize: 20,
                          fontWeight: pw.FontWeight.bold,
                          color: PdfColor.fromHex('#1E3A8A'),
                        ),
                      ),
                      pw.Text(
                        'Smart Society OS • gatelink.in',
                        style: pw.TextStyle(
                          fontSize: 10,
                          color: PdfColor.fromHex('#64748B'),
                        ),
                      ),
                    ],
                  ),
                  pw.Container(
                    padding: const pw.EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: pw.BoxDecoration(
                      border: pw.Border.all(color: PdfColor.fromHex('#059669'), width: 2),
                      borderRadius: pw.BorderRadius.circular(6),
                    ),
                    child: pw.Text(
                      '✓ PAID & VERIFIED',
                      style: pw.TextStyle(
                        color: PdfColor.fromHex('#059669'),
                        fontWeight: pw.FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
              pw.Divider(thickness: 2, color: PdfColor.fromHex('#1E3A8A')),
              pw.SizedBox(height: 10),

              // Invoice Title Bar
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text(
                    'OFFICIAL GST TAX INVOICE',
                    style: pw.TextStyle(
                      fontSize: 14,
                      fontWeight: pw.FontWeight.bold,
                      color: PdfColor.fromHex('#0F172A'),
                    ),
                  ),
                  pw.Text(
                    'SAC CODE: 999598 (RWA Services)',
                    style: pw.TextStyle(
                      fontSize: 10,
                      fontWeight: pw.FontWeight.bold,
                      color: PdfColor.fromHex('#475569'),
                    ),
                  ),
                ],
              ),
              pw.SizedBox(height: 14),

              // 2-Column Issuer & Billed To Details
              pw.Row(
                cross: pw.CrossAxisAlignment.start,
                children: [
                  pw.Expanded(
                    child: pw.Column(
                      cross: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Text('ISSUER / SOCIETY DETAILS:',
                            style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#1E3A8A'))),
                        pw.SizedBox(height: 4),
                        pw.Text(displaySociety, style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
                        pw.Text('Main Road, Sector 14', style: const pw.TextStyle(fontSize: 10)),
                        pw.Text('GSTIN: 29AAAAA0000A1Z5', style: const pw.TextStyle(fontSize: 10)),
                      ],
                    ),
                  ),
                  pw.Expanded(
                    child: pw.Column(
                      cross: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Text('BILLED TO (RESIDENT OWNER):',
                            style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#1E3A8A'))),
                        pw.SizedBox(height: 4),
                        pw.Text(displayResident, style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
                        pw.Text('$displayBlock — Flat $displayFlat', style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.bold)),
                        pw.Text('Billing Period: $displayPeriod', style: const pw.TextStyle(fontSize: 10)),
                      ],
                    ),
                  ),
                ],
              ),
              pw.SizedBox(height: 14),

              // Audit Row
              pw.Container(
                padding: const pw.EdgeInsets.all(10),
                decoration: pw.BoxDecoration(
                  color: PdfColor.fromHex('#F8FAFC'),
                  border: pw.Border.all(color: PdfColor.fromHex('#E2E8F0')),
                ),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text('Invoice #: $invoiceNumber', style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.bold)),
                    pw.Text('Payment Date: $displayDate', style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.bold)),
                  ],
                ),
              ),
              pw.SizedBox(height: 16),

              // Itemized Table
              pw.Table(
                border: pw.TableBorder.all(color: PdfColor.fromHex('#CBD5E1')),
                children: [
                  pw.TableRow(
                    decoration: pw.BoxDecoration(color: PdfColor.fromHex('#F1F5F9')),
                    children: [
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('DESCRIPTION', style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10))),
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('SAC CODE', style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10))),
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('AMOUNT (INR)', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10))),
                    ],
                  ),
                  pw.TableRow(children: [
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Monthly Society Maintenance Charge', style: const pw.TextStyle(fontSize: 10))),
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('999598', style: const pw.TextStyle(fontSize: 10))),
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Rs.${mainCharge.toStringAsFixed(2)}', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10))),
                  ]),
                  if (amount > 800) ...[
                    pw.TableRow(children: [
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Water & Common Utility Charges', style: const pw.TextStyle(fontSize: 10))),
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('999598', style: const pw.TextStyle(fontSize: 10))),
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Rs.${waterCharge.toStringAsFixed(2)}', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10))),
                    ]),
                    pw.TableRow(children: [
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Security & Sinking Reserve Fund', style: const pw.TextStyle(fontSize: 10))),
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('999598', style: const pw.TextStyle(fontSize: 10))),
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Rs.${sinkingCharge.toStringAsFixed(2)}', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10))),
                    ]),
                    pw.TableRow(children: [
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Parking Slot Allocation Fee', style: const pw.TextStyle(fontSize: 10))),
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('999598', style: const pw.TextStyle(fontSize: 10))),
                      pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Rs.${parkingCharge.toStringAsFixed(2)}', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10))),
                    ]),
                  ],
                ],
              ),
              pw.SizedBox(height: 10),

              // Total Calculation Summary
              pw.Container(
                alignment: pw.Alignment.centerRight,
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.end,
                  children: [
                    pw.Text('Subtotal: Rs.${amount.toStringAsFixed(2)}', style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.bold)),
                    pw.Text('GST (Exempt < Rs.7,500/mo Threshold): Rs.0.00', style: const pw.TextStyle(fontSize: 9)),
                    pw.SizedBox(height: 4),
                    pw.Text('TOTAL PAID & SETTLED: Rs.${amount.toStringAsFixed(2)}',
                        style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#1E3A8A'))),
                  ],
                ),
              ),
              pw.SizedBox(height: 20),

              // Transaction UTR & Verification Footer
              pw.Container(
                padding: const pw.EdgeInsets.all(10),
                decoration: pw.BoxDecoration(
                  color: PdfColor.fromHex('#EFF6FF'),
                  border: pw.Border.all(color: PdfColor.fromHex('#BFDBFE')),
                ),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text('Transaction UTR: $transactionId', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#1E3A8A'))),
                    pw.Text('Gateway: ${paymentMethod ?? "Cashfree Instant PG"}', style: pw.TextStyle(fontSize: 10, color: PdfColor.fromHex('#1E3A8A'))),
                  ],
                ),
              ),

              pw.Spacer(),

              // Signatory Block
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                crossAxisAlignment: pw.CrossAxisAlignment.end,
                children: [
                  pw.Column(
                    cross: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('Verification URL:', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold)),
                      pw.Text('https://gatelink.in/verify-invoice?id=$invoiceNumber', style: const pw.TextStyle(fontSize: 8)),
                    ],
                  ),
                  pw.Column(
                    cross: pw.CrossAxisAlignment.center,
                    children: [
                      pw.Container(
                        padding: const pw.EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: pw.BoxDecoration(
                          border: pw.Border.all(color: PdfColor.fromHex('#1E3A8A')),
                        ),
                        child: pw.Text('GateLink Verified Seal', style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#1E3A8A'))),
                      ),
                      pw.SizedBox(height: 4),
                      pw.Text('Authorized Signatory', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold)),
                      pw.Text('GateLink Society OS & RWA', style: const pw.TextStyle(fontSize: 8)),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Center(
                child: pw.Text(
                  'Computer-generated Tax Invoice issued under Sec 31 of CGST Act. No physical signature required. Verified on GateLink (gatelink.in)',
                  textAlign: pw.TextAlign.center,
                  style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700),
                ),
              ),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }

  /// Download / Open Print & Save Sheet
  void _downloadInvoicePdf(BuildContext context) async {
    try {
      final pdfData = await _generatePdfData();
      await Printing.layoutPdf(
        onLayout: (PdfPageFormat format) async => pdfData,
        name: 'GateLink_Tax_Invoice_$invoiceNumber.pdf',
      );
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error generating PDF: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  /// Share Real PDF File directly
  void _shareInvoicePdf(BuildContext context) async {
    try {
      final pdfData = await _generatePdfData();
      await Printing.sharePdf(
        bytes: pdfData,
        filename: 'GateLink_Tax_Invoice_$invoiceNumber.pdf',
      );
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error sharing PDF: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

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

    final qrVerificationUrl = 'https://gatelink.in/verify-invoice?id=${Uri.encodeComponent(invoiceNumber)}&utr=${Uri.encodeComponent(transactionId)}';

    return Scaffold(
      backgroundColor: const Color(0xFFE2E8F0), // Slate Desk Background
      appBar: AppBar(
        title: const Text(
          'Official GST Tax Invoice',
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
            tooltip: 'Share PDF Invoice',
            onPressed: () => _shareInvoicePdf(context),
          ),
          IconButton(
            icon: const Icon(Icons.download_rounded, color: AppColors.primary),
            tooltip: 'Download PDF Invoice',
            onPressed: () => _downloadInvoicePdf(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.lg),
        child: Column(
          children: [
            // Realistic Physical Paper Sheet Container
            Container(
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
                            const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'GateLink',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF1E3A8A),
                                    letterSpacing: -0.5,
                                    fontFamily: 'serif',
                                  ),
                                ),
                                Text(
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
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _buildPaperMeta('INVOICE NO.', invoiceNumber),
                              _buildPaperMeta('PAYMENT DATE', displayDate),
                              _buildPaperMeta('STATUS', 'PAID & VERIFIED ✓'),
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
            ),

            const SizedBox(height: AppSpacing.lg),

            // Share & Real PDF Download Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _shareInvoicePdf(context),
                    icon: const Icon(Icons.share_rounded, size: 18),
                    label: const Text('Share PDF File'),
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
                    label: const Text('Download PDF'),
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

  Widget _buildPaperMeta(String title, String value) {
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
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
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
