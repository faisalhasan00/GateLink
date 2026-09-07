import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/maintenance_bill_model.dart';
import '../../providers/maintenance_providers.dart';
import '../widgets/maintenance_bill_card.dart';
import '../widgets/maintenance_skeleton_list.dart';
import '../widgets/maintenance_empty_bills_view.dart';

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
    final billsAsync = ref.watch(maintenanceBillsProvider);

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
          final pending = bills.where((b) => !b.isPaid).toList();
          final paid = bills.where((b) => b.isPaid).toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _BillsListView(bills: pending, isPaid: false, ref: ref),
              _BillsListView(bills: paid, isPaid: true, ref: ref),
            ],
          );
        },
        loading: () => const MaintenanceSkeletonList(),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _BillsListView extends StatelessWidget {
  final List<MaintenanceBillModel> bills;
  final bool isPaid;
  final WidgetRef ref;

  const _BillsListView({
    required this.bills,
    required this.isPaid,
    required this.ref,
  });

  @override
  Widget build(BuildContext context) {
    if (bills.isEmpty) {
      return MaintenanceEmptyBillsView(isPaid: isPaid, ref: ref);
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: bills.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, index) {
        return MaintenanceBillCard(bill: bills[index]);
      },
    );
  }
}
