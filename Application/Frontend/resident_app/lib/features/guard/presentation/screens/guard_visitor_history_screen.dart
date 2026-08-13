import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';

class GuardVisitorHistoryScreen extends ConsumerStatefulWidget {
  const GuardVisitorHistoryScreen({super.key});

  @override
  ConsumerState<GuardVisitorHistoryScreen> createState() => _GuardVisitorHistoryScreenState();
}

class _GuardVisitorHistoryScreenState extends ConsumerState<GuardVisitorHistoryScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  String _dateFilter = 'All Time';
  String _statusFilter = 'All';
  String _categoryFilter = 'All';
  String _sortBy = 'Newest First';

  final List<String> _dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'All Time'];
  final List<String> _statusOptions = ['All', 'Inside', 'Pending', 'Approved', 'Denied', 'Checked Out'];
  final List<String> _categoryOptions = ['All', 'Guest', 'Delivery', 'Cab', 'Staff', 'Service Provider', 'Relative'];
  final List<String> _sortOptions = ['Newest First', 'Oldest First', 'Visitor Name', 'Flat Number'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  bool _matchesDateFilter(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    if (_dateFilter == 'Today') {
      return date.isAfter(today);
    } else if (_dateFilter == 'Yesterday') {
      final yest = today.subtract(const Duration(days: 1));
      return date.isAfter(yest) && date.isBefore(today);
    } else if (_dateFilter == 'Last 7 Days') {
      final weekAgo = today.subtract(const Duration(days: 7));
      return date.isAfter(weekAgo);
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final visitorsAsync = ref.watch(visitorsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.secondary,
        foregroundColor: Colors.white,
        title: const Text('Visitor History & Log'),
        elevation: 0,
      ),
      body: Column(
        children: [
          // Search & Filter Control Panel
          Container(
            color: AppColors.secondary,
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePadding,
              0,
              AppSpacing.pagePadding,
              AppSpacing.md,
            ),
            child: Column(
              children: [
                // Search Input
                TextField(
                  controller: _searchController,
                  onChanged: (v) => setState(() => _searchQuery = v.trim().toLowerCase()),
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search by Visitor, Phone, Flat, Vehicle, QR ID...',
                    hintStyle: const TextStyle(color: Colors.white60, fontSize: 12),
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
                    contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),

                // Filter Pills Row
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _FilterDropdown(
                        label: 'Date: $_dateFilter',
                        options: _dateOptions,
                        onSelected: (val) => setState(() => _dateFilter = val),
                      ),
                      const SizedBox(width: 6),
                      _FilterDropdown(
                        label: 'Status: $_statusFilter',
                        options: _statusOptions,
                        onSelected: (val) => setState(() => _statusFilter = val),
                      ),
                      const SizedBox(width: 6),
                      _FilterDropdown(
                        label: 'Category: $_categoryFilter',
                        options: _categoryOptions,
                        onSelected: (val) => setState(() => _categoryFilter = val),
                      ),
                      const SizedBox(width: 6),
                      _FilterDropdown(
                        label: 'Sort: $_sortBy',
                        options: _sortOptions,
                        onSelected: (val) => setState(() => _sortBy = val),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Visitors History Feed
          Expanded(
            child: visitorsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, st) => Center(child: Text('Error loading history: $e')),
              data: (visitors) {
                var docs = visitors.map((v) => v.toMap()..['_id'] = v.id).toList();

                // 1. Apply Search Filter
                if (_searchQuery.isNotEmpty) {
                  docs = docs.where((d) {
                    final name = (d['name'] ?? '').toString().toLowerCase();
                    final phone = (d['phone'] ?? '').toString().toLowerCase();
                    final hostFlat = (d['hostFlat'] ?? '').toString().toLowerCase();
                    final residentName = (d['hostResidentName'] ?? '').toString().toLowerCase();
                    final vehicle = (d['vehicleNumber'] ?? '').toString().toLowerCase();
                    final qrCode = (d['qrCode'] ?? '').toString().toLowerCase();

                    return name.contains(_searchQuery) ||
                        phone.contains(_searchQuery) ||
                        hostFlat.contains(_searchQuery) ||
                        residentName.contains(_searchQuery) ||
                        vehicle.contains(_searchQuery) ||
                        qrCode.contains(_searchQuery);
                  }).toList();
                }

                // 2. Apply Date Filter
                docs = docs.where((d) {
                  final createdStr = d['createdAt'] as String? ?? d['createdDate'] as String?;
                  if (createdStr != null) {
                    try {
                      final dt = DateTime.parse(createdStr);
                      return _matchesDateFilter(dt);
                    } catch (_) {}
                  }
                  return true;
                }).toList();

                // 3. Apply Status Filter
                if (_statusFilter != 'All') {
                  docs = docs.where((d) {
                    final st = (d['status'] ?? '').toString().toLowerCase();
                    final target = _statusFilter.toLowerCase().replaceAll(' ', '_');
                    return st == target || (target == 'checked_out' && st == 'left');
                  }).toList();
                }

                // 4. Apply Category Filter
                if (_categoryFilter != 'All') {
                  docs = docs.where((d) {
                    final type = (d['type'] ?? '').toString().toLowerCase();
                    return type == _categoryFilter.toLowerCase();
                  }).toList();
                }

                // 5. Apply Sorting
                docs.sort((a, b) {
                  if (_sortBy == 'Visitor Name') {
                    return (a['name'] ?? '').toString().compareTo((b['name'] ?? '').toString());
                  } else if (_sortBy == 'Flat Number') {
                    return (a['hostFlat'] ?? '').toString().compareTo((b['hostFlat'] ?? '').toString());
                  } else if (_sortBy == 'Oldest First') {
                    final aTime = a['createdAt'] ?? a['createdDate'] ?? '';
                    final bTime = b['createdAt'] ?? b['createdDate'] ?? '';
                    return aTime.compareTo(bTime);
                  } else {
                    // Newest First (default)
                    final aTime = a['createdAt'] ?? a['createdDate'] ?? '';
                    final bTime = b['createdAt'] ?? b['createdDate'] ?? '';
                    return bTime.compareTo(aTime);
                  }
                });

                if (docs.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.history_toggle_off_rounded, size: 54, color: AppColors.gray300),
                        const SizedBox(height: 12),
                        const Text(
                          'No Visitor History Available',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Try adjusting search or filter options',
                          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  itemCount: docs.length,
                  itemBuilder: (context, index) {
                    final item = docs[index];
                    final docId = item['_id'] as String;
                    final name = item['name'] ?? 'Visitor';
                    final type = item['type'] ?? 'Guest';
                    final hostFlat = item['hostFlat'] ?? 'N/A';
                    final residentName = item['hostResidentName'] ?? 'Resident';
                    final status = item['status'] ?? 'pending';
                    final phone = item['phone'] ?? '';
                    final durationStr = item['durationString'] as String?;
                    final createdStr = item['createdDate'] ?? item['createdAt'] ?? '';

                    DateTime? createdDt;
                    try {
                      createdDt = DateTime.parse(createdStr);
                    } catch (_) {}

                    final formattedDate = createdDt != null
                        ? DateFormat('d MMM, hh:mm a').format(createdDt)
                        : 'Recent';

                    final isInside = status == 'inside';
                    final isCheckedOut = status == 'checked_out' || status == 'left';
                    final isDenied = status == 'denied' || status == 'rejected';

                    return Card(
                      margin: const EdgeInsets.only(bottom: AppSpacing.md),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                        side: BorderSide(color: AppColors.border.withValues(alpha: 0.8)),
                      ),
                      elevation: 0,
                      child: InkWell(
                        onTap: () => context.go('/visitors/$docId'),
                        borderRadius: BorderRadius.circular(AppRadius.lg),
                        child: Padding(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 24,
                                backgroundColor: isInside
                                    ? AppColors.primary
                                    : isCheckedOut
                                        ? AppColors.gray400
                                        : isDenied
                                            ? AppColors.error
                                            : AppColors.secondary,
                                child: Text(
                                  name.isNotEmpty ? name[0].toUpperCase() : 'V',
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            name,
                                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: isInside
                                                ? AppColors.success.withValues(alpha: 0.15)
                                                : isCheckedOut
                                                    ? AppColors.gray200
                                                    : isDenied
                                                        ? AppColors.error.withValues(alpha: 0.15)
                                                        : AppColors.warning.withValues(alpha: 0.15),
                                            borderRadius: BorderRadius.circular(AppRadius.full),
                                          ),
                                          child: Text(
                                            status.toUpperCase().replaceAll('_', ' '),
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w800,
                                              color: isInside
                                                  ? AppColors.success
                                                  : isCheckedOut
                                                      ? AppColors.textSecondary
                                                      : isDenied
                                                          ? AppColors.error
                                                          : AppColors.warning,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      '$type  •  Flat $hostFlat ($residentName)',
                                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        const Icon(Icons.access_time_rounded, size: 13, color: AppColors.textDisabled),
                                        const SizedBox(width: 4),
                                        Text(formattedDate, style: const TextStyle(fontSize: 11, color: AppColors.textDisabled)),
                                        if (durationStr != null) ...[
                                          const SizedBox(width: 8),
                                          const Icon(Icons.timer_outlined, size: 13, color: AppColors.secondary),
                                          const SizedBox(width: 3),
                                          Text(durationStr, style: const TextStyle(fontSize: 11, color: AppColors.secondary, fontWeight: FontWeight.w700)),
                                        ],
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Icon(Icons.chevron_right_rounded, color: AppColors.gray400),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterDropdown extends StatelessWidget {
  final String label;
  final List<String> options;
  final ValueChanged<String> onSelected;

  const _FilterDropdown({
    required this.label,
    required this.options,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      onSelected: onSelected,
      itemBuilder: (context) => options
          .map((opt) => PopupMenuItem(value: opt, child: Text(opt, style: const TextStyle(fontSize: 13))))
          .toList(),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(label, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
            const SizedBox(width: 4),
            const Icon(Icons.arrow_drop_down_rounded, color: Colors.white, size: 16),
          ],
        ),
      ),
    );
  }
}
