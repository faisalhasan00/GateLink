import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class EmergencyContactsWidget extends StatelessWidget {
  const EmergencyContactsWidget({super.key});

  void _callNumber(String phone) async {
    final Uri uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final contacts = [
      {'name': 'Security Desk', 'phone': '+91 98201 11111', 'icon': Icons.security_rounded, 'color': AppColors.primary},
      {'name': 'Society Office', 'phone': '+91 98201 22222', 'icon': Icons.business_rounded, 'color': AppColors.secondary},
      {'name': 'Plumber & Electrician', 'phone': '+91 98201 33333', 'icon': Icons.build_rounded, 'color': AppColors.warning},
      {'name': 'Emergency Ambulance', 'phone': '108', 'icon': Icons.local_hospital_rounded, 'color': AppColors.error},
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
          final phone = c['phone'] as String;

          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundColor: color.withOpacity(0.1),
                  child: Icon(icon, size: 16, color: color),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                ),
                IconButton(
                  onPressed: () => _callNumber(phone),
                  icon: const Icon(Icons.phone_in_talk_rounded, color: AppColors.success, size: 20),
                  constraints: const BoxConstraints(),
                  padding: EdgeInsets.zero,
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
