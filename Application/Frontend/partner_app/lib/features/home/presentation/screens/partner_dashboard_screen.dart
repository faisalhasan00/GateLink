import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';
import '../../../auth/presentation/screens/partner_login_screen.dart';
import '../widgets/partner_metrics_header.dart';
import '../../../leads/presentation/widgets/partner_lead_stepper_card.dart';
import '../../../leads/presentation/widgets/submit_lead_modal.dart';
import '../../../wallet/presentation/screens/payout_audit_ledger_screen.dart';
import '../../../toolkit/presentation/screens/marketing_toolkit_screen.dart';
import '../../../profile/presentation/widgets/edit_partner_category_modal.dart';
import '../../../onboarding/presentation/widgets/onboard_society_modal.dart';

class PartnerDashboardScreen extends ConsumerStatefulWidget {
  const PartnerDashboardScreen({super.key});

  @override
  ConsumerState<PartnerDashboardScreen> createState() => _PartnerDashboardScreenState();
}

class _PartnerDashboardScreenState extends ConsumerState<PartnerDashboardScreen> {
  String _selectedFilter = 'all';

  @override
  Widget build(BuildContext context) {
    final partnerUser = ref.watch(partnerAuthProvider);
    final partnerPhone = partnerUser?.phone ?? '';
    final partnerName = partnerUser?.name ?? 'Partner User';
    final refCode = partnerPhone.length >= 6 ? 'PARTNER-${partnerPhone.substring(partnerPhone.length - 6)}' : 'PARTNER-001';

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.handshake_rounded, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('GateLink Partner', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 17)),
                Text(partnerName, style: const TextStyle(fontSize: 10, color: Colors.white70)),
              ],
            ),
          ],
        ),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => MarketingToolkitScreen(refCode: refCode, partnerName: partnerName)),
            ),
            icon: const Icon(Icons.qr_code_rounded),
            tooltip: 'Marketing Toolkit',
          ),
          IconButton(
            onPressed: () async {
              await ref.read(partnerAuthProvider.notifier).logout();
              if (context.mounted) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => const PartnerLoginScreen()),
                );
              }
            },
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Logout',
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection('partner_leads')
            .orderBy('createdAt', descending: true)
            .snapshots(),
        builder: (context, snapshot) {
          List<Map<String, dynamic>> leadsList = [];

          final cleanPhone = partnerPhone.replaceAll(RegExp(r'[^0-9]'), '');
          final partnerEmail = partnerUser?.email.trim().toLowerCase() ?? '';

          if (snapshot.hasData && snapshot.data != null) {
            for (final doc in snapshot.data!.docs) {
              final data = doc.data() as Map<String, dynamic>?;
              if (data != null) {
                final leadPhone = (data['partnerPhone'] ?? '').toString().replaceAll(RegExp(r'[^0-9]'), '');
                final leadEmail = (data['partnerEmail'] ?? '').toString().trim().toLowerCase();

                final matchesPhone = cleanPhone.isNotEmpty && leadPhone.contains(cleanPhone);
                final matchesEmail = partnerEmail.isNotEmpty && leadEmail == partnerEmail;
                final matchesName = partnerName.isNotEmpty && (data['partnerName'] ?? '').toString().trim().toLowerCase() == partnerName.trim().toLowerCase();

                if (matchesPhone || matchesEmail || matchesName) {
                  leadsList.add(data);
                }
              }
            }
          }

          double lifetimeEarnings = 0;
          double monthlyPassives = 0;
          int activeSocieties = 0;

          for (final lead in leadsList) {
            final status = lead['status'] ?? 'new';
            final payoutStatus = lead['payoutStatus'] ?? 'pending';

            if (payoutStatus == 'paid') {
              lifetimeEarnings += (lead['payoutTotal'] ?? 500).toDouble();
            }
            if (status == 'won') {
              activeSocieties++;
              final flats = double.tryParse(lead['approxFlats']?.toString() ?? '0') ?? 0;
              monthlyPassives += (flats * 2); // ₹2 per flat monthly commission
            }
          }

          // Filter leads
          final filteredLeads = leadsList.where((lead) {
            final st = lead['status'] ?? 'new';
            final paySt = lead['payoutStatus'] ?? 'pending';

            if (_selectedFilter == 'paid') return paySt == 'paid';
            if (_selectedFilter == 'active') return st == 'won';
            if (_selectedFilter == 'pending') return st == 'new' || st == 'contacted' || st == 'demo_scheduled' || st == 'negotiation';
            return true;
          }).toList();

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Executive Dynamic Metrics Header Card
                PartnerMetricsHeader(
                  lifetimeEarnings: lifetimeEarnings,
                  monthlyPassives: monthlyPassives,
                  activeSocieties: activeSocieties,
                  upiId: partnerUser?.upiId ?? 'Update UPI ID',
                ),
                const SizedBox(height: 20),

                // 2. Quick Actions Section
                Row(
                  children: [
                    Expanded(
                      flex: 6,
                      child: ElevatedButton.icon(
                        onPressed: () => OnboardSocietyModal.show(
                          context,
                          partnerName: partnerName,
                          partnerPhone: partnerPhone,
                          partnerEmail: partnerUser?.email,
                          partnerUpi: partnerUser?.upiId,
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
                          partnerEmail: partnerUser?.email,
                          partnerUpi: partnerUser?.upiId,
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
                        icon: const Icon(Icons.manage_accounts_rounded, size: 16, color: AppColors.primary),
                        label: const Text('Category Settings', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => PayoutAuditLedgerScreen(
                              partnerPhone: partnerPhone,
                              partnerEmail: partnerUser?.email,
                            ),
                          ),
                        ),
                        icon: const Icon(Icons.receipt_long_rounded, size: 16, color: AppColors.primary),
                        label: const Text('Cashfree Ledger', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // 3. Dynamic Lead CRM Stepper Section & Filter Tabs
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Live Lead CRM & Stepper',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(AppRadius.pill),
                      ),
                      child: Text(
                        '${filteredLeads.length} Leads',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primary),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Filter Pills Row
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _FilterPill(
                        label: 'All Leads (${leadsList.length})',
                        isSelected: _selectedFilter == 'all',
                        onTap: () => setState(() => _selectedFilter = 'all'),
                      ),
                      const SizedBox(width: 8),
                      _FilterPill(
                        label: '⏳ In Pipeline',
                        isSelected: _selectedFilter == 'pending',
                        onTap: () => setState(() => _selectedFilter = 'pending'),
                      ),
                      const SizedBox(width: 8),
                      _FilterPill(
                        label: '✓ ₹500 Paid',
                        isSelected: _selectedFilter == 'paid',
                        onTap: () => setState(() => _selectedFilter = 'paid'),
                      ),
                      const SizedBox(width: 8),
                      _FilterPill(
                        label: '⚡ Active (2% Mo)',
                        isSelected: _selectedFilter == 'active',
                        onTap: () => setState(() => _selectedFilter = 'active'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Live Dynamic Lead List or Production Empty State
                if (filteredLeads.isEmpty)
                  Container(
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
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filteredLeads.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      return PartnerLeadStepperCard(lead: filteredLeads[index]);
                    },
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _FilterPill extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterPill({required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.pill),
          border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
