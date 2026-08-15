import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class EmergencyContactsWidget extends ConsumerWidget {
  const EmergencyContactsWidget({super.key});

  void _callNumber(String phone) async {
    final clean = phone.replaceAll(RegExp(r'\s+'), '');
    final Uri uri = Uri.parse('tel:$clean');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(userProfileProvider).value;
    final societyName = profile?.displaySocietyName ?? 'Society Office';
    final gatePhone = ref.watch(societySecurityPhoneProvider);

    final contacts = [
      {
        'name': 'National Emergency',
        'subtitle': 'Police & Emergency Response',
        'phone': '112',
        'icon': Icons.shield_rounded,
        'color': AppColors.primary
      },
      {
        'name': 'Ambulance & Medical',
        'subtitle': 'National Medical Emergency',
        'phone': '108',
        'icon': Icons.local_hospital_rounded,
        'color': AppColors.error
      },
      {
        'name': 'Fire Emergency',
        'subtitle': 'Fire & Rescue Services',
        'phone': '101',
        'icon': Icons.local_fire_department_rounded,
        'color': AppColors.warning
      },
      {
        'name': 'Society Gate / Security',
        'subtitle': societyName,
        'phone': gatePhone,
        'icon': Icons.security_rounded,
        'color': AppColors.secondary
      },
    ];

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: contacts.map((c) {
          final icon = c['icon'] as IconData;
          final color = c['color'] as Color;
          final name = c['name'] as String;
          final subtitle = c['subtitle'] as String;
          final phone = c['phone'] as String;

          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: color.withValues(alpha: 0.1),
                  child: Icon(icon, size: 18, color: color),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name,
                          style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary)),
                      Text(subtitle,
                          style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary)),
                    ],
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () => _callNumber(phone),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: color.withValues(alpha: 0.1),
                    foregroundColor: color,
                    elevation: 0,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    minimumSize: const Size(64, 32),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.full)),
                  ),
                  icon: const Icon(Icons.phone_rounded, size: 14),
                  label: Text(phone,
                      style: const TextStyle(
                          fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
