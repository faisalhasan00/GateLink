import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class OnboardSocietySuccessDialog extends StatelessWidget {
  final String societyName;
  final int flats;
  final String utrNumber;
  final int monthlyPassive;
  final String adminPhone;
  final String societyId;

  const OnboardSocietySuccessDialog({
    super.key,
    required this.societyName,
    required this.flats,
    required this.utrNumber,
    required this.monthlyPassive,
    required this.adminPhone,
    required this.societyId,
  });

  static void show(
    BuildContext context, {
    required String societyName,
    required int flats,
    required String utrNumber,
    required int monthlyPassive,
    required String adminPhone,
    required String societyId,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => OnboardSocietySuccessDialog(
        societyName: societyName,
        flats: flats,
        utrNumber: utrNumber,
        monthlyPassive: monthlyPassive,
        adminPhone: adminPhone,
        societyId: societyId,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: AppColors.successLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.verified_rounded, color: AppColors.success, size: 24),
          ),
          const SizedBox(width: 10),
          const Expanded(
            child: Text('Society Onboarded!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
          ),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$societyName ($flats Flats) is live on GateLink!',
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '✓ ₹500 Cash Disbursed Instant Payout',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.success),
                ),
                Text(
                  'Bank UTR: $utrNumber',
                  style: const TextStyle(fontSize: 10, fontFamily: 'monospace', color: AppColors.textSecondary),
                ),
                const SizedBox(height: 6),
                Text(
                  '⚡ + ₹$monthlyPassive /month recurring income started!',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text('RWA Admin Credentials:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
          Text(
            'Admin Portal: app.gatelink.in\nMobile: $adminPhone\nSociety Code: $societyId',
            style: const TextStyle(fontSize: 11, color: AppColors.textPrimary),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Done & Close', style: TextStyle(fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}
