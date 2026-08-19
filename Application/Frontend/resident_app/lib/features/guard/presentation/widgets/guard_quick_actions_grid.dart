import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class GuardQuickActionsGrid extends StatelessWidget {
  final VoidCallback onScanQrTap;
  final VoidCallback onQuickEntryTap;
  final VoidCallback onVehicleLogTap;
  final VoidCallback onInviteCodeTap;
  final VoidCallback onShowGateQrTap;

  const GuardQuickActionsGrid({
    super.key,
    required this.onScanQrTap,
    required this.onQuickEntryTap,
    required this.onVehicleLogTap,
    required this.onInviteCodeTap,
    required this.onShowGateQrTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 1-Tap Show Gate Standee QR Banner
        InkWell(
          onTap: onShowGateQrTap,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E3A8A), Color(0xFF0EA5E9)],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
              borderRadius: BorderRadius.circular(AppRadius.lg),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF0EA5E9).withValues(alpha: 0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.qr_code_2_rounded, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '📱 Display Gate QR Stand',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Show phone screen for visitor self check-in',
                        style: TextStyle(
                          fontSize: 11,
                          color: Color(0xFFE0F2FE),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right_rounded, color: Colors.white),
              ],
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.md),

        const Text(
          'GATE ENTRY ACTIONS',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: AppColors.textSecondary,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: AppSpacing.sm,
          crossAxisSpacing: AppSpacing.sm,
          childAspectRatio: 1.6,
          children: [
            _ActionTile(
              icon: Icons.qr_code_scanner_rounded,
              title: 'Scan QR Pass',
              subtitle: 'Verify visitor & cab pass',
              color: const Color(0xFF1E3A8A),
              onTap: onScanQrTap,
            ),
            _ActionTile(
              icon: Icons.person_add_alt_1_rounded,
              title: 'New Visitor Entry',
              subtitle: 'Delivery, Cab, Guest & Maid',
              color: const Color(0xFF0EA5E9),
              onTap: onQuickEntryTap,
            ),
            _ActionTile(
              icon: Icons.directions_car_filled_rounded,
              title: 'Vehicle Gate Log',
              subtitle: 'Track resident & guest cars',
              color: const Color(0xFF059669),
              onTap: onVehicleLogTap,
            ),
            _ActionTile(
              icon: Icons.pin_outlined,
              title: 'Passcode Verification',
              subtitle: 'Validate 6-digit passcode',
              color: const Color(0xFFD97706),
              onTap: onInviteCodeTap,
            ),
          ],
        ),
      ],
    );
  }
}

class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.border),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(icon, color: color, size: 18),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 10,
                color: AppColors.textSecondary,
                fontWeight: FontWeight.w500,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
