class HelperSalaryRecord {
  final String id;
  final String helperId;
  final String yearMonth; // Format: 'YYYY-MM', e.g. '2026-08'
  final double baseSalary;
  final int totalDaysInMonth;
  final int presentDays;
  final int absentDays;
  final double advanceDeduction;
  final double bonus;
  final double netPayable;
  final String status; // 'PENDING' | 'PAID'
  final String? paidAt;
  final String paymentMode; // 'Cash', 'UPI / GPay', 'Bank Transfer'
  final String notes;

  const HelperSalaryRecord({
    required this.id,
    required this.helperId,
    required this.yearMonth,
    required this.baseSalary,
    required this.totalDaysInMonth,
    required this.presentDays,
    required this.absentDays,
    this.advanceDeduction = 0.0,
    this.bonus = 0.0,
    required this.netPayable,
    this.status = 'PENDING',
    this.paidAt,
    this.paymentMode = 'Cash',
    this.notes = '',
  });

  bool get isPaid => status.toUpperCase() == 'PAID';

  factory HelperSalaryRecord.fromMap(Map<String, dynamic> map, {String? defaultId}) {
    return HelperSalaryRecord(
      id: map['id'] as String? ?? defaultId ?? '',
      helperId: map['helperId'] as String? ?? '',
      yearMonth: map['yearMonth'] as String? ?? '',
      baseSalary: (map['baseSalary'] as num?)?.toDouble() ?? 3500.0,
      totalDaysInMonth: map['totalDaysInMonth'] as int? ?? 30,
      presentDays: map['presentDays'] as int? ?? 0,
      absentDays: map['absentDays'] as int? ?? 0,
      advanceDeduction: (map['advanceDeduction'] as num?)?.toDouble() ?? 0.0,
      bonus: (map['bonus'] as num?)?.toDouble() ?? 0.0,
      netPayable: (map['netPayable'] as num?)?.toDouble() ?? 0.0,
      status: map['status'] as String? ?? 'PENDING',
      paidAt: map['paidAt'] as String?,
      paymentMode: map['paymentMode'] as String? ?? 'Cash',
      notes: map['notes'] as String? ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'helperId': helperId,
      'yearMonth': yearMonth,
      'baseSalary': baseSalary,
      'totalDaysInMonth': totalDaysInMonth,
      'presentDays': presentDays,
      'absentDays': absentDays,
      'advanceDeduction': advanceDeduction,
      'bonus': bonus,
      'netPayable': netPayable,
      'status': status,
      'paidAt': paidAt,
      'paymentMode': paymentMode,
      'notes': notes,
      'updatedAt': DateTime.now().toIso8601String(),
    };
  }

  HelperSalaryRecord copyWith({
    String? id,
    String? helperId,
    String? yearMonth,
    double? baseSalary,
    int? totalDaysInMonth,
    int? presentDays,
    int? absentDays,
    double? advanceDeduction,
    double? bonus,
    double? netPayable,
    String? status,
    String? paidAt,
    String? paymentMode,
    String? notes,
  }) {
    return HelperSalaryRecord(
      id: id ?? this.id,
      helperId: helperId ?? this.helperId,
      yearMonth: yearMonth ?? this.yearMonth,
      baseSalary: baseSalary ?? this.baseSalary,
      totalDaysInMonth: totalDaysInMonth ?? this.totalDaysInMonth,
      presentDays: presentDays ?? this.presentDays,
      absentDays: absentDays ?? this.absentDays,
      advanceDeduction: advanceDeduction ?? this.advanceDeduction,
      bonus: bonus ?? this.bonus,
      netPayable: netPayable ?? this.netPayable,
      status: status ?? this.status,
      paidAt: paidAt ?? this.paidAt,
      paymentMode: paymentMode ?? this.paymentMode,
      notes: notes ?? this.notes,
    );
  }
}
