import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';
import 'audit_row.dart';

class AccountAuditLogView extends StatelessWidget {
  final PartnerUser? partnerUser;

  const AccountAuditLogView({
    super.key,
    required this.partnerUser,
  });

  @override
  Widget build(BuildContext context) {
    if (partnerUser == null) {
      return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: AppColors.border),
        ),
        child: const Center(child: Text('No active partner session found.')),
      );
    }

    final regLogRef = 'REG-LOG-${partnerUser!.phone.isNotEmpty ? partnerUser!.phone : "0000000000"}';

    return FutureBuilder<DocumentSnapshot>(
      future: FirebaseFirestore.instance.collection('partners').doc(partnerUser!.phone).get(),
      builder: (context, snapshot) {
        Map<String, dynamic>? data;
        DateTime? createdAt;

        if (snapshot.hasData && snapshot.data != null && snapshot.data!.exists) {
          data = snapshot.data!.data() as Map<String, dynamic>?;
          if (data != null && data['createdAt'] != null) {
            createdAt = (data['createdAt'] as Timestamp).toDate();
          }
        }

        final formattedDate = createdAt != null
            ? DateFormat('dd MMM yyyy, hh:mm a').format(createdAt)
            : 'Verified & Active';

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                border: Border.all(color: AppColors.border),
                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(AppRadius.pill),
                        ),
                        child: Text(
                          regLogRef,
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.primary),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.successLight,
                          borderRadius: BorderRadius.circular(AppRadius.pill),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.check_circle_rounded, color: AppColors.success, size: 12),
                            SizedBox(width: 4),
                            Text(
                              'VERIFIED PARTNER',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.success),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text('Account Registration Audit Details', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
                  const SizedBox(height: 12),
                  AuditRow(label: 'Registered Name', value: partnerUser!.name, icon: Icons.person_outline_rounded),
                  AuditRow(label: 'Registered Mobile', value: '+91 ${partnerUser!.phone}', icon: Icons.phone_android_rounded),
                  AuditRow(label: 'Email Address', value: partnerUser!.email.isNotEmpty ? partnerUser!.email : 'Not specified', icon: Icons.email_outlined),
                  AuditRow(label: 'Partner Classification', value: partnerUser!.category, icon: Icons.work_outline_rounded),
                  AuditRow(label: 'Payout UPI ID', value: partnerUser!.upiId.isNotEmpty ? partnerUser!.upiId : 'Pending Update', icon: Icons.account_balance_wallet_outlined),
                  AuditRow(label: 'Operating City / Region', value: partnerUser!.city.isNotEmpty ? partnerUser!.city : 'Pan India', icon: Icons.location_city_outlined),
                  AuditRow(label: 'Registration Timestamp', value: formattedDate, icon: Icons.access_time_rounded),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // System Security & Compliance Card
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.successLight,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(color: const Color(0xFFA7F3D0)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.shield_rounded, color: AppColors.success, size: 24),
                  SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'GateLink Authorized Channel Partner',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF065F46)),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Your registration log is linked to automated Cashfree UPI instant payout engine for ₹500 society onboarding bonuses.',
                          style: TextStyle(fontSize: 11, color: Color(0xFF047857), height: 1.3),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
