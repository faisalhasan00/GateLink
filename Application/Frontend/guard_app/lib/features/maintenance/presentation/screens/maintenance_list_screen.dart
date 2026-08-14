import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/maintenance_providers.dart';

class MaintenanceListScreen extends ConsumerStatefulWidget {
  const MaintenanceListScreen({super.key});

  @override
  ConsumerState<MaintenanceListScreen> createState() => _MaintenanceListScreenState();
}

class _MaintenanceListScreenState extends ConsumerState<MaintenanceListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final billsAsync = ref.watch(guardMaintenanceBillsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Maintenance Bills'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabs: const [
            Tab(text: 'Pending'),
            Tab(text: 'Paid'),
          ],
        ),
      ),
      body: billsAsync.when(
        data: (bills) {
          final pending = bills.where((b) => b['status'] != 'paid').toList();
          final paid = bills.where((b) => b['status'] == 'paid').toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _BillsListView(bills: pending, isPaid: false),
              _BillsListView(bills: paid, isPaid: true),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _BillsListView extends StatelessWidget {
  final List<Map<String, dynamic>> bills;
  final bool isPaid;

  const _BillsListView({required this.bills, required this.isPaid});

  @override
  Widget build(BuildContext context) {
    if (bills.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isPaid ? Icons.check_circle_outline_rounded : Icons.receipt_long_rounded,
              size: 56,
              color: AppColors.textDisabled,
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              isPaid ? 'No paid bills recorded' : 'No pending maintenance bills 🎉',
              style: const TextStyle(color: AppColors.textSecondary),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: bills.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, index) {
        final data = bills[index];
        return _BillCard(
          docId: data['id'] as String? ?? '',
          month: data['month'] as String? ?? 'Unknown',
          amount: (data['amount'] ?? 0).toDouble(),
          dueDate: data['dueDate'] as String? ?? '',
          status: data['status'] as String? ?? 'pending',
        );
      },
    );
  }
}

class _BillCard extends StatelessWidget {
  final String docId, month, dueDate, status;
  final double amount;

  const _BillCard({
    required this.docId,
    required this.month,
    required this.amount,
    required this.dueDate,
    required this.status,
  });

  Color get _statusColor {
    switch (status) {
      case 'paid':
        return AppColors.success;
      case 'overdue':
        return AppColors.error;
      default:
        return AppColors.warning;
    }
  }

  String get _statusLabel {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Pending';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.maintenance.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: const Icon(Icons.receipt_long_rounded, color: AppColors.maintenance, size: 22),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(month, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                Text('Due: $dueDate', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('₹${amount.toStringAsFixed(0)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: _statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
                child: Text(_statusLabel, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
