import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../visitor/providers/visitor_providers.dart';
import '../../../visitor/presentation/controllers/visitor_controller.dart';
import '../widgets/vehicle_log_search_header.dart';
import '../widgets/vehicle_log_summary_bar.dart';
import '../widgets/vehicle_log_empty_view.dart';
import '../widgets/vehicle_log_item_card.dart';

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
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text('Vehicle departure recorded successfully!'),
              ],
            ),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            duration: const Duration(seconds: 2),
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
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF1E3A8A), Color(0xFF0F172A)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
        foregroundColor: Colors.white,
        title: const Text(
          'Gate Vehicle Log & Parking',
          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
        ),
        elevation: 0,
      ),
      body: Column(
        children: [
          VehicleLogSearchHeader(
            searchController: _searchController,
            searchQuery: _searchQuery,
            onSearchChanged: (val) => setState(() => _searchQuery = val),
            onClear: () {
              _searchController.clear();
              setState(() => _searchQuery = '');
            },
          ),
          Expanded(
            child: visitorsAsync.when(
              loading: () => const Center(
                child: CircularProgressIndicator(color: Color(0xFF1E3A8A)),
              ),
              error: (err, st) => Center(child: Text('Error: $err')),
              data: (visitors) {
                var vehicleVisitors = visitors
                    .where((v) => v.vehicleNumber != null && v.vehicleNumber!.trim().isNotEmpty)
                    .toList();

                if (_searchQuery.isNotEmpty) {
                  final q = _searchQuery.toLowerCase();
                  vehicleVisitors = vehicleVisitors.where((v) {
                    final vn = (v.vehicleNumber ?? '').toLowerCase();
                    final name = v.name.toLowerCase();
                    final flat = v.hostFlat.toLowerCase();
                    return vn.contains(q) || name.contains(q) || flat.contains(q);
                  }).toList();
                }

                return Column(
                  children: [
                    VehicleLogSummaryBar(count: vehicleVisitors.length),
                    const Divider(height: 1, color: Color(0xFFE2E8F0)),
                    Expanded(
                      child: vehicleVisitors.isEmpty
                          ? const VehicleLogEmptyView()
                          : ListView.builder(
                              padding: const EdgeInsets.all(AppSpacing.pagePadding),
                              itemCount: vehicleVisitors.length,
                              itemBuilder: (context, index) {
                                final v = vehicleVisitors[index];
                                return VehicleLogItemCard(
                                  visitor: v,
                                  onExit: _markVehicleExited,
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
