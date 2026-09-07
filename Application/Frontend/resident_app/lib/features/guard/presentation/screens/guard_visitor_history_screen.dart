import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../widgets/visitor_history_filter_bar.dart';
import '../widgets/visitor_history_item_card.dart';
import '../widgets/visitor_history_empty_state.dart';

class GuardVisitorHistoryScreen extends ConsumerStatefulWidget {
  const GuardVisitorHistoryScreen({super.key});

  @override
  ConsumerState<GuardVisitorHistoryScreen> createState() =>
      _GuardVisitorHistoryScreenState();
}

class _GuardVisitorHistoryScreenState
    extends ConsumerState<GuardVisitorHistoryScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  String _dateFilter = 'All Time';
  String _statusFilter = 'All';
  String _categoryFilter = 'All';
  String _sortBy = 'Newest First';

  final List<String> _dateOptions = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'All Time'
  ];
  final List<String> _statusOptions = [
    'All',
    'Inside',
    'Pending',
    'Approved',
    'Denied',
    'Checked Out'
  ];
  final List<String> _categoryOptions = [
    'All',
    'Guest',
    'Delivery',
    'Cab',
    'Staff',
    'Service Provider',
    'Relative'
  ];
  final List<String> _sortOptions = [
    'Newest First',
    'Oldest First',
    'Visitor Name',
    'Flat Number'
  ];

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

  List<Map<String, dynamic>> _filterAndSort(List<Map<String, dynamic>> docs) {
    var result = docs;

    // 1. Search Filter
    if (_searchQuery.isNotEmpty) {
      result = result.where((d) {
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

    // 2. Date Filter
    result = result.where((d) {
      final createdStr = d['createdAt'] as String? ?? d['createdDate'] as String?;
      if (createdStr != null) {
        try {
          final dt = DateTime.parse(createdStr);
          return _matchesDateFilter(dt);
        } catch (_) {}
      }
      return true;
    }).toList();

    // 3. Status Filter
    if (_statusFilter != 'All') {
      result = result.where((d) {
        final st = (d['status'] ?? '').toString().toLowerCase();
        final target = _statusFilter.toLowerCase().replaceAll(' ', '_');
        return st == target || (target == 'checked_out' && st == 'left');
      }).toList();
    }

    // 4. Category Filter
    if (_categoryFilter != 'All') {
      result = result.where((d) {
        final type = (d['type'] ?? '').toString().toLowerCase();
        return type == _categoryFilter.toLowerCase();
      }).toList();
    }

    // 5. Sorting
    result.sort((a, b) {
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

    return result;
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
          VisitorHistoryFilterBar(
            searchController: _searchController,
            searchQuery: _searchQuery,
            onSearchChanged: (v) => setState(() => _searchQuery = v.trim().toLowerCase()),
            onClearSearch: () {
              _searchController.clear();
              setState(() => _searchQuery = '');
            },
            dateFilter: _dateFilter,
            dateOptions: _dateOptions,
            onDateSelected: (val) => setState(() => _dateFilter = val),
            statusFilter: _statusFilter,
            statusOptions: _statusOptions,
            onStatusSelected: (val) => setState(() => _statusFilter = val),
            categoryFilter: _categoryFilter,
            categoryOptions: _categoryOptions,
            onCategorySelected: (val) => setState(() => _categoryFilter = val),
            sortBy: _sortBy,
            sortOptions: _sortOptions,
            onSortSelected: (val) => setState(() => _sortBy = val),
          ),

          // Visitors History Feed
          Expanded(
            child: visitorsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, st) => Center(child: Text('Error loading history: $e')),
              data: (visitors) {
                final rawDocs = visitors.map((v) => v.toMap()..['_id'] = v.id).toList();
                final docs = _filterAndSort(rawDocs);

                if (docs.isEmpty) {
                  return const VisitorHistoryEmptyState();
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(AppSpacing.pagePadding),
                  itemCount: docs.length,
                  itemBuilder: (context, index) {
                    final item = docs[index];
                    final docId = item['_id'] as String;
                    return VisitorHistoryItemCard(
                      item: item,
                      onTap: () => context.go('/visitors/$docId'),
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
