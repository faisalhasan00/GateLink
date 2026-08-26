import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';
import '../../../../core/widgets/partner_logo.dart';

class RegistrationAuditLogScreen extends ConsumerStatefulWidget {
  const RegistrationAuditLogScreen({super.key});

  @override
  ConsumerState<RegistrationAuditLogScreen> createState() => _RegistrationAuditLogScreenState();
}

class _RegistrationAuditLogScreenState extends ConsumerState<RegistrationAuditLogScreen> {
  String _activeTab = 'account';

  @override
  Widget build(BuildContext context) {
    final partnerUser = ref.watch(partnerAuthProvider);
    final partnerPhone = partnerUser?.phone ?? '';
    final cleanPhone = partnerPhone.replaceAll(RegExp(r'[^0-9]'), '');
    final partnerEmail = partnerUser?.email.trim().toLowerCase() ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const PartnerLogo(
          size: PartnerLogoSize.small,
          showTagline: false,
          isDark: true,
        ),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E3A8A), Color(0xFF0EA5E9)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppRadius.lg),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(AppRadius.pill),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.verified_user_rounded, color: Colors.white, size: 12),
                        SizedBox(width: 4),
                        Text(
                          'PARTNER SYSTEM AUDIT LOG',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 0.5),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Registration & Verification Logs',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Immutable audit trail of partner account registration, lead submissions, and payout logs for ${partnerUser?.name ?? "Partner"}.',
                    style: const TextStyle(fontSize: 12, color: Colors.white70, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Tab Controls
            Row(
              children: [
                Expanded(
                  child: _TabButton(
                    label: 'Account Registration Log',
                    icon: Icons.badge_outlined,
                    isSelected: _activeTab == 'account',
                    onTap: () => setState(() => _activeTab = 'account'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _TabButton(
                    label: 'Lead Registration Logs',
                    icon: Icons.list_alt_rounded,
                    isSelected: _activeTab == 'leads',
                    onTap: () => setState(() => _activeTab = 'leads'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            if (_activeTab == 'account')
              _buildAccountRegistrationLogSection(partnerUser)
            else
              _buildLeadRegistrationLogsSection(cleanPhone, partnerEmail),
          ],
        ),
      ),
    );
  }

  Widget _buildAccountRegistrationLogSection(PartnerUser? partnerUser) {
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

    final regLogRef = 'REG-LOG-${partnerUser.phone.isNotEmpty ? partnerUser.phone : "0000000000"}';

    return FutureBuilder<DocumentSnapshot>(
      future: FirebaseFirestore.instance.collection('partners').doc(partnerUser.phone).get(),
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
                  _AuditRow(label: 'Registered Name', value: partnerUser.name, icon: Icons.person_outline_rounded),
                  _AuditRow(label: 'Registered Mobile', value: '+91 ${partnerUser.phone}', icon: Icons.phone_android_rounded),
                  _AuditRow(label: 'Email Address', value: partnerUser.email.isNotEmpty ? partnerUser.email : 'Not specified', icon: Icons.email_outlined),
                  _AuditRow(label: 'Partner Classification', value: partnerUser.category, icon: Icons.work_outline_rounded),
                  _AuditRow(label: 'Payout UPI ID', value: partnerUser.upiId.isNotEmpty ? partnerUser.upiId : 'Pending Update', icon: Icons.account_balance_wallet_outlined),
                  _AuditRow(label: 'Operating City / Region', value: partnerUser.city.isNotEmpty ? partnerUser.city : 'Pan India', icon: Icons.location_city_outlined),
                  _AuditRow(label: 'Registration Timestamp', value: formattedDate, icon: Icons.access_time_rounded),
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

  Widget _buildLeadRegistrationLogsSection(String cleanPhone, String partnerEmail) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection('partner_leads')
          .orderBy('createdAt', descending: true)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: Padding(padding: EdgeInsets.all(30), child: CircularProgressIndicator()));
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
                Text('When you submit leads or onboard societies, their full registration audit logs will appear here.', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
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

class _TabButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _TabButton({required this.label, required this.icon, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
          boxShadow: isSelected
              ? [BoxShadow(color: AppColors.primary.withValues(alpha: 0.2), blurRadius: 6, offset: const Offset(0, 2))]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 16, color: isSelected ? Colors.white : AppColors.textSecondary),
            const SizedBox(width: 6),
            Flexible(
              child: Text(
                label,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? Colors.white : AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AuditRow extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _AuditRow({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Icon(icon, size: 16, color: AppColors.primary),
          const SizedBox(width: 10),
          SizedBox(
            width: 140,
            child: Text(
              label,
              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
          ),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}
