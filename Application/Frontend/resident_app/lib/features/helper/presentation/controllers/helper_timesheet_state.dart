import '../../domain/models/helper_attendance_day.dart';
import '../../domain/models/helper_salary_record.dart';

class HelperTimesheetState {
  final bool isLoading;
  final String? errorMessage;
  final int selectedYear;
  final int selectedMonth;
  final List<HelperAttendanceDay> attendanceDays;
  final HelperSalaryRecord? salaryRecord;
  final double baseSalary;
  final double advanceDeduction;
  final double bonus;
  final String calculationType; // 'pro_rata' | 'fixed_with_deductions'
  final bool isSavingPayment;

  const HelperTimesheetState({
    this.isLoading = false,
    this.errorMessage,
    required this.selectedYear,
    required this.selectedMonth,
    this.attendanceDays = const [],
    this.salaryRecord,
    this.baseSalary = 3500.0,
    this.advanceDeduction = 0.0,
    this.bonus = 0.0,
    this.calculationType = 'pro_rata',
    this.isSavingPayment = false,
  });

  int get presentDaysCount => attendanceDays.where((d) => d.isPresent).length;
  int get absentDaysCount => attendanceDays.where((d) => !d.isPresent).length;
  int get totalDaysCount => attendanceDays.length;

  double get netPayable {
    if (totalDaysCount == 0) return 0.0;
    double calculatedBase = 0.0;

    if (calculationType == 'pro_rata') {
      calculatedBase = (baseSalary / totalDaysCount) * presentDaysCount;
    } else {
      // Fixed with deductions
      final perDayRate = baseSalary / totalDaysCount;
      calculatedBase = baseSalary - (perDayRate * absentDaysCount);
    }

    if (calculatedBase < 0) calculatedBase = 0.0;
    final total = calculatedBase - advanceDeduction + bonus;
    return total > 0 ? total : 0.0;
  }

  double get totalHoursWorked {
    int totalMins = 0;
    for (final day in attendanceDays) {
      if (day.duration != null) {
        totalMins += day.duration!.inMinutes;
      }
    }
    return totalMins / 60.0;
  }

  HelperTimesheetState copyWith({
    bool? isLoading,
    String? errorMessage,
    int? selectedYear,
    int? selectedMonth,
    List<HelperAttendanceDay>? attendanceDays,
    HelperSalaryRecord? salaryRecord,
    double? baseSalary,
    double? advanceDeduction,
    double? bonus,
    String? calculationType,
    bool? isSavingPayment,
  }) {
    return HelperTimesheetState(
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      selectedYear: selectedYear ?? this.selectedYear,
      selectedMonth: selectedMonth ?? this.selectedMonth,
      attendanceDays: attendanceDays ?? this.attendanceDays,
      salaryRecord: salaryRecord ?? this.salaryRecord,
      baseSalary: baseSalary ?? this.baseSalary,
      advanceDeduction: advanceDeduction ?? this.advanceDeduction,
      bonus: bonus ?? this.bonus,
      calculationType: calculationType ?? this.calculationType,
      isSavingPayment: isSavingPayment ?? this.isSavingPayment,
    );
  }
}
