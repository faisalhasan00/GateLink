import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../leads/presentation/widgets/submit_lead_modal.dart';

class PartnerDashboardEmptyState extends StatelessWidget {
  final String partnerName;
  final String partnerPhone;

  const PartnerDashboardEmptyState({
    super.key,
    required this.partnerName,
    required this.partnerPhone,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.business_center_outlined, size: 48, color: AppColors.primary),
          ),
          const SizedBox(height: 16),
          const Text(
            'No Leads Submitted Yet',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 6),
          const Text(
            'Start earning ₹500 instant Cashfree bonus + 2% monthly recurring commissions by submitting your first society lead or onboarding a society directly.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () => SubmitLeadModal.show(context, partnerName: partnerName, partnerPhone: partnerPhone),
            icon: const Icon(Icons.add_business_rounded, size: 18),
            label: const Text('Submit First Lead', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
            ),
          ),
        ],
      ),
    );
  }
}
