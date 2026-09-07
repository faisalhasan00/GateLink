import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/models/resident_model.dart';
import '../../../../core/providers/admin_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import 'billing_fee_breakdown_card.dart';
import 'billing_resident_dropdown.dart';
import 'billing_scope_selector.dart';

class GenerateBillBottomSheet extends ConsumerStatefulWidget {
  final String societyId;
  final List<ResidentModel> residents;

  const GenerateBillBottomSheet({
    super.key,
    required this.societyId,
    required this.residents,
  });

  static void show(
    BuildContext context, {
    required String societyId,
    required List<ResidentModel> residents,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => GenerateBillBottomSheet(
        societyId: societyId,
        residents: residents,
      ),
    );
  }

  @override
  ConsumerState<GenerateBillBottomSheet> createState() =>
      _GenerateBillBottomSheetState();
}

class _GenerateBillBottomSheetState
    extends ConsumerState<GenerateBillBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController(
      text: 'Monthly Maintenance & Society Facilities');
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
    if (_scope == 'single' &&
        (_selectedResidentId == null || _selectedResidentId!.isEmpty)) {
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
        final activeResidents = widget.residents
            .where((r) =>
                r.isResident &&
                r.flatNo.trim().isNotEmpty &&
                r.status != 'rejected')
            .toList();

        if (activeResidents.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content:
                  Text('No active residents with flats found to invoice.'),
              backgroundColor: AppColors.dangerCrimson,
            ),
          );
          return;
        }

        for (final res in activeResidents) {
          final invoiceNo =
              'INV/2026-27/${1000 + DateTime.now().millisecondsSinceEpoch % 9000}';
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
        final res =
            widget.residents.firstWhere((r) => r.id == _selectedResidentId);
        final invoiceNo =
            'INV/2026-27/${1000 + DateTime.now().millisecondsSinceEpoch % 9000}';
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
            content: Text(_scope == 'all'
                ? 'Invoices generated for all flats!'
                : 'Maintenance bill generated successfully!'),
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
              BillingScopeSelector(
                scope: _scope,
                onScopeChanged: (val) => setState(() => _scope = val),
              ),
              const SizedBox(height: 14),
              if (_scope == 'single') ...[
                BillingResidentDropdown(
                  residents: widget.residents,
                  selectedResidentId: _selectedResidentId,
                  onResidentSelected: (val) =>
                      setState(() => _selectedResidentId = val),
                ),
                const SizedBox(height: 14),
              ],
              AppTextField(
                controller: _titleController,
                label: 'Invoice Title *',
                hintText: 'e.g. Monthly Maintenance',
                validator: (v) =>
                    v == null || v.isEmpty ? 'Title required' : null,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: AppTextField(
                      controller: _monthController,
                      label: 'Billing Month *',
                      hintText: 'e.g. September 2026',
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Month required' : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppTextField(
                      controller: _dueDateController,
                      label: 'Due Date *',
                      hintText: 'YYYY-MM-DD',
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Due date required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              BillingFeeBreakdownCard(
                baseChargeController: _baseChargeController,
                parkingChargeController: _parkingChargeController,
                waterChargeController: _waterChargeController,
                sinkingFundController: _sinkingFundController,
                totalAmount: _totalAmount,
                onChanged: () => setState(() {}),
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
                      label: _scope == 'all'
                          ? 'Issue to All Flats'
                          : 'Issue Invoice',
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
