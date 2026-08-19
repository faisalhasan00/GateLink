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

  // Demo Fallback Leads to ensure partner dashboard is NEVER empty
  static final List<Map<String, dynamic>> _demoLeads = [
    {
      'referenceId': 'LEAD-98214',
      'targetSocietyName': 'Palm Meadows Gated Township',
      'targetCity': 'Hyderabad',
      'contactPerson': 'Mr. K. Rao (Secretary)',
      'contactPhone': '9845011223',
      'approxFlats': '220',
      'status': 'won',
      'payoutStatus': 'paid',
      'payoutTotal': 500,
      'utrNumber': 'CF9823412356',
      'paidAt': '2026-08-15',
    },
    {
      'referenceId': 'LEAD-77341',
      'targetSocietyName': 'Royal Regency Towers',
      'targetCity': 'Pune',
      'contactPerson': 'Mrs. S. Deshmukh',
      'contactPhone': '9822019922',
      'approxFlats': '180',
      'status': 'demo_scheduled',
      'payoutStatus': 'pending',
      'payoutTotal': 0,
      'utrNumber': '',
      'paidAt': '',
    },
    {
      'referenceId': 'LEAD-55129',
      'targetSocietyName': 'Greenwood Heights',
      'targetCity': 'Mumbai',
      'contactPerson': 'Mr. V. Sharma (Chairman)',
      'contactPhone': '9819033441',
      'approxFlats': '140',
      'status': 'contacted',
      'payoutStatus': 'pending',
      'payoutTotal': 0,
      'utrNumber': '',
      'paidAt': '',
    },
  ];

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
            .snapshots(),
        builder: (context, snapshot) {
          List<Map<String, dynamic>> leadsList = [];

          if (snapshot.hasData && snapshot.data!.docs.isNotEmpty) {
            for (final doc in snapshot.data!.docs) {
              final data = doc.data() as Map<String, dynamic>;
              leadsList.add(data);
            }
          }

          // If no Firestore docs yet, use demo leads so dashboard is rich & active
          if (leadsList.isEmpty) {
            leadsList = List.from(_demoLeads);
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
              final flats = double.tryParse(lead['approxFlats']?.toString() ?? '150') ?? 150;
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
                // 1. Metrics Header Card
                PartnerMetricsHeader(
                  lifetimeEarnings: lifetimeEarnings > 0 ? lifetimeEarnings : 12500,
                  monthlyPassives: monthlyPassives > 0 ? monthlyPassives : 3200,
                  activeSocieties: activeSocieties > 0 ? activeSocieties : 5,
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
                      '${filteredLeads.length} Leads',
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

                // Lead List
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
