import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/helper_model.dart';
import '../../domain/services/helper_statement_service.dart';
import '../../providers/helper_providers.dart';
import '../widgets/timesheet_month_selector.dart';
import '../widgets/timesheet_metric_cards.dart';
import '../widgets/timesheet_calendar_card.dart';
import '../widgets/timesheet_salary_card.dart';
import '../widgets/record_payment_modal.dart';

class HelperTimesheetScreen extends ConsumerStatefulWidget {
  final HelperModel helper;
  final String societyName;

  const HelperTimesheetScreen({
    super.key,
    required this.helper,
    this.societyName = 'GateLink Community',
  });

  @override
  ConsumerState<HelperTimesheetScreen> createState() =>
      _HelperTimesheetScreenState();
}

class _HelperTimesheetScreenState extends ConsumerState<HelperTimesheetScreen> {
  late TextEditingController _baseSalaryController;
  late TextEditingController _advanceController;
  late TextEditingController _bonusController;

  @override
  void initState() {
    super.initState();
    _baseSalaryController = TextEditingController(
        text: (widget.helper.monthlySalary ?? 3500.0).toStringAsFixed(0));
    _advanceController = TextEditingController(text: '0');
    _bonusController = TextEditingController(text: '0');
  }

  @override
  void dispose() {
    _baseSalaryController.dispose();
    _advanceController.dispose();
    _bonusController.dispose();
    super.dispose();
  }

  void _onSalaryChanged() {
    final base = double.tryParse(_baseSalaryController.text) ?? 3500.0;
    final adv = double.tryParse(_advanceController.text) ?? 0.0;
    final bonus = double.tryParse(_bonusController.text) ?? 0.0;

    ref.read(helperTimesheetProvider(widget.helper).notifier).updateSalaryInputs(
          baseSalary: base,
          advanceDeduction: adv,
          bonus: bonus,
        );
  }

  void _shareStatement(dynamic state) {
    HelperStatementService.shareSalaryStatement(
      helper: widget.helper,
      societyName: widget.societyName,
      state: state,
    );
  }

  void _showRecordPaymentModal(BuildContext context, dynamic state) {
    RecordPaymentModal.show(
      context,
      helperName: widget.helper.name,
      netPayable: state.netPayable,
      isSavingPayment: state.isSavingPayment,
      onConfirmPayment: ({required String paymentMode, required String notes}) async {
        final success = await ref
            .read(helperTimesheetProvider(widget.helper).notifier)
            .recordPayment(
              paymentMode: paymentMode,
              notes: notes,
            );

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(success
                  ? '✅ Salary payment of ₹${state.netPayable.toStringAsFixed(0)} recorded successfully!'
                  : '❌ Failed to save payment record.'),
              backgroundColor: success
                  ? const Color(0xFF10B981)
                  : const Color(0xFFEF4444),
            ),
          );
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(helperTimesheetProvider(widget.helper));
    final controller =
        ref.read(helperTimesheetProvider(widget.helper).notifier);
    final monthLabel = DateFormat('MMMM yyyy')
        .format(DateTime(state.selectedYear, state.selectedMonth));

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A8A),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${widget.helper.name} • Timesheet',
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold),
            ),
            Text(
              '${widget.helper.type} • Flat ${widget.helper.flatNumber}',
              style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.8), fontSize: 12),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded, color: Colors.white),
            tooltip: 'Share Salary Statement',
            onPressed: () => _shareStatement(state),
          ),
        ],
      ),
      body: state.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF1E3A8A)))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Month Selector Banner
                  TimesheetMonthSelector(
                    monthLabel: monthLabel,
                    onPreviousMonth: () => controller.changeMonth(-1),
                    onNextMonth: () => controller.changeMonth(1),
                  ),

                  const SizedBox(height: 16),

                  // 2. 4 Summary Metric KPI Cards
                  TimesheetMetricCards(
                    presentDays: state.presentDaysCount,
                    absentDays: state.absentDaysCount,
                    totalHours: state.totalHoursWorked,
                    netPayable: state.netPayable,
                  ),

                  const SizedBox(height: 20),

                  // 3. Attendance Calendar Card
                  TimesheetCalendarCard(
                    attendanceDays: state.attendanceDays,
                  ),

                  const SizedBox(height: 20),

                  // 4. Salary & Payroll Calculation Card
                  TimesheetSalaryCard(
                    baseSalaryController: _baseSalaryController,
                    advanceController: _advanceController,
                    netPayable: state.netPayable,
                    isPaid: state.salaryRecord?.isPaid == true,
                    onSalaryChanged: _onSalaryChanged,
                    onRecordPayment: () =>
                        _showRecordPaymentModal(context, state),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
    );
  }
}
