import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../visitor/domain/models/visitor_model.dart';

class GateEntryCard extends StatelessWidget {
  final VisitorModel visitor;
  final VoidCallback onMarkOut;
  final VoidCallback onApprove;

  const GateEntryCard({
    super.key,
    required this.visitor,
    required this.onMarkOut,
    required this.onApprove,
  });

  Color get _typeColor {
    switch (visitor.type) {
      case 'Delivery':
        return const Color(0xFFEA580C);
      case 'Cab':
        return const Color(0xFFCA8A04);
      case 'Daily Help':
        return const Color(0xFF059669);
      default:
        return const Color(0xFF2563EB);
    }
  }

  IconData get _typeIcon {
    switch (visitor.type) {
      case 'Delivery':
        return Icons.local_shipping_rounded;
      case 'Cab':
        return Icons.local_taxi_rounded;
      case 'Daily Help':
        return Icons.cleaning_services_rounded;
      default:
        return Icons.person_rounded;
    }
  }

  String get _status => visitor.status;

  @override
  Widget build(BuildContext context) {
    final timeStr = visitor.entryTime != null ? DateFormat('hh:mm a').format(visitor.entryTime!) : '--';

    return GestureDetector(
      onTap: () => context.go('/home/visitors/${visitor.id}'),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.xl),
          border: Border.all(
            color: _status == 'pending' ? AppColors.warning : AppColors.border,
            width: _status == 'pending' ? 1.5 : 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: _typeColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                  child: Icon(_typeIcon, color: _typeColor, size: 22),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              visitor.name,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          StatusBadge(status: _status),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Flat ${visitor.hostFlat} • ${visitor.type}',
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.access_time_rounded, size: 11, color: AppColors.textSecondary),
                          const SizedBox(width: 3),
                          Text(
                            'Entry: $timeStr',
                            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                          ),
                          if (visitor.vehicleNumber != null && visitor.vehicleNumber!.isNotEmpty) ...[
                            const SizedBox(width: 8),
                            const Icon(Icons.directions_car_rounded, size: 11, color: AppColors.primary),
                            const SizedBox(width: 2),
                            Text(
                              visitor.vehicleNumber!,
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primary),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (_status == 'inside') ...[
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton.icon(
                    onPressed: onMarkOut,
                    icon: const Icon(Icons.logout_rounded, size: 14),
                    label: const Text('Mark Exit'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: const BorderSide(color: AppColors.error),
                      minimumSize: const Size(100, 32),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ] else if (_status == 'pending') ...[
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1),
              const SizedBox(height: 8),
              const Row(
                children: [
                  Icon(Icons.hourglass_top_rounded, size: 14, color: AppColors.warning),
                  SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      'Waiting for resident approval...',
                      style: TextStyle(fontSize: 11, color: AppColors.warning, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ] else if (_status == 'approved') ...[
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.check_circle_rounded, size: 14, color: AppColors.success),
                  const SizedBox(width: 4),
                  const Expanded(
                    child: Text(
                      'Approved by Resident',
                      style: TextStyle(fontSize: 11, color: AppColors.success, fontWeight: FontWeight.w500),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: onApprove,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(90, 32),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                    child: const Text('Check In'),
                  ),
                ],
              ),
            ] else if (_status == 'denied') ...[
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1),
              const SizedBox(height: 8),
              const Row(
                children: [
                  Icon(Icons.cancel_rounded, size: 14, color: AppColors.error),
                  SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      'Entry Denied by Resident',
                      style: TextStyle(fontSize: 11, color: AppColors.error, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class StatusBadge extends StatelessWidget {
  final String status;
  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;

    switch (status) {
      case 'inside':
        bg = AppColors.successSurface;
        fg = AppColors.success;
        label = 'INSIDE';
        break;
      case 'left':
        bg = AppColors.gray100;
        fg = AppColors.gray600;
        label = 'EXITED';
        break;
      case 'approved':
        bg = AppColors.successSurface;
        fg = AppColors.success;
        label = 'APPROVED';
        break;
      case 'denied':
        bg = AppColors.errorSurface;
        fg = AppColors.error;
        label = 'DENIED';
        break;
      case 'pending':
        bg = AppColors.warningSurface;
        fg = AppColors.warning;
        label = 'WAITING';
        break;
      default:
        bg = AppColors.gray100;
        fg = AppColors.gray600;
        label = status.toUpperCase();
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        label,
        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: fg, letterSpacing: 0.5),
      ),
    );
  }
}
