import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../onboarding/presentation/widgets/onboard_society_modal.dart';
import '../../../leads/presentation/widgets/submit_lead_modal.dart';
import '../../../profile/presentation/widgets/edit_partner_category_modal.dart';
import '../../../auth/presentation/screens/registration_audit_log_screen.dart';
import '../../../wallet/presentation/screens/payout_audit_ledger_screen.dart';

class PartnerDashboardQuickActions extends StatelessWidget {
  final String partnerName;
  final String partnerPhone;
  final String? partnerEmail;
  final String? partnerUpi;

  const PartnerDashboardQuickActions({
    super.key,
    required this.partnerName,
    required this.partnerPhone,
    this.partnerEmail,
    this.partnerUpi,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              flex: 6,
              child: ElevatedButton.icon(
                onPressed: () => OnboardSocietyModal.show(
                  context,
                  partnerName: partnerName,
                  partnerPhone: partnerPhone,
                  partnerEmail: partnerEmail,
                  partnerUpi: partnerUpi,
                ),
                icon: const Icon(Icons.bolt_rounded, size: 18),
                label: const Text('⚡ Onboard Society Directly', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.success,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              flex: 5,
              child: ElevatedButton.icon(
                onPressed: () => SubmitLeadModal.show(
                  context,
                  partnerName: partnerName,
                  partnerPhone: partnerPhone,
                  partnerEmail: partnerEmail,
                  partnerUpi: partnerUpi,
                ),
                icon: const Icon(Icons.add_business_rounded, size: 16),
                label: const Text('Submit Lead', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => EditPartnerCategoryModal.show(context),
                icon: const Icon(Icons.manage_accounts_rounded, size: 14, color: AppColors.primary),
                label: const Text('Category', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
            const SizedBox(width: 6),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const RegistrationAuditLogScreen()),
                ),
                icon: const Icon(Icons.verified_user_rounded, size: 14, color: AppColors.primary),
                label: const Text('Audit Log', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
            const SizedBox(width: 6),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => PayoutAuditLedgerScreen(
                      partnerPhone: partnerPhone,
                      partnerEmail: partnerEmail,
                    ),
                  ),
                ),
                icon: const Icon(Icons.receipt_long_rounded, size: 14, color: AppColors.primary),
                label: const Text('Ledger', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
