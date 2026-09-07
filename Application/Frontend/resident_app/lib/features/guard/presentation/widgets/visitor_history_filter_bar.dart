import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class VisitorHistoryFilterBar extends StatelessWidget {
  final TextEditingController searchController;
  final String searchQuery;
  final ValueChanged<String> onSearchChanged;
  final VoidCallback onClearSearch;
  final String dateFilter;
  final List<String> dateOptions;
  final ValueChanged<String> onDateSelected;
  final String statusFilter;
  final List<String> statusOptions;
  final ValueChanged<String> onStatusSelected;
  final String categoryFilter;
  final List<String> categoryOptions;
  final ValueChanged<String> onCategorySelected;
  final String sortBy;
  final List<String> sortOptions;
  final ValueChanged<String> onSortSelected;

  const VisitorHistoryFilterBar({
    super.key,
    required this.searchController,
    required this.searchQuery,
    required this.onSearchChanged,
    required this.onClearSearch,
    required this.dateFilter,
    required this.dateOptions,
    required this.onDateSelected,
    required this.statusFilter,
    required this.statusOptions,
    required this.onStatusSelected,
    required this.categoryFilter,
    required this.categoryOptions,
    required this.onCategorySelected,
    required this.sortBy,
    required this.sortOptions,
    required this.onSortSelected,
  });

  @override
  Widget build(BuildContext context) {
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
                  onSelected: onDateSelected,
                ),
                const SizedBox(width: 6),
                _FilterDropdown(
                  label: 'Status: $statusFilter',
                  options: statusOptions,
                  onSelected: onStatusSelected,
                ),
                const SizedBox(width: 6),
                _FilterDropdown(
                  label: 'Category: $categoryFilter',
                  options: categoryOptions,
                  onSelected: onCategorySelected,
                ),
                const SizedBox(width: 6),
                _FilterDropdown(
                  label: 'Sort: $sortBy',
                  options: sortOptions,
                  onSelected: onSortSelected,
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
      itemBuilder: (context) => options
          .map((opt) => PopupMenuItem(
              value: opt,
              child: Text(opt, style: const TextStyle(fontSize: 13))))
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
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.arrow_drop_down_rounded, color: Colors.white, size: 16),
          ],
        ),
      ),
    );
  }
}
