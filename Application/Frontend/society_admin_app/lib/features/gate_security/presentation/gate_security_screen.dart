import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/visitor_model.dart';

class GateSecurityScreen extends ConsumerStatefulWidget {
  const GateSecurityScreen({super.key});

  @override
  ConsumerState<GateSecurityScreen> createState() => _GateSecurityScreenState();
}

class _GateSecurityScreenState extends ConsumerState<GateSecurityScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _filterType = 'all'; // 'all', 'inside', 'checked_out'

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final visitorsAsync = ref.watch(visitorsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Gate & Security Oversight'),
      ),
      body: Column(
        children: [
          // Filter Chips & Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                AppTextField(
                  controller: _searchController,
                  hintText: 'Search visitor name, flat or vehicle...',
                  prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _FilterChip(
                        label: 'All Logs',
                        isSelected: _filterType == 'all',
                        onSelected: () => setState(() => _filterType = 'all'),
                      ),
                      const SizedBox(width: 8),
                      _FilterChip(
                        label: 'Inside Premises',
                        isSelected: _filterType == 'inside',
                        onSelected: () => setState(() => _filterType = 'inside'),
                      ),
                      const SizedBox(width: 8),
                      _FilterChip(
                        label: 'Checked Out',
                        isSelected: _filterType == 'checked_out',
                        onSelected: () => setState(() => _filterType = 'checked_out'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Visitor List
          Expanded(
            child: visitorsAsync.when(
              loading: () => const LoadingStateWidget(message: 'Streaming gate entries...'),
              error: (err, _) => ErrorStateWidget(
                message: 'Failed to stream visitor entries: ${err.toString()}',
                onRetry: () => ref.invalidate(visitorsStreamProvider),
              ),
              data: (visitors) {
                final query = _searchController.text.toLowerCase();
                final filtered = visitors.where((v) {
                  final matchesQuery = v.name.toLowerCase().contains(query) ||
                      v.flatNo.toLowerCase().contains(query) ||
                      (v.vehicleNumber != null && v.vehicleNumber!.toLowerCase().contains(query));

                  if (!matchesQuery) return false;

                  if (_filterType == 'inside') return v.status == 'inside';
                  if (_filterType == 'checked_out') return v.status == 'checked_out';
                  return true;
                }).toList();

                if (filtered.isEmpty) {
                  return const EmptyStateWidget(
                    title: 'No Gate Logs',
                    description: 'No visitor check-ins recorded for this selection.',
                    icon: Icons.shield_outlined,
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final visitor = filtered[index];
                    return _VisitorLogCard(visitor: visitor);
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

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onSelected;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onSelected,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryNavy : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primaryNavy : AppColors.cardBorder,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : AppColors.textSecondary,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}

class _VisitorLogCard extends StatelessWidget {
  final VisitorModel visitor;

  const _VisitorLogCard({required this.visitor});

  @override
  Widget build(BuildContext context) {
    final inTimeStr = visitor.inTime != null
        ? DateFormat('hh:mm a').format(visitor.inTime!)
        : 'N/A';
    final outTimeStr = visitor.outTime != null
        ? DateFormat('hh:mm a').format(visitor.outTime!)
        : null;

    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: AppColors.skyLight,
            child: Icon(
              visitor.visitorType == 'cab'
                  ? Icons.local_taxi
                  : visitor.visitorType == 'delivery'
                      ? Icons.local_shipping
                      : Icons.person,
              color: AppColors.secondarySky,
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      visitor.name,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    AppBadge(
                      label: visitor.status == 'inside' ? 'INSIDE' : 'EXITED',
                      variant: visitor.status == 'inside' ? BadgeVariant.success : BadgeVariant.neutral,
                      fontSize: 10,
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Visiting Flat ${visitor.flatNo} • ${visitor.purpose}',
                  style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                ),
                if (visitor.vehicleNumber != null && visitor.vehicleNumber!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.directions_car_outlined, size: 14, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        visitor.vehicleNumber!,
                        style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.login, size: 13, color: AppColors.successEmerald),
                    const SizedBox(width: 4),
                    Text(
                      'In: $inTimeStr',
                      style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                    ),
                    if (outTimeStr != null) ...[
                      const SizedBox(width: 12),
                      const Icon(Icons.logout, size: 13, color: AppColors.dangerCrimson),
                      const SizedBox(width: 4),
                      Text(
                        'Out: $outTimeStr',
                        style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
