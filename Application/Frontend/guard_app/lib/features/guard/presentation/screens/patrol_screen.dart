import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../domain/models/patrol_checkpoint_model.dart';
import '../../domain/models/patrol_log_model.dart';
import '../../providers/patrol_providers.dart';
import '../widgets/patrol_incident_modal.dart';

class PatrolScreen extends ConsumerStatefulWidget {
  const PatrolScreen({super.key});

  @override
  ConsumerState<PatrolScreen> createState() => _PatrolScreenState();
}

class _PatrolScreenState extends ConsumerState<PatrolScreen> {
  late Timer _clockTimer;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _now = DateTime.now());
    });
  }

  @override
  void dispose() {
    _clockTimer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final checkpointsAsync = ref.watch(patrolCheckpointsProvider);
    final todayLogsAsync = ref.watch(todayPatrolLogsProvider);
    final timeStr = DateFormat('hh:mm:ss a').format(_now);
    final dateStr = DateFormat('EEEE, d MMM yyyy').format(_now);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Night Patrol & QR Checkpoints',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.warning_amber_rounded, color: AppColors.secondary),
            tooltip: 'Report Incident',
            onPressed: () => PatrolIncidentModal.show(context),
          ),
        ],
      ),
      body: checkpointsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline_rounded, color: AppColors.error, size: 48),
                const SizedBox(height: 12),
                Text('Error loading checkpoints: $err', textAlign: TextAlign.center),
              ],
            ),
          ),
        ),
        data: (checkpoints) {
          final todayLogs = todayLogsAsync.value ?? [];

          // Map scanned checkpoints from today's logs
          final Map<String, PatrolLogModel> scannedMap = {};
          for (final log in todayLogs) {
            if (!scannedMap.containsKey(log.checkpointId)) {
              scannedMap[log.checkpointId] = log;
            }
          }

          final scannedCount = checkpoints.where((cp) => scannedMap.containsKey(cp.id)).length;
          final totalCount = checkpoints.length;
          final progress = totalCount > 0 ? scannedCount / totalCount : 0.0;

          return Column(
            children: [
              // Top Patrol Shift Status Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFF22C55E),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  const Text(
                                    'ACTIVE PATROL SHIFT',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 11,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        Text(
                          timeStr,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            fontFamily: 'monospace',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      dateStr,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Progress Bar
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Checkpoint Progress: $scannedCount of $totalCount Scanned',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          '${(progress * 100).toInt()}%',
                          style: const TextStyle(
                            color: AppColors.secondary,
                            fontSize: 15,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: LinearProgressIndicator(
                        value: progress,
                        minHeight: 8,
                        backgroundColor: Colors.white.withOpacity(0.2),
                        valueColor: const AlwaysStoppedAnimation<Color>(AppColors.secondary),
                      ),
                    ),
                  ],
                ),
              ),

              // Checkpoint Timeline List
              Expanded(
                child: checkpoints.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.qr_code_2_rounded, size: 54, color: AppColors.gray400),
                            const SizedBox(height: 12),
                            const Text(
                              'No Patrol Checkpoints Configured',
                              style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.textSecondary),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Society admin can configure checkpoints from the admin web portal.',
                              style: TextStyle(fontSize: 12, color: AppColors.gray400),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        itemCount: checkpoints.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final cp = checkpoints[index];
                          final isScanned = scannedMap.containsKey(cp.id);
                          final log = scannedMap[cp.id];

                          return _buildCheckpointCard(cp, isScanned, log, index + 1);
                        },
                      ),
              ),
            ],
          );
        },
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              offset: const Offset(0, -4),
              blurRadius: 16,
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => context.push(AppRoutes.guardScan),
                  icon: const Icon(Icons.qr_code_scanner_rounded, size: 22),
                  label: const Text('Scan Checkpoint QR', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              IconButton.filled(
                onPressed: () => PatrolIncidentModal.show(context),
                icon: const Icon(Icons.report_problem_rounded, color: Colors.white),
                style: IconButton.styleFrom(
                  backgroundColor: AppColors.error,
                  padding: const EdgeInsets.all(14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                tooltip: 'Report Incident',
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCheckpointCard(
    PatrolCheckpointModel cp,
    bool isScanned,
    PatrolLogModel? log,
    int sequenceNo,
  ) {
    final scannedTimeStr = log != null ? DateFormat('hh:mm a').format(log.scannedAt) : null;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isScanned ? const Color(0xFF22C55E).withOpacity(0.4) : AppColors.border,
          width: isScanned ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
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
                          color: AppColors.primary.withOpacity(0.08),
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
