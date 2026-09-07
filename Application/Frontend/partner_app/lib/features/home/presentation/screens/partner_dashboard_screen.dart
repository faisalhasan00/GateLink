import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';
import '../../../auth/presentation/screens/partner_login_screen.dart';
import '../widgets/partner_metrics_header.dart';
import '../widgets/partner_dashboard_quick_actions.dart';
import '../widgets/partner_dashboard_filter_bar.dart';
import '../widgets/partner_dashboard_empty_state.dart';
import '../../../leads/presentation/widgets/partner_lead_stepper_card.dart';
import '../../../toolkit/presentation/screens/marketing_toolkit_screen.dart';
import '../../../../core/widgets/partner_logo.dart';
import '../../../auth/presentation/screens/registration_audit_log_screen.dart';

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
        title: const PartnerLogo(
          size: PartnerLogoSize.small,
          showTagline: false,
          isDark: true,
        ),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const RegistrationAuditLogScreen()),
            ),
            icon: const Icon(Icons.verified_user_rounded),
            tooltip: 'Registration & Audit Log',
          ),
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
              monthlyPassives += (flats * 2);
            }
          }

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
                PartnerMetricsHeader(
                  lifetimeEarnings: lifetimeEarnings,
                  monthlyPassives: monthlyPassives,
                  activeSocieties: activeSocieties,
                  upiId: partnerUser?.upiId ?? 'Update UPI ID',
                ),
                const SizedBox(height: 20),

                PartnerDashboardQuickActions(
                  partnerName: partnerName,
                  partnerPhone: partnerPhone,
                  partnerEmail: partnerUser?.email,
                  partnerUpi: partnerUser?.upiId,
                ),
                const SizedBox(height: 24),

                PartnerDashboardFilterBar(
                  totalCount: leadsList.length,
                  filteredCount: filteredLeads.length,
                  selectedFilter: _selectedFilter,
                  onFilterChanged: (f) => setState(() => _selectedFilter = f),
                ),
                const SizedBox(height: 16),

                if (filteredLeads.isEmpty)
                  PartnerDashboardEmptyState(partnerName: partnerName, partnerPhone: partnerPhone)
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
