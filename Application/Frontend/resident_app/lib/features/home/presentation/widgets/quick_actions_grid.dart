import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
        label: 'Invite Visitor',
        color: AppColors.visitor,
        route: AppRoutes.inviteVisitor,
      ),
      _QuickAction(
        icon: Icons.badge_rounded,
        label: 'Daily Help',
        color: const Color(0xFF0EA5E9),
        route: AppRoutes.helpers,
      ),
      _QuickAction(
        icon: Icons.support_agent_rounded,
        label: 'Raise Ticket',
        color: AppColors.complaint,
        route: AppRoutes.raiseComplaint,
      ),
      _QuickAction(
        icon: Icons.sports_tennis_rounded,
        label: 'Book Amenity',
        color: AppColors.amenity,
        route: AppRoutes.amenities,
      ),
      _QuickAction(
        icon: Icons.local_parking_rounded,
        label: 'My Parking',
        color: AppColors.parking,
        route: AppRoutes.parking,
      ),
      _QuickAction(
        icon: Icons.campaign_rounded,
        label: 'Notices',
        color: AppColors.notice,
        route: AppRoutes.notices,
      ),
      _QuickAction(
        icon: Icons.folder_rounded,
        label: 'Documents',
        color: const Color(0xFF475569),
        route: AppRoutes.documents,
      ),
      _QuickAction(
        icon: Icons.card_giftcard_rounded,
        label: 'Refer & Earn',
        color: const Color(0xFFF59E0B),
        route: AppRoutes.referral,
      ),
    ];

    return GridView.count(
      crossAxisCount: 4,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: AppSpacing.sm,
      crossAxisSpacing: AppSpacing.sm,
      childAspectRatio: 0.88,
      children: actions.map((a) => _QuickActionCard(action: a)).toList(),
    );
  }
}

class _QuickActionCard extends StatefulWidget {
  final _QuickAction action;
  const _QuickActionCard({required this.action});

  @override
  State<_QuickActionCard> createState() => _QuickActionCardState();
}

class _QuickActionCardState extends State<_QuickActionCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        setState(() => _isPressed = true);
        HapticFeedback.selectionClick();
      },
      onTapUp: (_) {
        setState(() => _isPressed = false);
      },
      onTapCancel: () {
        setState(() => _isPressed = false);
      },
      onTap: () {
        HapticFeedback.lightImpact();
        context.push(widget.action.route);
      },
      child: AnimatedScale(
        scale: _isPressed ? 0.92 : 1.0,
        duration: const Duration(milliseconds: 120),
        curve: Curves.easeOutCubic,
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.card),
            border: Border.all(
              color: _isPressed
                  ? widget.action.color.withValues(alpha: 0.4)
                  : const Color(0xFFF1F5F9),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: widget.action.color.withValues(alpha: _isPressed ? 0.08 : 0.03),
                blurRadius: _isPressed ? 10 : 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      widget.action.color.withValues(alpha: 0.15),
                      widget.action.color.withValues(alpha: 0.06),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: widget.action.color.withValues(alpha: 0.18),
                    width: 1,
                  ),
                ),
                child: Icon(widget.action.icon, color: widget.action.color, size: 20),
              ),
              const SizedBox(height: 6),
              Text(
                widget.action.label,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E293B),
                  letterSpacing: -0.2,
                ),
              ),
            ],
          ),
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
  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.route,
  });
}
