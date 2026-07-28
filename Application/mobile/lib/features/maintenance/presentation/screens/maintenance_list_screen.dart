import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';

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
    final billsAsync = ref.watch(maintenanceBillsStreamProvider);

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
        data: (snapshot) {
          final allDocs = snapshot.docs;

          final pending = allDocs.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            return data['status'] != 'paid';
          }).toList();

          final paid = allDocs.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            return data['status'] == 'paid';
          }).toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _BillsListView(docs: pending, isPaid: false, ref: ref),
              _BillsListView(docs: paid, isPaid: true, ref: ref),
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
  final List<dynamic> docs;
  final bool isPaid;
  final WidgetRef ref;
  const _BillsListView({required this.docs, required this.isPaid, required this.ref});

  @override
  Widget build(BuildContext context) {
    if (docs.isEmpty) {
      return Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Icon(isPaid ? Icons.check_circle_outline_rounded : Icons.receipt_long_rounded,
              size: 56, color: AppColors.textDisabled),
          const SizedBox(height: AppSpacing.md),
          Text(isPaid ? 'No paid bills recorded' : 'No pending maintenance bills 🎉',
              style: const TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: AppSpacing.lg),
          if (!isPaid)
            ElevatedButton.icon(
              onPressed: () async {
                try {
                  final user = ref.read(currentUserProvider);
                  final db = FirebaseFirestore.instance;
                  final batch = db.batch();

                  final bills = [
                    {
                      'month': 'August 2026',
                      'invoiceNumber': 'INV-2026-08-101',
                      'amount': 3500.0,
                      'maintenanceCharges': 2500.0,
                      'waterCharges': 400.0,
                      'electricityCharges': 600.0,
                      'lateFee': 0.0,
                      'dueDate': '10 Aug 2026',
                      'status': 'pending',
                      'residentUid': user?.uid ?? '',
                      'societyId': 'SOC-001',
                      'createdAt': DateTime.now().toIso8601String(),
                    },
                    {
                      'month': 'July 2026',
                      'invoiceNumber': 'INV-2026-07-101',
                      'amount': 3700.0,
                      'maintenanceCharges': 2500.0,
                      'waterCharges': 450.0,
                      'electricityCharges': 550.0,
                      'lateFee': 200.0,
                      'dueDate': '10 Jul 2026',
                      'status': 'overdue',
                      'residentUid': user?.uid ?? '',
                      'societyId': 'SOC-001',
                      'createdAt': DateTime.now().subtract(const Duration(days: 30)).toIso8601String(),
                    },
                  ];

                  for (final b in bills) {
                    final docRef = db.collection('societies/SOC-001/maintenance_bills').doc();
                    batch.set(docRef, b);
                  }

                  await batch.commit();
                } catch (e) {
                  debugPrint('Seeding error: $e');
                }
              },
              icon: const Icon(Icons.receipt_rounded),
              label: const Text('Generate Sample Maintenance Bills'),
            ),
        ]),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: docs.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, index) {
        final doc = docs[index];
        final data = doc.data() as Map<String, dynamic>;
        return _BillCard(
          docId: doc.id,
          month: data['month'] ?? 'Unknown',
          amount: (data['amount'] ?? 0).toDouble(),
          dueDate: data['dueDate'] ?? '',
          status: data['status'] ?? 'pending',
          ref: ref,
        );
      },
    );
  }
}

class _BillCard extends StatelessWidget {
  final String docId, month, dueDate, status;
  final double amount;
  final WidgetRef ref;
  const _BillCard({
    required this.docId, required this.month, required this.amount,
    required this.dueDate, required this.status, required this.ref,
  });

  Color get _statusColor {
    switch (status) {
      case 'paid': return AppColors.success;
      case 'overdue': return AppColors.error;
      default: return AppColors.warning;
    }
  }

  String get _statusLabel {
    switch (status) {
      case 'paid': return 'Paid';
      case 'overdue': return 'Overdue';
      default: return 'Pending';
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
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 44, height: 44,
                decoration: BoxDecoration(
                  color: AppColors.maintenance.withOpacity(0.1),
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
                      color: _statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    child: Text(_statusLabel, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor)),
                  ),
                ],
              ),
            ],
          ),
          if (status != 'paid') ...[
            const SizedBox(height: AppSpacing.md),
            const Divider(height: 0),
            const SizedBox(height: AppSpacing.md),
            ElevatedButton(
              onPressed: () async {
                final firestoreService = ref.read(firestoreServiceProvider);
                final user = ref.read(currentUserProvider);
                if (firestoreService == null || user == null) return;
                try {
                  await firestoreService.payMaintenanceBill(
                    billId: docId,
                    residentUid: user.uid,
                    amount: amount,
                    paymentMethod: 'UPI / Card',
                    invoiceNumber: 'INV-$month',
                    billingPeriod: month,
                  );
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('✅ Payment recorded!'), backgroundColor: AppColors.success),
                    );
                  }
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
                    );
                  }
                }
              },
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 44)),
              child: const Text('Pay Now'),
            ),
          ],
        ],
      ),
    );
  }
}
