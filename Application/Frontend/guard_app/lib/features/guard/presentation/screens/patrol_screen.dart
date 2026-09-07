import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/patrol_log_model.dart';
import '../../providers/patrol_providers.dart';
import '../widgets/patrol_bottom_bar.dart';
import '../widgets/patrol_checkpoint_card.dart';
import '../widgets/patrol_empty_state.dart';
import '../widgets/patrol_incident_modal.dart';
import '../widgets/patrol_shift_header.dart';

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
              PatrolShiftHeader(
                timeStr: timeStr,
                dateStr: dateStr,
                scannedCount: scannedCount,
                totalCount: totalCount,
                progress: progress,
              ),
              Expanded(
                child: checkpoints.isEmpty
                    ? const PatrolEmptyState()
                    : ListView.separated(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        itemCount: checkpoints.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final cp = checkpoints[index];
                          final isScanned = scannedMap.containsKey(cp.id);
                          final log = scannedMap[cp.id];

                          return PatrolCheckpointCard(
                            cp: cp,
                            isScanned: isScanned,
                            log: log,
                            sequenceNo: index + 1,
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
      bottomNavigationBar: const PatrolBottomBar(),
    );
  }
}
