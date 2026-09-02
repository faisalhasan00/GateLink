import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/services/tax_invoice_pdf_service.dart';
import '../widgets/tax_invoice_paper_preview.dart';
import '../widgets/tax_invoice_action_bar.dart';

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

  void _sharePdf(BuildContext context) {
    TaxInvoicePdfService.shareInvoicePdf(
      context: context,
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
  }

  void _downloadPdf(BuildContext context) {
    TaxInvoicePdfService.downloadInvoicePdf(
      context: context,
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
  }

  @override
  Widget build(BuildContext context) {
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
            onPressed: () => _sharePdf(context),
          ),
          IconButton(
            icon: const Icon(Icons.download_rounded, color: AppColors.primary),
            tooltip: 'Download PDF Invoice',
            onPressed: () => _downloadPdf(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.lg),
        child: Column(
          children: [
            TaxInvoicePaperPreview(
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
            ),
            const SizedBox(height: AppSpacing.lg),
            TaxInvoiceActionBar(
              onShare: () => _sharePdf(context),
              onDownload: () => _downloadPdf(context),
            ),
          ],
        ),
      ),
    );
  }
}
