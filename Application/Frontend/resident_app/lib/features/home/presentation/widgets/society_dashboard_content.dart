import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_spacing.dart';
import 'ads_banner_section.dart';
import 'dynamic_maintenance_banner.dart';
import 'emergency_contacts_widget.dart';
import 'pending_visitors_list.dart';
import 'quick_actions_grid.dart';
import 'recent_complaints_widget.dart';
import 'recent_notices_list.dart';
import 'society_info_card.dart';

class SocietyDashboardContent extends StatelessWidget {
  const SocietyDashboardContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Dynamic Maintenance Due Banner
        const DynamicMaintenanceBanner(),
        const SizedBox(height: AppSpacing.lg),

        // Pending Visitors Approvals
        _SectionTitle(
          title: 'Pending Visitor Approvals',
          action: _ViewAllButton(
            onPressed: () => context.push(AppRoutes.visitors),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        const PendingVisitorsList(),
        const SizedBox(height: AppSpacing.lg),

        // Quick Actions Section
        const _SectionTitle(title: 'Quick Actions'),
        const SizedBox(height: AppSpacing.sm),
        const QuickActionsGrid(),
        const SizedBox(height: AppSpacing.lg),

        // Advertisement Banner (Dynamic Firestore Only)
        const AdsBannerSection(),
        const SizedBox(height: AppSpacing.lg),

        // Recent Complaints Summary
        _SectionTitle(
          title: 'Recent Helpdesk Tickets',
          action: _ViewAllButton(
            onPressed: () => context.push(AppRoutes.complaints),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        const RecentComplaintsWidget(),
        const SizedBox(height: AppSpacing.lg),

        // Recent Notices Summary
        _SectionTitle(
          title: 'Notice Board & Updates',
          action: _ViewAllButton(
            onPressed: () => context.push(AppRoutes.notices),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        const RecentNoticesList(),
        const SizedBox(height: AppSpacing.lg),

        // Emergency Contacts
        const _SectionTitle(title: 'Security & SOS Contacts'),
        const SizedBox(height: AppSpacing.sm),
        const EmergencyContactsWidget(),
        const SizedBox(height: AppSpacing.lg),

        // Society Info Card
        const SocietyInfoCard(),
        const SizedBox(height: AppSpacing.xxl),
      ],
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
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
            fontSize: 16,
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
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: const [
          Text(
            'View all',
            style: TextStyle(
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
              color: Color(0xFF0EA5E9),
            ),
          ),
          SizedBox(width: 2),
          Icon(Icons.arrow_forward_ios_rounded, size: 11, color: Color(0xFF0EA5E9)),
        ],
      ),
    );
  }
}
