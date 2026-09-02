import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
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

  Future<void> _handleRefresh(WidgetRef ref) async {
    HapticFeedback.lightImpact();
    ref.invalidate(userProfileProvider);
    ref.invalidate(maintenanceBillsStreamProvider);
    ref.invalidate(pendingVisitorsForFlatStreamProvider);
    ref.invalidate(noticesStreamProvider);
    ref.invalidate(myComplaintsStreamProvider);
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentMode = ref.watch(appHomeModeProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: RefreshIndicator(
        onRefresh: () => _handleRefresh(ref),
        color: const Color(0xFF1E3A8A),
        backgroundColor: Colors.white,
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(
            parent: BouncingScrollPhysics(),
          ),
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
                      action: _ViewAllButton(
                        onPressed: () => context.push(AppRoutes.visitors),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    const PendingVisitorsList(),
                    const SizedBox(height: AppSpacing.lg),

                    // Recent Complaints Summary
                    _SectionTitle(
                      title: 'My Complaints',
                      action: _ViewAllButton(
                        onPressed: () => context.push(AppRoutes.complaints),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    const RecentComplaintsWidget(),
                    const SizedBox(height: AppSpacing.lg),

                    // Recent Notices
                    _SectionTitle(
                      title: 'Recent Notices',
                      action: _ViewAllButton(
                        onPressed: () => context.push(AppRoutes.notices),
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
        Container(
          width: 3.5,
          height: 14,
          margin: const EdgeInsets.only(right: 8),
          decoration: BoxDecoration(
            color: const Color(0xFF1E3A8A),
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 14.5,
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

class _ViewAllButton extends StatelessWidget {
  final VoidCallback onPressed;
  const _ViewAllButton({required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        HapticFeedback.selectionClick();
        onPressed();
      },
      borderRadius: BorderRadius.circular(6),
      child: const Padding(
        padding: EdgeInsets.symmetric(horizontal: 6, vertical: 4),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'View All',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: Color(0xFF0EA5E9),
              ),
            ),
            SizedBox(width: 2),
            Icon(Icons.arrow_forward_ios_rounded, size: 10, color: Color(0xFF0EA5E9)),
          ],
        ),
      ),
    );
  }
}
