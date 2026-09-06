import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/maintenance_model.dart';
import '../../../core/models/resident_model.dart';

class MaintenanceScreen extends ConsumerStatefulWidget {
  const MaintenanceScreen({super.key});

  @override
  ConsumerState<MaintenanceScreen> createState() => _MaintenanceScreenState();
}

class _MaintenanceScreenState extends ConsumerState<MaintenanceScreen> {
  String _filterStatus = 'All'; // 'All' | 'pending' | 'paid'

  void _showGenerateBillModal(BuildContext context, String societyId, List<ResidentModel> residents) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _GenerateBillBottomSheet(
        societyId: societyId,
        residents: residents,
      ),
    );
  }

  void _showRecordPaymentDialog(
    BuildContext context,
    String societyId,
    MaintenanceBillModel bill,
  ) {
    showDialog(
      context: context,
      builder: (ctx) {
        String selectedMode = 'cash';
        return StatefulBuilder(
          builder: (dialogCtx, setDialogState) {
            return AlertDialog(
              title: Text('Record Payment: Flat ${bill.flatNo}'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Amount: ₹${bill.amount.toStringAsFixed(0)}',
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                  ),
                  const SizedBox(height: 16),
                  const Text('Payment Mode:', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    initialValue: selectedMode,
                    items: const [
                      DropdownMenuItem(value: 'cash', child: Text('Cash / Offline Receipt')),
                      DropdownMenuItem(value: 'upi', child: Text('Direct UPI / QR Transfer')),
                      DropdownMenuItem(value: 'cheque', child: Text('Cheque / Bank Draft')),
                      DropdownMenuItem(value: 'netbanking', child: Text('NEFT / IMPS Transfer')),
                    ],
                    onChanged: (val) {
                      if (val != null) setDialogState(() => selectedMode = val);
                    },
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(dialogCtx).pop(),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () async {
                    await ref.read(firestoreServiceProvider).markBillPaid(
                          societyId,
                          bill.id,
                          selectedMode,
                        );
                    if (dialogCtx.mounted) Navigator.of(dialogCtx).pop();
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Payment recorded for Flat ${bill.flatNo}'),
                          backgroundColor: AppColors.successEmerald,
                        ),
                      );
                    }
                  },
                  child: const Text('Confirm Settlement'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final society = ref.watch(activeSocietyProvider);
    final billsAsync = ref.watch(maintenanceBillsStreamProvider);
    final residentsAsync = ref.watch(residentsStreamProvider);
    final currencyFmt = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    final residents = residentsAsync.maybeWhen(
      data: (list) => list,
      orElse: () => <ResidentModel>[],
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Maintenance & Invoicing'),
      ),
      floatingActionButton: society != null
          ? FloatingActionButton.extended(
              onPressed: () => _showGenerateBillModal(context, society.id, residents),
              backgroundColor: AppColors.primaryNavy,
              icon: const Icon(Icons.receipt_long, color: Colors.white),
              label: const Text(
                'Generate Bill',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
              ),
            )
          : null,
      body: billsAsync.when(
        loading: () => const LoadingStateWidget(message: 'Loading maintenance ledgers...'),
        error: (err, _) => ErrorStateWidget(
          message: 'Failed to load maintenance bills: ${err.toString()}',
          onRetry: () => ref.invalidate(maintenanceBillsStreamProvider),
        ),
        data: (bills) {
          final validBills = bills;

          final totalBilled = validBills.fold(0.0, (sum, b) => sum + b.amount);
          final totalCollected = validBills
              .where((b) => b.status == 'paid')
              .fold(0.0, (sum, b) => sum + b.amount);
          final totalPending = totalBilled - totalCollected;

          final filteredBills = validBills.where((b) {
            if (_filterStatus == 'All') return true;
            return b.status == _filterStatus;
          }).toList();

          return SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 90),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Financial Summary Card
                AppCard(
                  padding: const EdgeInsets.all(18),
                  backgroundColor: AppColors.primaryNavy,
                  child: Column(
                    children: [
                      const Text(
                        'Total Maintenance Outstanding',
                        style: TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        currencyFmt.format(totalPending),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Divider(color: Colors.white24, height: 1),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Collected', style: TextStyle(color: Colors.white70, fontSize: 11)),
                              const SizedBox(height: 2),
                              Text(
                                currencyFmt.format(totalCollected),
                                style: const TextStyle(color: AppColors.successEmerald, fontWeight: FontWeight.w700, fontSize: 15),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              const Text('Total Invoiced', style: TextStyle(color: Colors.white70, fontSize: 11)),
                              const SizedBox(height: 2),
                              Text(
                                currencyFmt.format(totalBilled),
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Filter chips
                Row(
                  children: [
                    _filterChip('All (${validBills.length})', 'All'),
                    const SizedBox(width: 8),
                    _filterChip('Pending (${validBills.where((b) => b.status != 'paid').length})', 'pending'),
                    const SizedBox(width: 8),
                    _filterChip('Paid (${validBills.where((b) => b.status == 'paid').length})', 'paid'),
                  ],
                ),
                const SizedBox(height: 16),

                if (filteredBills.isEmpty)
                  const EmptyStateWidget(
                    title: 'No Invoices Found',
                    description: 'No maintenance invoices match the selected filter.',
                    icon: Icons.receipt_outlined,
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filteredBills.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final bill = filteredBills[index];
                      return _MaintenanceBillItem(
                        bill: bill,
                        societyId: society!.id,
                        onMarkPaid: () {
                          _showRecordPaymentDialog(context, society.id, bill);
                        },
                      );
                    },
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _filterChip(String label, String value) {
    final isSelected = _filterStatus == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _filterStatus = value),
      selectedColor: AppColors.primaryNavy,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppColors.textPrimary,
        fontWeight: FontWeight.w600,
        fontSize: 12,
      ),
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: isSelected ? AppColors.primaryNavy : AppColors.cardBorder),
      ),
    );
  }
}

class _GenerateBillBottomSheet extends ConsumerStatefulWidget {
  final String societyId;
  final List<ResidentModel> residents;

  const _GenerateBillBottomSheet({
    required this.societyId,
    required this.residents,
  });

  @override
  ConsumerState<_GenerateBillBottomSheet> createState() => _GenerateBillBottomSheetState();
}

class _GenerateBillBottomSheetState extends ConsumerState<_GenerateBillBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController(text: 'Monthly Maintenance & Society Facilities');
  final _monthController = TextEditingController();
  final _dueDateController = TextEditingController();

  final _baseChargeController = TextEditingController(text: '3500');
  final _parkingChargeController = TextEditingController(text: '500');
  final _waterChargeController = TextEditingController(text: '300');
  final _sinkingFundController = TextEditingController(text: '200');

  String _scope = 'single'; // 'single' | 'all'
  String? _selectedResidentId;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _monthController.text = DateFormat('MMMM yyyy').format(now);
    final due = now.add(const Duration(days: 15));
    _dueDateController.text = DateFormat('yyyy-MM-dd').format(due);
  }

  @override
  void dispose() {
    _titleController.dispose();
    _monthController.dispose();
    _dueDateController.dispose();
    _baseChargeController.dispose();
    _parkingChargeController.dispose();
    _waterChargeController.dispose();
    _sinkingFundController.dispose();
    super.dispose();
  }

  double get _totalAmount {
    final b = double.tryParse(_baseChargeController.text) ?? 0;
    final p = double.tryParse(_parkingChargeController.text) ?? 0;
    final w = double.tryParse(_waterChargeController.text) ?? 0;
    final s = double.tryParse(_sinkingFundController.text) ?? 0;
    return b + p + w + s;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_scope == 'single' && (_selectedResidentId == null || _selectedResidentId!.isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a resident / flat for single billing.'),
          backgroundColor: AppColors.dangerCrimson,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final total = _totalAmount;
      final title = _titleController.text.trim();
      final month = _monthController.text.trim();
      final dueDate = _dueDateController.text.trim();
      final base = double.tryParse(_baseChargeController.text) ?? 0;
      final parking = double.tryParse(_parkingChargeController.text) ?? 0;
      final water = double.tryParse(_waterChargeController.text) ?? 0;
      final sinking = double.tryParse(_sinkingFundController.text) ?? 0;

      final service = ref.read(firestoreServiceProvider);

      if (_scope == 'all') {
        // Bulk generate ONLY for actual registered residents with flats
        final activeResidents = widget.residents
            .where((r) => r.isResident && r.flatNo.trim().isNotEmpty && r.status != 'rejected')
            .toList();

        if (activeResidents.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('No active residents with flats found to invoice.'),
              backgroundColor: AppColors.dangerCrimson,
            ),
          );
          return;
        }

        for (final res in activeResidents) {
          final invoiceNo = 'INV/2026-27/${1000 + DateTime.now().millisecondsSinceEpoch % 9000}';
          await service.createMaintenanceBill(widget.societyId, {
            'billNumber': invoiceNo,
            'invoiceNumber': invoiceNo,
            'title': title,
            'month': month,
            'dueDate': dueDate.split('T')[0],
            'amount': total,
            'maintenanceCharge': base,
            'parkingCharge': parking,
            'waterCharge': water,
            'sinkingFund': sinking,
            'residentUid': res.id,
            'residentName': res.name,
            'flatNumber': res.flatNo,
            'flatNo': res.flatNo,
            'wing': res.wing,
          });
        }
      } else {
        // Single flat
        final res = widget.residents.firstWhere((r) => r.id == _selectedResidentId);
        final invoiceNo = 'INV/2026-27/${1000 + DateTime.now().millisecondsSinceEpoch % 9000}';
        await service.createMaintenanceBill(widget.societyId, {
          'billNumber': invoiceNo,
          'invoiceNumber': invoiceNo,
          'title': title,
          'month': month,
          'dueDate': dueDate.split('T')[0],
          'amount': total,
          'maintenanceCharge': base,
          'parkingCharge': parking,
          'waterCharge': water,
          'sinkingFund': sinking,
          'residentUid': res.id,
          'residentName': res.name,
          'flatNumber': res.flatNo,
          'flatNo': res.flatNo,
          'wing': res.wing,
        });
      }

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_scope == 'all' ? 'Invoices generated for all flats!' : 'Maintenance bill generated successfully!'),
            backgroundColor: AppColors.successEmerald,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to generate bill: ${e.toString()}'),
            backgroundColor: AppColors.dangerCrimson,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
        top: 20,
        left: 20,
        right: 20,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Generate Maintenance Bill',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.primaryNavy,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Target Scope
              const Text('Target Scope', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
              const SizedBox(height: 8),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(
                    value: 'single',
                    label: Text('Single Flat'),
                    icon: Icon(Icons.person_outline, size: 16),
                  ),
                  ButtonSegment(
                    value: 'all',
                    label: Text('All Registered Flats'),
                    icon: Icon(Icons.apartment_outlined, size: 16),
                  ),
                ],
                selected: {_scope},
                onSelectionChanged: (newSelection) {
                  setState(() => _scope = newSelection.first);
                },
              ),
              const SizedBox(height: 14),

              if (_scope == 'single') ...[
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Select Flat / Resident *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.cardBorder),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedResidentId,
                          isExpanded: true,
                          hint: const Text('Choose Flat'),
                          items: widget.residents.map((r) {
                            return DropdownMenuItem(
                              value: r.id,
                              child: Text('Flat ${r.flatNo} - ${r.name}'),
                            );
                          }).toList(),
                          onChanged: (val) => setState(() => _selectedResidentId = val),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
              ],

              AppTextField(
                controller: _titleController,
                label: 'Invoice Title *',
                hintText: 'e.g. Monthly Maintenance',
                validator: (v) => v == null || v.isEmpty ? 'Title required' : null,
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: AppTextField(
                      controller: _monthController,
                      label: 'Billing Month *',
                      hintText: 'e.g. September 2026',
                      validator: (v) => v == null || v.isEmpty ? 'Month required' : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppTextField(
                      controller: _dueDateController,
                      label: 'Due Date *',
                      hintText: 'YYYY-MM-DD',
                      validator: (v) => v == null || v.isEmpty ? 'Due date required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Fee Breakdown Slabs Box
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.cardBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Fee Itemization Breakdown (₹)',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.primaryNavy),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: AppTextField(
                            controller: _baseChargeController,
                            label: 'Base (₹)',
                            keyboardType: TextInputType.number,
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: AppTextField(
                            controller: _parkingChargeController,
                            label: 'Parking (₹)',
                            keyboardType: TextInputType.number,
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: AppTextField(
                            controller: _waterChargeController,
                            label: 'Water & Util (₹)',
                            keyboardType: TextInputType.number,
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: AppTextField(
                            controller: _sinkingFundController,
                            label: 'Sinking Fund (₹)',
                            keyboardType: TextInputType.number,
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Computed Total per Flat:',
                          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                        ),
                        Text(
                          '₹${_totalAmount.toStringAsFixed(0)}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: AppColors.primaryNavy,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      label: 'Cancel',
                      onPressed: () => Navigator.pop(context),
                      variant: ButtonVariant.outline,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppButton(
                      label: _scope == 'all' ? 'Issue to All Flats' : 'Issue Invoice',
                      isLoading: _isSubmitting,
                      onPressed: _submit,
                      variant: ButtonVariant.primary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MaintenanceBillItem extends ConsumerWidget {
  final MaintenanceBillModel bill;
  final String societyId;
  final VoidCallback onMarkPaid;

  const _MaintenanceBillItem({
    required this.bill,
    required this.societyId,
    required this.onMarkPaid,
  });

  String _formatDueDate(DateTime? date) {
    if (date == null) return 'N/A';
    return DateFormat('yyyy-MM-dd').format(date);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isPaid = bill.status == 'paid';
    final cleanFlat = bill.flatNo.isNotEmpty ? 'Flat ${bill.flatNo}' : 'Flat N/A';

    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: isPaid ? AppColors.emeraldLight : AppColors.crimsonLight,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              cleanFlat,
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: isPaid ? AppColors.successEmerald : AppColors.dangerCrimson,
                fontSize: 13,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  bill.residentName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Month: ${bill.month} • Due: ${_formatDueDate(bill.dueDate)}',
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '₹${bill.amount.toStringAsFixed(0)}',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (isPaid)
                    const AppBadge(label: 'PAID', variant: BadgeVariant.success, fontSize: 10)
                  else
                    AppButton(
                      label: 'Settle',
                      onPressed: onMarkPaid,
                      variant: ButtonVariant.outline,
                    ),
                  const SizedBox(width: 6),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, size: 18, color: AppColors.textMuted),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    tooltip: 'Delete Bill',
                    onPressed: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (dCtx) => AlertDialog(
                          title: const Text('Delete Invoice?'),
                          content: Text('Are you sure you want to delete invoice for ${bill.residentName} ($cleanFlat)?'),
                          actions: [
                            TextButton(onPressed: () => Navigator.pop(dCtx, false), child: const Text('Cancel')),
                            TextButton(
                              onPressed: () => Navigator.pop(dCtx, true),
                              style: TextButton.styleFrom(foregroundColor: AppColors.dangerCrimson),
                              child: const Text('Delete'),
                            ),
                          ],
                        ),
                      );

                      if (confirm == true) {
                        await ref.read(firestoreServiceProvider).deleteMaintenanceBill(
                              societyId,
                              bill.id,
                            );
                      }
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
