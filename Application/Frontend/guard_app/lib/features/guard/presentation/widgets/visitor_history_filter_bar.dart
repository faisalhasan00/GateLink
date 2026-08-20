import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class VisitorHistoryFilterBar extends StatelessWidget {
  final TextEditingController searchController;
  final String searchQuery;
  final ValueChanged<String> onSearchChanged;
  final VoidCallback onClearSearch;
  final String dateFilter;
  final ValueChanged<String> onDateFilterChanged;
  final String statusFilter;
  final ValueChanged<String> onStatusFilterChanged;
  final String categoryFilter;
  final ValueChanged<String> onCategoryFilterChanged;
  final String sortBy;
  final ValueChanged<String> onSortByChanged;

  const VisitorHistoryFilterBar({
    super.key,
    required this.searchController,
    required this.searchQuery,
    required this.onSearchChanged,
    required this.onClearSearch,
    required this.dateFilter,
    required this.onDateFilterChanged,
    required this.statusFilter,
    required this.onStatusFilterChanged,
    required this.categoryFilter,
    required this.onCategoryFilterChanged,
    required this.sortBy,
    required this.onSortByChanged,
  });

  @override
  Widget build(BuildContext context) {
    const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'All Time'];
    const statusOptions = ['All', 'Inside', 'Pending', 'Approved', 'Denied', 'Checked Out'];
    const categoryOptions = ['All', 'Guest', 'Delivery', 'Cab', 'Staff', 'Service Provider', 'Relative'];
    const sortOptions = ['Newest First', 'Oldest First', 'Visitor Name', 'Flat Number'];

    return Container(
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
            controller: searchController,
            onChanged: onSearchChanged,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Search by Visitor, Phone, Flat, Vehicle, QR ID...',
              hintStyle: const TextStyle(color: Colors.white60, fontSize: 12),
              prefixIcon: const Icon(Icons.search_rounded, color: Colors.white60),
              suffixIcon: searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear_rounded, color: Colors.white60),
                      onPressed: onClearSearch,
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
                  label: 'Date: $dateFilter',
                  options: dateOptions,
                  onSelected: onDateFilterChanged,
                ),
                const SizedBox(width: 6),
                _FilterDropdown(
                  label: 'Status: $statusFilter',
                  options: statusOptions,
                  onSelected: onStatusFilterChanged,
                ),
                const SizedBox(width: 6),
                _FilterDropdown(
                  label: 'Category: $categoryFilter',
                  options: categoryOptions,
                  onSelected: onCategoryFilterChanged,
                ),
                const SizedBox(width: 6),
                _FilterDropdown(
                  label: 'Sort: $sortBy',
                  options: sortOptions,
                  onSelected: onSortByChanged,
                ),
              ],
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
      itemBuilder: (ctx) => options.map((opt) {
        return PopupMenuItem(
          value: opt,
          child: Text(opt, style: const TextStyle(fontSize: 13)),
        );
      }).toList(),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white24),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.arrow_drop_down_rounded, color: Colors.white, size: 16),
          ],
        ),
      ),
    );
  }
}
