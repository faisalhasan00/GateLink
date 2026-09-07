import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';
import '../models/helper_model.dart';
import '../../presentation/controllers/helper_timesheet_state.dart';

class HelperStatementService {
  static void shareSalaryStatement({
    required HelperModel helper,
    required String societyName,
    required HelperTimesheetState state,
  }) {
    final monthName = DateFormat('MMMM yyyy')
        .format(DateTime(state.selectedYear, state.selectedMonth));

    final buffer = StringBuffer();
    buffer.writeln('📋 *GATELINK STAFF SALARY & ATTENDANCE STATEMENT*');
    buffer.writeln('🏢 Society: $societyName');
    buffer.writeln('🗓️ Month: $monthName');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━');
    buffer.writeln('👤 *Staff Name:* ${helper.name}');
    buffer.writeln('🏷️ *Role:* ${helper.type}');
    buffer.writeln('🏠 *Flat:* ${helper.flatNumber}');
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

    Share.share(
      buffer.toString(),
      subject: '${helper.name} - $monthName Salary Statement',
    );
  }
}
