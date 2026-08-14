import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class QuickActionsGrid extends StatelessWidget {
  const QuickActionsGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final actions = [
      _QuickAction(
          icon: Icons.person_add_rounded,
          label: 'Invite\nVisitor',
          color: AppColors.visitor,
          route: AppRoutes.inviteVisitor),
      _QuickAction(
          icon: Icons.support_agent_rounded,
          label: 'Raise\nComplaint',
          color: AppColors.complaint,
          route: AppRoutes.raiseComplaint),
      _QuickAction(
          icon: Icons.sports_tennis_rounded,
          label: 'Book\nAmenity',
          color: AppColors.amenity,
          route: AppRoutes.amenities),
      _QuickAction(
          icon: Icons.local_parking_rounded,
          label: 'My\nParking',
          color: AppColors.parking,
          route: AppRoutes.parking),
      _QuickAction(
          icon: Icons.campaign_rounded,
          label: 'Notices',
          color: AppColors.notice,
          route: AppRoutes.notices),
      _QuickAction(
          icon: Icons.folder_rounded,
          label: 'Documents',
          color: AppColors.textSecondary,
          route: AppRoutes.documents),
    ];

    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: AppSpacing.md,
      crossAxisSpacing: AppSpacing.md,
      childAspectRatio: 1.1,
      children: actions.map((a) => _QuickActionCard(action: a)).toList(),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final _QuickAction action;
  const _QuickActionCard({required this.action});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go(action.route),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: action.color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(action.icon, color: action.color, size: 22),
            ),
            const SizedBox(height: 8),
            Text(
              action.label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                  height: 1.3),
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickAction {
  final IconData icon;
  final String label;
  final Color color;
  final String route;
  const _QuickAction(
      {required this.icon,
      required this.label,
      required this.color,
      required this.route});
}
