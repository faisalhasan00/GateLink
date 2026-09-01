import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../widgets/ads_banner_section.dart';
import '../widgets/dashboard_app_bar.dart';
import '../widgets/dynamic_maintenance_banner.dart';
import '../widgets/emergency_contacts_widget.dart';
import '../widgets/pending_visitors_list.dart';
import '../widgets/quick_actions_grid.dart';
import '../widgets/recent_complaints_widget.dart';
import '../widgets/recent_notices_list.dart';
import '../widgets/society_info_card.dart';
import '../widgets/mode_switcher_toggle.dart';
import '../widgets/community_hub_coming_soon_view.dart';

final appHomeModeProvider =
    StateProvider<AppHomeMode>((ref) => AppHomeMode.societyGate);

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentMode = ref.watch(appHomeModeProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          const DashboardAppBar(),
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Dual Mode Switcher (Society Gate vs Community Hub)
                ModeSwitcherToggle(
                  currentMode: currentMode,
                  onModeChanged: (mode) =>
                      ref.read(appHomeModeProvider.notifier).state = mode,
                ),
                const SizedBox(height: AppSpacing.md),

                // Mode 2: Community Hub (Classifieds, Maids, Services Showcase)
                if (currentMode == AppHomeMode.communityHub) ...[
                  CommunityHubComingSoonView(
                    onSwitchToGate: () => ref
                        .read(appHomeModeProvider.notifier)
                        .state = AppHomeMode.societyGate,
                  ),
                ] else ...[
                  // Mode 1: Core Society Gate & Community
                  // Maintenance Alert Banner / All Dues Paid
                  const DynamicMaintenanceBanner(),
                  const SizedBox(height: AppSpacing.lg),

                  // Quick Actions Grid
                  const _SectionTitle(title: 'Quick Actions'),
                  const SizedBox(height: AppSpacing.sm),
                  const QuickActionsGrid(),
                  const SizedBox(height: AppSpacing.lg),

                  // Advertisement Banner (Dynamic Firestore Only)
                  const AdsBannerSection(),
                  const SizedBox(height: AppSpacing.lg),

                  // Pending Visitors
                  _SectionTitle(
                    title: 'Pending Visitor Approvals',
                    action: TextButton(
                      onPressed: () => context.push(AppRoutes.visitors),
                      child: const Text('View All'),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  const PendingVisitorsList(),
                  const SizedBox(height: AppSpacing.lg),

                  // Recent Complaints Summary
                  _SectionTitle(
                    title: 'My Complaints',
                    action: TextButton(
                      onPressed: () => context.push(AppRoutes.complaints),
                      child: const Text('View All'),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  const RecentComplaintsWidget(),
                  const SizedBox(height: AppSpacing.lg),

                  // Recent Notices
                  _SectionTitle(
                    title: 'Recent Notices',
                    action: TextButton(
                      onPressed: () => context.push(AppRoutes.notices),
                      child: const Text('View All'),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  const RecentNoticesList(),
                  const SizedBox(height: AppSpacing.lg),

                  // Emergency Contacts
                  const _SectionTitle(title: 'Emergency Contacts'),
                  const SizedBox(height: AppSpacing.sm),
                  const EmergencyContactsWidget(),
                  const SizedBox(height: AppSpacing.lg),

                  // Society Info Card
                  const SocietyInfoCard(),
                  const SizedBox(height: AppSpacing.xl),
                ],
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final Widget? action;
  const _SectionTitle({required this.title, this.action});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
              letterSpacing: -0.2,
            ),
          ),
        ),
        if (action != null) action!,
      ],
    );
  }
}
