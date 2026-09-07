import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/models/patrol_checkpoint_model.dart';
import '../../domain/models/patrol_log_model.dart';
import 'patrol_incident_modal.dart';

class PatrolCheckpointCard extends StatelessWidget {
  final PatrolCheckpointModel cp;
  final bool isScanned;
  final PatrolLogModel? log;
  final int sequenceNo;

  const PatrolCheckpointCard({
    super.key,
    required this.cp,
    required this.isScanned,
    required this.log,
    required this.sequenceNo,
  });

  @override
  Widget build(BuildContext context) {
    final scannedTimeStr = log != null ? DateFormat('hh:mm a').format(log!.scannedAt) : null;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isScanned ? const Color(0xFF22C55E).withValues(alpha: 0.4) : AppColors.border,
          width: isScanned ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            offset: const Offset(0, 2),
            blurRadius: 8,
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Sequence / Status Icon
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: isScanned ? const Color(0xFFDCFCE7) : AppColors.surface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: isScanned
                    ? const Icon(Icons.check_circle_rounded, color: Color(0xFF16A34A), size: 24)
                    : Text(
                        '$sequenceNo',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textSecondary,
                        ),
                      ),
              ),
            ),
            const SizedBox(width: 12),

            // Checkpoint Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          cp.code,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          cp.name,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 13, color: AppColors.gray400),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(
                          cp.area,
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  if (isScanned && scannedTimeStr != null) ...[
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(Icons.access_time_filled_rounded, size: 12, color: Color(0xFF16A34A)),
                        const SizedBox(width: 4),
                        Text(
                          'Scanned at $scannedTimeStr by ${log?.guardName ?? "Guard"}',
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF16A34A),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 8),

            // Scan / Flag Button
            if (!isScanned)
              IconButton(
                onPressed: () => context.push(AppRoutes.guardScan),
                icon: const Icon(Icons.qr_code_scanner_rounded, color: AppColors.primary),
                tooltip: 'Scan this checkpoint',
              )
            else
              IconButton(
                onPressed: () => PatrolIncidentModal.show(context, checkpoint: cp),
                icon: const Icon(Icons.add_alert_rounded, color: AppColors.warning, size: 20),
                tooltip: 'Report Issue at Checkpoint',
              ),
          ],
        ),
      ),
    );
  }
}
