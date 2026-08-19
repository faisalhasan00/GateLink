import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../widgets/partner_metrics_header.dart';
import '../../../leads/presentation/widgets/partner_lead_stepper_card.dart';
import '../../../leads/presentation/widgets/submit_lead_modal.dart';
import '../../../wallet/presentation/screens/payout_audit_ledger_screen.dart';
import '../../../toolkit/presentation/screens/marketing_toolkit_screen.dart';

class PartnerDashboardScreen extends StatefulWidget {
  const PartnerDashboardScreen({super.key});

  @override
  State<PartnerDashboardScreen> createState() => _PartnerDashboardScreenState();
}

class _PartnerDashboardScreenState extends State<PartnerDashboardScreen> {
  String _selectedFilter = 'all';

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    final partnerPhone = user?.phoneNumber ?? '9845011223';
    final partnerName = user?.displayName ?? 'Raj Sharma (Channel Partner)';
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
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('GateLink Partner', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                Text('Channel Partner Portal', style: TextStyle(fontSize: 10, color: Colors.white70)),
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
        ],
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection('partner_leads')
            .where('partnerPhone', isEqualTo: partnerPhone.trim())
            .snapshots(),
        builder: (context, snapshot) {
          final docs = snapshot.data?.docs ?? [];
          
          double lifetimeEarnings = 0;
          double monthlyPassives = 0;
          int activeSocieties = 0;

          for (final doc in docs) {
            final data = doc.data() as Map<String, dynamic>;
            final status = data['status'] ?? 'new';
            final payoutStatus = data['payoutStatus'] ?? 'pending';

            if (payoutStatus == 'paid') {
              lifetimeEarnings += (data['payoutTotal'] ?? 500).toDouble();
            }
            if (status == 'won') {
              activeSocieties++;
              monthlyPassives += 400; // 2% of ₹20,000 SaaS fee
            }
          }

          // Filter leads
          final filteredDocs = docs.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            final st = data['status'] ?? 'new';
            final paySt = data['payoutStatus'] ?? 'pending';

            if (_selectedFilter == 'paid') return paySt == 'paid';
            if (_selectedFilter == 'active') return st == 'won';
            if (_selectedFilter == 'pending') return st == 'new' || st == 'contacted' || st == 'demo_scheduled';
            return true;
          }).toList();

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Metrics Header Card
                PartnerMetricsHeader(
                  lifetimeEarnings: lifetimeEarnings,
                  monthlyPassives: monthlyPassives,
                  activeSocieties: activeSocieties,
                  upiId: 'raj@okicici',
                ),
                const SizedBox(height: 20),

                // 2. Quick Actions Navigation Row
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => PayoutAuditLedgerScreen(partnerPhone: partnerPhone)),
                        ),
                        icon: const Icon(Icons.receipt_long_rounded, size: 16, color: AppColors.primary),
                        label: const Text('Cashfree Ledger', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => SubmitLeadModal.show(context, partnerName: partnerName, partnerPhone: partnerPhone),
                        icon: const Icon(Icons.add_business_rounded, size: 16),
                        label: const Text('Submit Lead', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // 3. Lead CRM Stepper Section & Filter Tabs
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Lead CRM & Status Stepper',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                    ),
                    Text(
                      '${filteredDocs.length} Leads',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
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
                        label: 'All Leads',
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

                // Lead List
                if (filteredDocs.isEmpty)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      children: [
                        Icon(Icons.handshake_outlined, size: 48, color: Colors.grey.shade400),
                        const SizedBox(height: 12),
                        const Text(
                          'No Leads in this Filter',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tap "Submit Lead" to onboard a housing society and start tracking your commissions.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filteredDocs.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final data = filteredDocs[index].data() as Map<String, dynamic>;
                      return PartnerLeadStepperCard(lead: data);
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
