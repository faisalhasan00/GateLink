import 'package:flutter/material.dart';
import '../../../../core/localization/app_strings.dart';
import 'stat_card.dart';

class GuardStatsSection extends StatelessWidget {
  final AppStrings tr;
  final int insideCount;
  final int pendingCount;
  final int approvedCount;
  final int deliveryCount;
  final int exitedCount;
  final String selectedFilter;
  final ValueChanged<String> onFilterChanged;

  const GuardStatsSection({
    super.key,
    required this.tr,
    required this.insideCount,
    required this.pendingCount,
    required this.approvedCount,
    required this.deliveryCount,
    required this.exitedCount,
    required this.selectedFilter,
    required this.onFilterChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: StatCard(
                title: tr.get('inside_now'),
                value: '$insideCount',
                icon: Icons.meeting_room_rounded,
                color: const Color(0xFF10B981),
                trend: tr.get('inside_trend'),
                isSelected: selectedFilter == 'Inside',
                onTap: () => onFilterChanged(
                    selectedFilter == 'Inside' ? 'All' : 'Inside'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: StatCard(
                title: tr.get('awaiting'),
                value: '$pendingCount',
                icon: Icons.hourglass_top_rounded,
                color: const Color(0xFFF59E0B),
                trend: tr.get('awaiting_trend'),
                isSelected: selectedFilter == 'Pending',
                onTap: () => onFilterChanged(
                    selectedFilter == 'Pending' ? 'All' : 'Pending'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: StatCard(
                title: tr.get('approved'),
                value: '$approvedCount',
                icon: Icons.check_circle_rounded,
                color: const Color(0xFF0EA5E9),
                trend: tr.get('approved_trend'),
                isSelected: selectedFilter == 'Approved',
                onTap: () => onFilterChanged(
                    selectedFilter == 'Approved' ? 'All' : 'Approved'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: StatCard(
                title: tr.get('deliveries_today'),
                value: '$deliveryCount',
                icon: Icons.local_shipping_rounded,
                color: const Color(0xFFF97316),
                trend: tr.get('deliveries_trend'),
                isSelected: selectedFilter == 'Delivery',
                onTap: () => onFilterChanged(
                    selectedFilter == 'Delivery' ? 'All' : 'Delivery'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: StatCard(
                title: tr.get('exited'),
                value: '$exitedCount',
                icon: Icons.exit_to_app_rounded,
                color: const Color(0xFF64748B),
                trend: tr.get('exited_trend'),
                isSelected: selectedFilter == 'Exited',
                onTap: () => onFilterChanged(
                    selectedFilter == 'Exited' ? 'All' : 'Exited'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
