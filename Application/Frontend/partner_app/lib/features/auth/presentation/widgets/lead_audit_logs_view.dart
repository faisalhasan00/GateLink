import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class LeadAuditLogsView extends StatelessWidget {
  final String cleanPhone;
  final String partnerEmail;

  const LeadAuditLogsView({
    super.key,
    required this.cleanPhone,
    required this.partnerEmail,
  });

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection('partner_leads')
          .orderBy('createdAt', descending: true)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: Padding(padding: EdgeInsets.all(30), child: CircularProgressIndicator()),
          );
        }

        final docs = snapshot.data?.docs ?? [];
        List<Map<String, dynamic>> partnerLeads = [];

        for (final doc in docs) {
          final data = doc.data() as Map<String, dynamic>;
          final leadPhone = (data['partnerPhone'] ?? '').toString().replaceAll(RegExp(r'[^0-9]'), '');
          final leadEmail = (data['partnerEmail'] ?? '').toString().trim().toLowerCase();

          if ((cleanPhone.isNotEmpty && leadPhone.contains(cleanPhone)) ||
              (partnerEmail.isNotEmpty && leadEmail == partnerEmail)) {
            partnerLeads.add(data);
          }
        }

        if (partnerLeads.isEmpty) {
          return Container(
            width: double.infinity,
            padding: const EdgeInsets.all(30),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: AppColors.border),
            ),
            child: const Column(
              children: [
                Icon(Icons.history_outlined, size: 40, color: AppColors.textSecondary),
                SizedBox(height: 12),
                Text('No Lead Registration Logs Found', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                SizedBox(height: 4),
                Text(
                  'When you submit leads or onboard societies, their full registration audit logs will appear here.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          );
        }

        return ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: partnerLeads.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final item = partnerLeads[index];
            final refId = item['referenceId'] ?? 'LEAD-${index + 1}';
            final targetSociety = item['targetSocietyName'] ?? 'Society Lead';
            final city = item['targetCity'] ?? 'City';
            final status = item['status'] ?? 'new';
            final payoutStatus = item['payoutStatus'] ?? 'pending';
            final utr = item['utrNumber'] ?? item['cashfreeUtr'] ?? '';
            final createdAtTimestamp = item['createdAt'] as Timestamp?;
            final logDate = createdAtTimestamp != null
                ? DateFormat('dd MMM yyyy, hh:mm a').format(createdAtTimestamp.toDate())
                : 'Registration logged';

            return Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(refId, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primary)),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: payoutStatus == 'paid' ? AppColors.successLight : AppColors.accentLight,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          payoutStatus == 'paid' ? '✓ DISBURSED' : status.toUpperCase(),
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: payoutStatus == 'paid' ? AppColors.success : Colors.amber.shade900,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(targetSociety, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
                  Text('$city • Registered On: $logDate', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                  if (utr.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.successLight,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.receipt_rounded, size: 14, color: AppColors.success),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              'Bank UTR Audit: $utr',
                              style: const TextStyle(fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFF047857)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }
}
