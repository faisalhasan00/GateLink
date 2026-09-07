import 'package:flutter/material.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/theme/app_spacing.dart';

class GuardActivityFilterBar extends StatelessWidget {
  final AppStrings tr;
  final TextEditingController searchController;
  final String searchQuery;
  final String selectedFilter;
  final int totalCount;
  final int insideCount;
  final int pendingCount;
  final int approvedCount;
  final int deliveryCount;
  final int cabCount;
  final int exitedCount;
  final ValueChanged<String> onSearchChanged;
  final ValueChanged<String> onFilterSelected;

  const GuardActivityFilterBar({
    super.key,
    required this.tr,
    required this.searchController,
    required this.searchQuery,
    required this.selectedFilter,
    required this.totalCount,
    required this.insideCount,
    required this.pendingCount,
    required this.approvedCount,
    required this.deliveryCount,
    required this.cabCount,
    required this.exitedCount,
    required this.onSearchChanged,
    required this.onFilterSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border.all(color: const Color(0xFFCBD5E1), width: 1.2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: TextField(
            controller: searchController,
            onChanged: onSearchChanged,
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
            decoration: InputDecoration(
              hintText: tr.get('search_hint'),
              hintStyle: const TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 13,
                  fontWeight: FontWeight.w600),
              prefixIcon: const Icon(Icons.search_rounded,
                  color: Color(0xFF1E3A8A)),
              suffixIcon: searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear_rounded,
                          color: Color(0xFF64748B)),
                      onPressed: () {
                        searchController.clear();
                        onSearchChanged('');
                      },
                    )
                  : null,
              border: InputBorder.none,
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 14),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildFilterChip('All', tr.get('filter_all'), totalCount,
                  Icons.dashboard_rounded),
              _buildFilterChip('Inside', tr.get('filter_inside'), insideCount,
                  Icons.meeting_room_rounded),
              _buildFilterChip('Pending', tr.get('filter_pending'),
                  pendingCount, Icons.hourglass_top_rounded),
              _buildFilterChip('Approved', tr.get('filter_approved'),
                  approvedCount, Icons.check_circle_rounded),
              _buildFilterChip('Delivery', tr.get('filter_delivery'),
                  deliveryCount, Icons.local_shipping_rounded),
              _buildFilterChip('Cab', tr.get('filter_cab'), cabCount,
                  Icons.local_taxi_rounded),
              _buildFilterChip('Exited', tr.get('filter_exited'), exitedCount,
                  Icons.exit_to_app_rounded),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFilterChip(
      String filter, String label, int count, IconData icon) {
    final isSelected = selectedFilter == filter;
    return Padding(
      padding: const EdgeInsets.only(right: 6.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => onFilterSelected(filter),
          borderRadius: BorderRadius.circular(20),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: isSelected ? const Color(0xFF1E3A8A) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isSelected
                    ? const Color(0xFF1E3A8A)
                    : const Color(0xFFCBD5E1),
              ),
              boxShadow: [
                if (isSelected)
                  BoxShadow(
                    color: const Color(0xFF1E3A8A).withValues(alpha: 0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  icon,
                  size: 13,
                  color: isSelected ? Colors.white : const Color(0xFF64748B),
                ),
                const SizedBox(width: 4),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11.5,
                    fontWeight:
                        isSelected ? FontWeight.w900 : FontWeight.w700,
                    color:
                        isSelected ? Colors.white : const Color(0xFF334155),
                  ),
                ),
                const SizedBox(width: 4),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Colors.white.withValues(alpha: 0.25)
                        : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$count',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      color:
                          isSelected ? Colors.white : const Color(0xFF64748B),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
