import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

import '../../../../core/widgets/partner_logo.dart';

class MarketingToolkitScreen extends StatelessWidget {
  final String refCode;
  final String partnerName;

  const MarketingToolkitScreen({
    super.key,
    required this.refCode,
    required this.partnerName,
  });

  void _sharePosterOnWhatsApp(BuildContext context) async {
    final link = 'https://gatelink.in/partners?ref=$refCode';
    final message = Uri.encodeComponent(
      '🏢 Upgrade Your Housing Society Gated Security with GateLink Gatekeeper OS!\n\n'
      '• Automated Visitor Verification & QR Kiosk\n'
      '• Instant Maintenance UPI Billing & Accounting\n'
      '• Resident Mobile App & Guard Gatepass Tablet\n\n'
      'Book a Free Demo for your Society:\n'
      '🔗 $link\n\n'
      'Introduced by: $partnerName (Official Channel Partner)'
    );
    final uri = Uri.parse('https://wa.me/?text=$message');

    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not launch WhatsApp.')),
        );
      }
    }
  }

  void _copyReferralLink(BuildContext context) {
    final link = 'https://gatelink.in/partners?ref=$refCode';
    Clipboard.setData(ClipboardData(text: link));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✓ Custom Partner Link copied to clipboard!'),
        backgroundColor: AppColors.success,
      ),
    );
  }

  void _openInstagramPage(BuildContext context) async {
    final uri = Uri.parse('https://www.instagram.com/gatelink.in?igsi=MWpoNXVsbDF2czQ2Ng==');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open Instagram.')),
        );
      }
    }
  }

  void _openLinkedInPage(BuildContext context) async {
    final uri = Uri.parse('https://www.linkedin.com/company/gatelink-technologies');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open LinkedIn.')),
        );
      }
    }
  }

  void _openYouTubeChannel(BuildContext context) async {
    final uri = Uri.parse('https://www.youtube.com/@GateLinkIndia');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open YouTube Channel.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final targetUrl = 'https://gatelink.in/partners?ref=$refCode';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Partner Marketing Toolkit', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Intro Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: AppColors.secondaryLight,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                border: Border.all(color: const Color(0xFFBAE6FD)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.qr_code_2_rounded, size: 36, color: AppColors.primary),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Your Digital Partner Standee',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primary),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Show this QR code to RWA Secretaries or share via WhatsApp to register leads instantly.',
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Printable QR Standee Mockup Card
            Center(
              child: Container(
                width: 300,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.xl),
                  border: Border.all(color: AppColors.primary, width: 2),
                  boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 16, offset: Offset(0, 6))],
                ),
                child: Column(
                  children: [
                    const PartnerLogo(
                      size: PartnerLogoSize.medium,
                      showTagline: false,
                      isDark: false,
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(AppRadius.pill),
                      ),
                      child: const Text(
                        'OFFICIAL CHANNEL PARTNER',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 0.5),
                      ),
                    ),
                    const SizedBox(height: 12),

                    Text(
                      partnerName,
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                    ),
                    Text(
                      'Ref Code: $refCode',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.secondary),
                    ),
                    const SizedBox(height: 16),

                    // QR Flutter Render
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: QrImageView(
                        data: targetUrl,
                        version: QrVersions.auto,
                        size: 180.0,
                        backgroundColor: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16),

                    const Text(
                      'Scan to Onboard Society &\nEarn Instant Cash Bonus',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Actions
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () => _sharePosterOnWhatsApp(context),
                icon: const Icon(Icons.share_rounded, size: 18),
                label: const Text('Share Digital Brochure on WhatsApp', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF25D366),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () => _openInstagramPage(context),
                icon: const Icon(Icons.camera_alt_rounded, size: 18),
                label: const Text('Official Instagram (@gatelink.in)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE1306C),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () => _openLinkedInPage(context),
                icon: const Icon(Icons.business_rounded, size: 18),
                label: const Text('Official LinkedIn (GateLink Technologies)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0A66C2),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () => _openYouTubeChannel(context),
                icon: const Icon(Icons.play_circle_fill_rounded, size: 18),
                label: const Text('Official YouTube (@GateLinkIndia)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF0000),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton.icon(
                onPressed: () => _copyReferralLink(context),
                icon: const Icon(Icons.copy_rounded, size: 18),
                label: const Text('Copy Referral Link', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                style: OutlinedButton.styleFrom(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
