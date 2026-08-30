import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/helper_attendance_day.dart';
import '../../domain/models/helper_model.dart';
import '../../providers/helper_providers.dart';

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
    final monthName = DateFormat('MMMM yyyy')
        .format(DateTime(state.selectedYear, state.selectedMonth));

    final buffer = StringBuffer();
    buffer.writeln('📋 *GATELINK STAFF SALARY & ATTENDANCE STATEMENT*');
    buffer.writeln('🏢 Society: ${widget.societyName}');
    buffer.writeln('🗓️ Month: $monthName');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━');
    buffer.writeln('👤 *Staff Name:* ${widget.helper.name}');
    buffer.writeln('🏷️ *Role:* ${widget.helper.type}');
    buffer.writeln('🏠 *Flat:* ${widget.helper.flatNumber}');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━');
    buffer.writeln('📊 *ATTENDANCE SUMMARY:*');
    buffer.writeln('• Total Days: ${state.totalDaysCount}');
    buffer.writeln('• Present: ${state.presentDaysCount} Days 🟢');
    buffer.writeln('• Absent: ${state.absentDaysCount} Days 🔴');
    buffer.writeln('• Total Hours: ${state.totalHoursWorked.toStringAsFixed(1)} hrs ⏱️');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━');
    buffer.writeln('💰 *SALARY BREAKDOWN:*');
    buffer.writeln('• Base Monthly Salary: ₹${state.baseSalary.toStringAsFixed(0)}');
    if (state.advanceDeduction > 0) {
      buffer.writeln('• Advance Deduction: - ₹${state.advanceDeduction.toStringAsFixed(0)}');
    }
    if (state.bonus > 0) {
      buffer.writeln('• Bonus / Overtime: + ₹${state.bonus.toStringAsFixed(0)}');
    }
    buffer.writeln('• *Net Payable:* *₹${state.netPayable.toStringAsFixed(0)}*');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━');
    if (state.salaryRecord?.isPaid == true) {
      buffer.writeln('✅ *STATUS: PAID* (Mode: ${state.salaryRecord?.paymentMode})');
      if (state.salaryRecord?.paidAt != null) {
        buffer.writeln('📅 Paid On: ${DateFormat('dd MMM yyyy, hh:mm a').format(DateTime.parse(state.salaryRecord!.paidAt!))}');
      }
    } else {
      buffer.writeln('⏳ *STATUS: PENDING PAYMENT*');
    }
    buffer.writeln('\n_Generated via GateLink Society App_');

    Share.share(buffer.toString(),
        subject: '${widget.helper.name} - $monthName Salary Statement');
  }

  void _showRecordPaymentModal(BuildContext context, dynamic state) {
    String selectedMode = 'UPI / GPay';
    final notesController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE0F2FE),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.payments_rounded,
                        color: Color(0xFF0EA5E9), size: 24),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Record Salary Payment',
                        style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1E293B)),
                      ),
                      Text(
                        'For ${widget.helper.name} (₹${state.netPayable.toStringAsFixed(0)})',
                        style: TextStyle(
                            fontSize: 13, color: Colors.grey.shade600),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Text(
                'Payment Method',
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF475569)),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 10,
                children: ['UPI / GPay', 'Cash', 'Bank Transfer', 'Paytm']
                    .map((mode) {
                  final isSelected = selectedMode == mode;
                  return ChoiceChip(
                    label: Text(mode),
                    selected: isSelected,
                    onSelected: (val) {
                      if (val) setModalState(() => selectedMode = mode);
                    },
                    selectedColor: const Color(0xFF1E3A8A),
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : const Color(0xFF334155),
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                    backgroundColor: const Color(0xFFF1F5F9),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                      side: BorderSide(
                        color: isSelected
                            ? const Color(0xFF1E3A8A)
                            : Colors.transparent,
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              const Text(
                'Payment Notes (Optional)',
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF475569)),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: notesController,
                decoration: InputDecoration(
                  hintText: 'e.g. Paid in full via Google Pay',
                  hintStyle:
                      TextStyle(color: Colors.grey.shade400, fontSize: 13),
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  onPressed: state.isSavingPayment
                      ? null
                      : () async {
                          Navigator.pop(ctx);
                          final success = await ref
                              .read(helperTimesheetProvider(widget.helper)
                                  .notifier)
                              .recordPayment(
                                paymentMode: selectedMode,
                                notes: notesController.text.trim(),
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
                  child: state.isSavingPayment
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                              color: Colors.white, strokeWidth: 2),
                        )
                      : const Text(
                          'Confirm & Mark as Paid',
                          style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.white),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDayDetailsDialog(BuildContext context, HelperAttendanceDay day) {
    final dateFormatted = DateFormat('EEEE, dd MMMM yyyy').format(day.date);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: day.isPresent
                    ? const Color(0xFFDCFCE7)
                    : const Color(0xFFFEE2E2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                day.isPresent ? Icons.check_circle_rounded : Icons.cancel_rounded,
                color: day.isPresent
                    ? const Color(0xFF16A34A)
                    : const Color(0xFFDC2626),
                size: 22,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                day.isPresent ? 'Present on Campus' : 'Absent',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: day.isPresent
                      ? const Color(0xFF16A34A)
                      : const Color(0xFFDC2626),
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(dateFormatted,
                style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E293B))),
            const SizedBox(height: 14),
            if (day.isPresent) ...[
              _buildLogDetailRow(
                icon: Icons.login_rounded,
                iconColor: const Color(0xFF10B981),
                label: 'Entry Time',
                value: day.entryTime != null && day.entryTime!.isNotEmpty
                    ? DateFormat('hh:mm a')
                        .format(DateTime.parse(day.entryTime!))
                    : 'Recorded at Gate',
                subValue: 'Gate: ${day.entryGate ?? "Main Gate"}',
              ),
              const SizedBox(height: 10),
              _buildLogDetailRow(
                icon: Icons.logout_rounded,
                iconColor: const Color(0xFFEF4444),
                label: 'Exit Time',
                value: day.exitTime != null && day.exitTime!.isNotEmpty
                    ? DateFormat('hh:mm a')
                        .format(DateTime.parse(day.exitTime!))
                    : 'Active / Not Exited',
                subValue: day.exitGate != null ? 'Gate: ${day.exitGate}' : '',
              ),
              const SizedBox(height: 10),
              _buildLogDetailRow(
                icon: Icons.timer_outlined,
                iconColor: const Color(0xFF0EA5E9),
                label: 'Duration',
                value: day.formattedDuration,
                subValue: day.guardName != null ? 'Logged by ${day.guardName}' : '',
              ),
            ] else ...[
              const Text(
                'No gate entry or attendance activity logged for this date.',
                style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close',
                style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildLogDetailRow({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
    String subValue = '',
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: iconColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: iconColor, size: 16),
        ),
        const SizedBox(width: 10),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label,
                style:
                    TextStyle(fontSize: 11, color: Colors.grey.shade600)),
            Text(value,
                style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E293B))),
            if (subValue.isNotEmpty)
              Text(subValue,
                  style:
                      TextStyle(fontSize: 10, color: Colors.grey.shade500)),
          ],
        ),
      ],
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
                  // Month Selector Banner
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.chevron_left_rounded,
                              size: 28, color: Color(0xFF1E3A8A)),
                          onPressed: () => controller.changeMonth(-1),
                        ),
                        Row(
                          children: [
                            const Icon(Icons.calendar_month_rounded,
                                color: Color(0xFF0EA5E9), size: 20),
                            const SizedBox(width: 8),
                            Text(
                              monthLabel,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1E293B),
                              ),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.chevron_right_rounded,
                              size: 28, color: Color(0xFF1E3A8A)),
                          onPressed: () => controller.changeMonth(1),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // 4 Summary Metric KPI Cards
                  Row(
                    children: [
                      Expanded(
                        child: _buildMetricCard(
                          title: 'Present',
                          value: '${state.presentDaysCount} Days',
                          color: const Color(0xFF10B981),
                          bgColor: const Color(0xFFDCFCE7),
                          icon: Icons.check_circle_rounded,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _buildMetricCard(
                          title: 'Absent',
                          value: '${state.absentDaysCount} Days',
                          color: const Color(0xFFEF4444),
                          bgColor: const Color(0xFFFEE2E2),
                          icon: Icons.cancel_rounded,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _buildMetricCard(
                          title: 'Duty Hours',
                          value: '${state.totalHoursWorked.toStringAsFixed(1)} hrs',
                          color: const Color(0xFF0EA5E9),
                          bgColor: const Color(0xFFE0F2FE),
                          icon: Icons.access_time_filled_rounded,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _buildMetricCard(
                          title: 'Net Payable',
                          value: '₹${state.netPayable.toStringAsFixed(0)}',
                          color: const Color(0xFF1E3A8A),
                          bgColor: const Color(0xFFEFF6FF),
                          icon: Icons.account_balance_wallet_rounded,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Attendance Calendar Card
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Monthly Attendance Calendar',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1E293B),
                              ),
                            ),
                            Row(
                              children: [
                                _buildLegendDot(
                                    const Color(0xFF10B981), 'Present'),
                                const SizedBox(width: 10),
                                _buildLegendDot(
                                    const Color(0xFFEF4444), 'Absent'),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        _buildCalendarGrid(context, state.attendanceDays),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Salary & Payroll Calculation Card
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: state.salaryRecord?.isPaid == true
                            ? const Color(0xFF10B981)
                            : Colors.transparent,
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: const [
                                Icon(Icons.calculate_rounded,
                                    color: Color(0xFF1E3A8A), size: 20),
                                SizedBox(width: 8),
                                Text(
                                  'Salary & Payout Calculator',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF1E293B),
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: state.salaryRecord?.isPaid == true
                                    ? const Color(0xFFDCFCE7)
                                    : const Color(0xFFFEF3C7),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                state.salaryRecord?.isPaid == true
                                    ? 'PAID 🟢'
                                    : 'PENDING 🟡',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: state.salaryRecord?.isPaid == true
                                      ? const Color(0xFF16A34A)
                                      : const Color(0xFFD97706),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Monthly Base Salary Input
                        Row(
                          children: [
                            Expanded(
                              flex: 3,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Monthly Base Wage (₹)',
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF475569))),
                                  const SizedBox(height: 6),
                                  TextField(
                                    controller: _baseSalaryController,
                                    keyboardType: TextInputType.number,
                                    onChanged: (_) => _onSalaryChanged(),
                                    decoration: InputDecoration(
                                      prefixText: '₹ ',
                                      contentPadding:
                                          const EdgeInsets.symmetric(
                                              horizontal: 12, vertical: 10),
                                      filled: true,
                                      fillColor: const Color(0xFFF8FAFC),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(10),
                                        borderSide: BorderSide(
                                            color: Colors.grey.shade300),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              flex: 2,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Advance (₹)',
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF475569))),
                                  const SizedBox(height: 6),
                                  TextField(
                                    controller: _advanceController,
                                    keyboardType: TextInputType.number,
                                    onChanged: (_) => _onSalaryChanged(),
                                    decoration: InputDecoration(
                                      prefixText: '- ₹ ',
                                      contentPadding:
                                          const EdgeInsets.symmetric(
                                              horizontal: 12, vertical: 10),
                                      filled: true,
                                      fillColor: const Color(0xFFF8FAFC),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(10),
                                        borderSide: BorderSide(
                                            color: Colors.grey.shade300),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 16),
                        const Divider(),
                        const SizedBox(height: 10),

                        // Net Payable Summary
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Net Salary Payable',
                                  style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF64748B)),
                                ),
                                Text(
                                  '₹${state.netPayable.toStringAsFixed(0)}',
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF1E3A8A),
                                  ),
                                ),
                              ],
                            ),
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    state.salaryRecord?.isPaid == true
                                        ? const Color(0xFF0EA5E9)
                                        : const Color(0xFF10B981),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 12),
                                elevation: 0,
                              ),
                              onPressed: () =>
                                  _showRecordPaymentModal(context, state),
                              icon: Icon(
                                state.salaryRecord?.isPaid == true
                                    ? Icons.edit_rounded
                                    : Icons.check_circle_outline_rounded,
                                color: Colors.white,
                                size: 18,
                              ),
                              label: Text(
                                state.salaryRecord?.isPaid == true
                                    ? 'Update Payment'
                                    : 'Record Payment',
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required Color color,
    required Color bgColor,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style:
                        TextStyle(fontSize: 11, color: Colors.grey.shade700)),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: color,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendDot(Color color, String text) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(text,
            style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
      ],
    );
  }

  Widget _buildCalendarGrid(
      BuildContext context, List<HelperAttendanceDay> days) {
    if (days.isEmpty) {
      return const Center(child: Text('No attendance days to display'));
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: days.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 7,
        crossAxisSpacing: 6,
        mainAxisSpacing: 6,
        childAspectRatio: 1.0,
      ),
      itemBuilder: (ctx, idx) {
        final day = days[idx];
        final isPresent = day.isPresent;
        final dayNumber = day.date.day;

        return InkWell(
          onTap: () => _showDayDetailsDialog(context, day),
          borderRadius: BorderRadius.circular(8),
          child: Container(
            decoration: BoxDecoration(
              color: isPresent
                  ? const Color(0xFFDCFCE7)
                  : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isPresent
                    ? const Color(0xFF86EFAC)
                    : Colors.grey.shade200,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '$dayNumber',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: isPresent
                        ? const Color(0xFF16A34A)
                        : const Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: 2),
                Icon(
                  isPresent
                      ? Icons.check_circle_rounded
                      : Icons.circle_outlined,
                  size: 12,
                  color: isPresent
                      ? const Color(0xFF16A34A)
                      : Colors.grey.shade400,
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
