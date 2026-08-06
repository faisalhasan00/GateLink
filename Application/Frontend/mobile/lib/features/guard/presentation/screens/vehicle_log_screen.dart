import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';

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

  Future<void> _markVehicleExited(String docId) async {
    try {
      final firestoreService = ref.read(firestoreServiceProvider);
      await firestoreService.markVisitorExit(docId);
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
          // Search Bar Header
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

          // Live Firestore stream
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: ref.watch(firestoreServiceProvider).visitorsStream(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }

                // Filter: only entries that have a vehicleNumber
                var docs = (snapshot.data?.docs ?? []).where((d) {
                  final data = d.data() as Map<String, dynamic>;
                  final vn = data['vehicleNumber'] as String? ?? '';
                  return vn.isNotEmpty;
                }).toList();

                // Apply search filter
                if (_searchQuery.isNotEmpty) {
                  docs = docs.where((d) {
                    final data = d.data() as Map<String, dynamic>;
                    final vn = (data['vehicleNumber'] as String? ?? '').toLowerCase();
                    final name = (data['name'] as String? ?? '').toLowerCase();
                    final flat = (data['hostFlat'] as String? ?? '').toLowerCase();
                    final q = _searchQuery.toLowerCase();
                    return vn.contains(q) || name.contains(q) || flat.contains(q);
                  }).toList();
                }

                return Column(
                  children: [
                    // Count banner
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding, vertical: AppSpacing.sm),
                      color: AppColors.primarySurface,
                      child: Row(
                        children: [
                          const Icon(Icons.directions_car_filled_rounded, color: AppColors.primary, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            '${docs.length} Vehicle${docs.length == 1 ? '' : 's'} Currently Inside',
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

                    // Vehicle Cards
                    Expanded(
                      child: docs.isEmpty
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
                              itemCount: docs.length,
                              itemBuilder: (context, index) {
                                final doc = docs[index];
                                final data = doc.data() as Map<String, dynamic>;
                                final vehicleNumber = data['vehicleNumber'] as String? ?? 'NO PLATE';
                                final name = data['name'] as String? ?? 'Unknown';
                                final hostFlat = data['hostFlat'] as String? ?? '-';
                                final type = data['type'] as String? ?? 'Guest';

                                DateTime? entryTime;
                                try {
                                  entryTime = DateTime.parse(data['entryTime'] as String? ?? '');
                                } catch (_) {}
                                final entryStr = entryTime != null
                                    ? DateFormat('hh:mm a').format(entryTime)
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
                                      // License Plate Badge
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

                                      // Details
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

                                      // Exit Button
                                      OutlinedButton.icon(
                                        onPressed: () => _markVehicleExited(doc.id),
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
