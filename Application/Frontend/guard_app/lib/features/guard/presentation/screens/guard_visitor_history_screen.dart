import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../widgets/visitor_history_filter_bar.dart';
import '../widgets/visitor_history_log_card.dart';

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

  void _showVisitorDetail(Map<String, dynamic> data) {
    final name = data['name'] as String? ?? 'Visitor';
    final type = data['type'] as String? ?? 'Guest';
    final hostFlat = data['hostFlat'] as String? ?? 'N/A';
    final phone = data['phone'] as String? ?? 'N/A';
    final vehicleNumber = data['vehicleNumber'] as String? ?? 'None';
    final status = (data['status'] as String? ?? 'pending').toUpperCase();
    final qrCodeId = data['passCode'] as String? ?? data['qrCodeId'] as String? ?? 'N/A';

    DateTime entryTime = DateTime.now();
    if (data['createdAt'] != null) {
      entryTime = (data['createdAt'] as dynamic).toDate();
    } else if (data['entryTime'] != null) {
      entryTime = (data['entryTime'] as dynamic).toDate();
    }

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
        title: Row(
          children: [
            const Icon(Icons.badge_rounded, color: AppColors.secondary),
            const SizedBox(width: 8),
            Expanded(child: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18))),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _detailRow('Status', status),
            _detailRow('Category', type),
            _detailRow('Target Flat', hostFlat),
            _detailRow('Phone', phone),
            _detailRow('Vehicle', vehicleNumber),
            _detailRow('Gate Pass ID', qrCodeId),
            _detailRow('Entry Time', DateFormat('hh:mm a, dd MMM yyyy').format(entryTime)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        ],
      ),
    );
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
          // Filter Bar Component
          VisitorHistoryFilterBar(
            searchController: _searchController,
            searchQuery: _searchQuery,
            onSearchChanged: (v) => setState(() => _searchQuery = v.trim().toLowerCase()),
            onClearSearch: () {
              _searchController.clear();
              setState(() => _searchQuery = '');
            },
            dateFilter: _dateFilter,
            onDateFilterChanged: (val) => setState(() => _dateFilter = val),
            statusFilter: _statusFilter,
            onStatusFilterChanged: (val) => setState(() => _statusFilter = val),
            categoryFilter: _categoryFilter,
            onCategoryFilterChanged: (val) => setState(() => _categoryFilter = val),
            sortBy: _sortBy,
            onSortByChanged: (val) => setState(() => _sortBy = val),
          ),

          // Visitors History Feed
          Expanded(
            child: visitorsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, st) => Center(child: Text('Error loading history: $e')),
              data: (snapshot) {
                var docs = snapshot.docs.map((d) {
                  final data = d.data() as Map<String, dynamic>;
                  data['_id'] = d.id;
                  return data;
                }).toList();

                // 1. Search Query Filter
                if (_searchQuery.isNotEmpty) {
                  docs = docs.where((d) {
                    final name = (d['name'] as String? ?? '').toLowerCase();
                    final phone = (d['phone'] as String? ?? '').toLowerCase();
                    final flat = (d['hostFlat'] as String? ?? '').toLowerCase();
                    final veh = (d['vehicleNumber'] as String? ?? '').toLowerCase();
                    final qr = (d['passCode'] as String? ?? d['qrCodeId'] as String? ?? '').toLowerCase();
                    return name.contains(_searchQuery) ||
                        phone.contains(_searchQuery) ||
                        flat.contains(_searchQuery) ||
                        veh.contains(_searchQuery) ||
                        qr.contains(_searchQuery);
                  }).toList();
                }

                // 2. Status Filter
                if (_statusFilter != 'All') {
                  docs = docs.where((d) {
                    final status = (d['status'] as String? ?? '').toLowerCase();
                    return status == _statusFilter.toLowerCase();
                  }).toList();
                }

                // 3. Category Filter
                if (_categoryFilter != 'All') {
                  docs = docs.where((d) {
                    final type = (d['type'] as String? ?? '').toLowerCase();
                    return type == _categoryFilter.toLowerCase();
                  }).toList();
                }

                // 4. Date Filter
                docs = docs.where((d) {
                  DateTime date = DateTime.now();
                  if (d['createdAt'] != null) {
                    date = (d['createdAt'] as dynamic).toDate();
                  } else if (d['entryTime'] != null) {
                    date = (d['entryTime'] as dynamic).toDate();
                  }
                  return _matchesDateFilter(date);
                }).toList();

                if (docs.isEmpty) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(AppSpacing.lg),
                      child: Text(
                        'No visitor log records matching the active filter criteria.',
                        style: TextStyle(color: AppColors.textSecondary),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  itemCount: docs.length,
                  itemBuilder: (ctx, i) {
                    final data = docs[i];
                    return VisitorHistoryLogCard(
                      data: data,
                      onTap: () => _showVisitorDetail(data),
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
