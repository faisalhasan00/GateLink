import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class PrivacyPolicySheet extends StatelessWidget {
  const PrivacyPolicySheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      ),
      builder: (ctx) => const PrivacyPolicySheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.shield_outlined, color: AppColors.primary),
              SizedBox(width: 8),
              Text(
                'Privacy & Data Protection',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'GateLink is ISO 27001 certified and complies with India\'s Digital Personal Data Protection (DPDP) Act 2023.',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 16),
          ListTile(
            leading: const Icon(Icons.privacy_tip_outlined,
                color: AppColors.primary),
            title: const Text('Read Privacy Policy',
                style: TextStyle(fontWeight: FontWeight.w600)),
            subtitle: const Text('https://gatelink.in/privacy'),
            onTap: () async {
              Navigator.pop(context);
              final Uri uri = Uri.parse('https://gatelink.in/privacy');
              try {
                await launchUrl(uri,
                    mode: LaunchMode.externalApplication);
              } catch (_) {}
            },
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.description_outlined,
                color: AppColors.primary),
            title: const Text('Read Terms of Service',
                style: TextStyle(fontWeight: FontWeight.w600)),
            subtitle: const Text('https://gatelink.in/terms'),
            onTap: () async {
              Navigator.pop(context);
              final Uri uri = Uri.parse('https://gatelink.in/terms');
              try {
                await launchUrl(uri,
                    mode: LaunchMode.externalApplication);
              } catch (_) {}
            },
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }
}
