import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../visitor/providers/visitor_providers.dart';
import '../../../visitor/presentation/controllers/visitor_controller.dart';

class VehicleLogScreen extends ConsumerStatefulWidget {
  const VehicleLogScreen({super.key});

  @override
  ConsumerState<VehicleLogScreen> createState() => _VehicleLogScreenState();
}

class _VehicleLogScreenState extends ConsumerState<VehicleLogScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _markVehicleExited(String visitorId) async {
    try {
      await ref.read(visitorControllerProvider.notifier).markVisitorExit(visitorId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text('Visitor / Vehicle marked as checked out from gate!'),
              ],
            ),
            backgroundColor: AppColors.success,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final visitorsAsync = ref.watch(todayVisitorsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.secondary,
        foregroundColor: Colors.white,
        title: const Text('Gate Vehicle Log'),
        elevation: 0,
      ),
      body: Column(
        children: [
          Container(
            color: AppColors.secondary,
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePadding,
              0,
              AppSpacing.pagePadding,
              AppSpacing.md,
            ),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search by Vehicle No. or Flat...',
                hintStyle: const TextStyle(color: Colors.white60, fontSize: 13),
                prefixIcon: const Icon(Icons.search_rounded, color: Colors.white60),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded, color: Colors.white60),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                filled: true,
                fillColor: Colors.white.withValues(alpha: 0.15),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
            ),
          ),

          Expanded(
            child: visitorsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, st) => Center(child: Text('Error: $err')),
              data: (visitors) {
                var vehicleVisitors = visitors.where((v) => v.vehicleNumber != null && v.vehicleNumber!.isNotEmpty).toList();

                if (_searchQuery.isNotEmpty) {
                  vehicleVisitors = vehicleVisitors.where((v) {
                    final vn = (v.vehicleNumber ?? '').toLowerCase();
                    final name = v.name.toLowerCase();
                    final flat = v.hostFlat.toLowerCase();
                    final q = _searchQuery.toLowerCase();
                    return vn.contains(q) || name.contains(q) || flat.contains(q);
                  }).toList();
                }

                return Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding, vertical: AppSpacing.sm),
                      color: AppColors.primarySurface,
                      child: Row(
                        children: [
                          const Icon(Icons.directions_car_filled_rounded, color: AppColors.primary, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            '${vehicleVisitors.length} Vehicle${vehicleVisitors.length == 1 ? '' : 's'} Currently Inside',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary),
                          ),
                          const Spacer(),
                          const Row(
                            children: [
                              Icon(Icons.circle, color: AppColors.success, size: 7),
                              SizedBox(width: 4),
                              Text('Live Sync', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                            ],
                          ),
                        ],
                      ),
                    ),

                    Expanded(
                      child: vehicleVisitors.isEmpty
                          ? const Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.no_crash_rounded, size: 52, color: AppColors.gray300),
                                  SizedBox(height: 12),
                                  Text(
                                    'No vehicles inside the society',
                                    style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                                  ),
                                ],
                              ),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(AppSpacing.pagePadding),
                              itemCount: vehicleVisitors.length,
                              itemBuilder: (context, index) {
                                final v = vehicleVisitors[index];
                                final vehicleNumber = v.vehicleNumber ?? 'NO PLATE';
                                final name = v.name;
                                final hostFlat = v.hostFlat;
                                final type = v.type;

                                final entryStr = v.entryTime != null
                                    ? DateFormat('hh:mm a').format(v.entryTime!)
                                    : '--';

                                return Container(
                                  margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                                  padding: const EdgeInsets.all(AppSpacing.md),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(AppRadius.xl),
                                    border: Border.all(color: AppColors.border),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.04),
                                        blurRadius: 8,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                        decoration: BoxDecoration(
                                          color: AppColors.secondary,
                                          borderRadius: BorderRadius.circular(AppRadius.md),
                                        ),
                                        child: Text(
                                          vehicleNumber,
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w800,
                                            color: Colors.yellow,
                                            letterSpacing: 0.5,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: AppSpacing.md),

                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              name,
                                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                                            ),
                                            Text(
                                              'Flat $hostFlat',
                                              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                            ),
                                            Row(
                                              children: [
                                                Text(
                                                  'Type: $type',
                                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primary),
                                                ),
                                                const SizedBox(width: 8),
                                                const Icon(Icons.access_time_rounded, size: 11, color: AppColors.textSecondary),
                                                const SizedBox(width: 2),
                                                Text(
                                                  'In: $entryStr',
                                                  style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),

                                      OutlinedButton.icon(
                                        onPressed: () => _markVehicleExited(v.id),
                                        icon: const Icon(Icons.exit_to_app_rounded, size: 16),
                                        label: const Text('Exit'),
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor: AppColors.error,
                                          side: const BorderSide(color: AppColors.error),
                                          minimumSize: const Size(60, 34),
                                          padding: const EdgeInsets.symmetric(horizontal: 10),
                                          textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
