import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/helper_model.dart';
import '../../domain/models/helper_salary_record.dart';
import '../../domain/repositories/helper_repository.dart';
import 'helper_timesheet_state.dart';

class HelperTimesheetController extends StateNotifier<HelperTimesheetState> {
  final HelperRepository _repository;
  final String _societyId;
  final HelperModel _helper;

  HelperTimesheetController({
    required HelperRepository repository,
    required String societyId,
    required HelperModel helper,
  })  : _repository = repository,
        _societyId = societyId,
        _helper = helper,
        super(HelperTimesheetState(
          selectedYear: DateTime.now().year,
          selectedMonth: DateTime.now().month,
          baseSalary: helper.monthlySalary ?? 3500.0,
          calculationType: helper.salaryCalculationType,
        )) {
    loadMonthlyData();
  }

  String get yearMonthKey {
    final m = state.selectedMonth.toString().padLeft(2, '0');
    return '${state.selectedYear}-$m';
  }

  Future<void> loadMonthlyData() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final days = await _repository.getMonthlyAttendance(
        _societyId,
        _helper.id,
        state.selectedYear,
        state.selectedMonth,
      );

      final record = await _repository.getSalaryRecord(
        _societyId,
        _helper.id,
        yearMonthKey,
      );

      state = state.copyWith(
        isLoading: false,
        attendanceDays: days,
        salaryRecord: record,
        baseSalary: record?.baseSalary ?? state.baseSalary,
        advanceDeduction: record?.advanceDeduction ?? state.advanceDeduction,
        bonus: record?.bonus ?? state.bonus,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to load timesheet: $e',
      );
    }
  }

  void changeMonth(int delta) {
    var newMonth = state.selectedMonth + delta;
    var newYear = state.selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    state = state.copyWith(
      selectedYear: newYear,
      selectedMonth: newMonth,
      advanceDeduction: 0.0,
      bonus: 0.0,
    );

    loadMonthlyData();
  }

  void updateSalaryInputs({
    double? baseSalary,
    double? advanceDeduction,
    double? bonus,
    String? calculationType,
  }) {
    state = state.copyWith(
      baseSalary: baseSalary ?? state.baseSalary,
      advanceDeduction: advanceDeduction ?? state.advanceDeduction,
      bonus: bonus ?? state.bonus,
      calculationType: calculationType ?? state.calculationType,
    );
  }

  Future<bool> recordPayment({
    required String paymentMode,
    String notes = '',
  }) async {
    state = state.copyWith(isSavingPayment: true);

    try {
      final record = HelperSalaryRecord(
        id: 'salary_$yearMonthKey',
        helperId: _helper.id,
        yearMonth: yearMonthKey,
        baseSalary: state.baseSalary,
        totalDaysInMonth: state.totalDaysCount,
        presentDays: state.presentDaysCount,
        absentDays: state.absentDaysCount,
        advanceDeduction: state.advanceDeduction,
        bonus: state.bonus,
        netPayable: state.netPayable,
        status: 'PAID',
        paidAt: DateTime.now().toIso8601String(),
        paymentMode: paymentMode,
        notes: notes,
      );

      await _repository.saveSalaryRecord(_societyId, _helper.id, record);

      // Also persist base salary & calculation type preference on helper document
      await _repository.updateHelperSalaryConfig(
        _societyId,
        _helper.id,
        state.baseSalary,
        state.calculationType,
      );

      state = state.copyWith(
        isSavingPayment: false,
        salaryRecord: record,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isSavingPayment: false,
        errorMessage: 'Failed to record payment: $e',
      );
      return false;
    }
  }
}
