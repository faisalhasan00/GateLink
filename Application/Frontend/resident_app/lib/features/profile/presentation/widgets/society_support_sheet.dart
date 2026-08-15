import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class SocietySupportSheet extends ConsumerWidget {
  final String societyName;

  const SocietySupportSheet({
    super.key,
    required this.societyName,
  });

  static void show(BuildContext context, {required String societyName}) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xxl)),
      ),
      builder: (_) => SocietySupportSheet(societyName: societyName),
    );
  }

  void _callOrLaunch(String target) async {
    final clean = target.replaceAll(RegExp(r'\s+'), '');
    if (clean.contains('@')) {
      final Uri uri = Uri.parse('mailto:$clean');
      if (await canLaunchUrl(uri)) await launchUrl(uri);
    } else {
      final Uri uri = Uri.parse('tel:$clean');
      if (await canLaunchUrl(uri)) await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gatePhone = ref.watch(societySecurityPhoneProvider);
    final societyDoc = ref.watch(societyDetailsStreamProvider).value ?? {};
    final adminEmail = societyDoc['email'] ?? 'admin@gatelink.in';

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Society Help & Support',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Official contact channels for $societyName',
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            _SupportTile(
              icon: Icons.shield_outlined,
              iconColor: AppColors.primary,
              title: 'Main Gate Security Desk',
              subtitle: 'Gatekeeper & security live support',
              phone: gatePhone,
              onTap: () => _callOrLaunch(gatePhone),
            ),
            const SizedBox(height: AppSpacing.sm),
            _SupportTile(
              icon: Icons.admin_panel_settings_outlined,
              iconColor: AppColors.secondary,
              title: 'Society Admin Office',
              subtitle: 'Maintenance, NOC & resident queries',
              phone: adminEmail.toString(),
              onTap: () => _callOrLaunch(adminEmail.toString()),
            ),
            const SizedBox(height: AppSpacing.sm),
            _SupportTile(
              icon: Icons.emergency_outlined,
              iconColor: AppColors.error,
              title: 'National Emergency Response',
              subtitle: 'Police, Fire, Ambulance',
              phone: '112 / 108',
              onTap: () => _callOrLaunch('112'),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
        ),
      ),
    );
  }
}

class _SupportTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final String phone;
  final VoidCallback onTap;

  const _SupportTile({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.phone,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(color: AppColors.border),
              ),
              child: Text(
                phone,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: iconColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
