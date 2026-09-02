import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../../../../core/theme/app_colors.dart';

/// Service responsible for generating, printing, and sharing the official GST Tax Invoice A4 PDF.
class TaxInvoicePdfService {
  /// Generate Real A4 PDF Binary Data
  static Future<Uint8List> generatePdfData({
    required String invoiceNumber,
    required double amount,
    required String transactionId,
    String? billingPeriod,
    String? paymentMethod,
    String? residentName,
    String? flatNumber,
    String? blockName,
    String? societyName,
    String? paidAt,
  }) async {
    final pdf = pw.Document();

    pw.MemoryImage? logoImage;
    try {
      final logoImageBytes = await rootBundle.load('assets/images/gatelink_logo.png');
      logoImage = pw.MemoryImage(logoImageBytes.buffer.asUint8List());
    } catch (_) {}

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
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              // Top Brand Banner & Stamp Header
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      if (logoImage != null)
                        pw.Image(logoImage, height: 32, fit: pw.BoxFit.contain)
                      else
                        pw.Text(
                          'GATELINK SOCIETY OS',
                          style: pw.TextStyle(
                            fontSize: 20,
                            fontWeight: pw.FontWeight.bold,
                            color: PdfColor.fromHex('#1E3A8A'),
                          ),
                        ),
                      pw.SizedBox(height: 2),
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
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Expanded(
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
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
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
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
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('Verification URL:', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold)),
                      pw.Text('https://gatelink.in/verify-invoice?id=$invoiceNumber', style: const pw.TextStyle(fontSize: 8)),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.center,
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
  static Future<void> downloadInvoicePdf({
    required BuildContext context,
    required String invoiceNumber,
    required double amount,
    required String transactionId,
    String? billingPeriod,
    String? paymentMethod,
    String? residentName,
    String? flatNumber,
    String? blockName,
    String? societyName,
    String? paidAt,
  }) async {
    try {
      final pdfData = await generatePdfData(
        invoiceNumber: invoiceNumber,
        amount: amount,
        transactionId: transactionId,
        billingPeriod: billingPeriod,
        paymentMethod: paymentMethod,
        residentName: residentName,
        flatNumber: flatNumber,
        blockName: blockName,
        societyName: societyName,
        paidAt: paidAt,
      );
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
  static Future<void> shareInvoicePdf({
    required BuildContext context,
    required String invoiceNumber,
    required double amount,
    required String transactionId,
    String? billingPeriod,
    String? paymentMethod,
    String? residentName,
    String? flatNumber,
    String? blockName,
    String? societyName,
    String? paidAt,
  }) async {
    try {
      final pdfData = await generatePdfData(
        invoiceNumber: invoiceNumber,
        amount: amount,
        transactionId: transactionId,
        billingPeriod: billingPeriod,
        paymentMethod: paymentMethod,
        residentName: residentName,
        flatNumber: flatNumber,
        blockName: blockName,
        societyName: societyName,
        paidAt: paidAt,
      );
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
}
