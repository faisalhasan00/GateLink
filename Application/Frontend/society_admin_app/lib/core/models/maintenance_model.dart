class MaintenanceBillModel {
  final String id;
  final String residentName;
  final String flatNo;
  final String month;
  final double amount;
  final double lateFee;
  final String status; // 'paid', 'pending', 'overdue', 'partially_paid'
  final String? paymentMode; // 'cash', 'upi', 'netbanking', 'card'
  final DateTime? dueDate;
  final DateTime? paidDate;

  MaintenanceBillModel({
    required this.id,
    required this.residentName,
    required this.flatNo,
    required this.month,
    required this.amount,
    this.lateFee = 0.0,
    this.status = 'pending',
    this.paymentMode,
    this.dueDate,
    this.paidDate,
  });

  static DateTime? parseDate(dynamic val) {
    if (val == null) return null;
    if (val is DateTime) return val;
    if (val is String) return DateTime.tryParse(val);
    try {
      return (val as dynamic).toDate();
    } catch (_) {
      return null;
    }
  }

  factory MaintenanceBillModel.fromFirestore(Map<String, dynamic> data, String id) {
    return MaintenanceBillModel(
      id: id,
      residentName: data['residentName'] ?? data['userName'] ?? data['name'] ?? 'Resident',
      flatNo: data['flatNo'] ?? data['flat_no'] ?? data['unit'] ?? data['flatNumber'] ?? '',
      month: data['month'] ?? data['billing_month'] ?? data['billingMonth'] ?? 'Current Month',
      amount: (data['amount'] ?? data['totalAmount'] ?? 0).toDouble(),
      lateFee: (data['lateFee'] ?? 0).toDouble(),
      status: (data['status'] ?? 'pending').toString().toLowerCase(),
      paymentMode: data['paymentMode'] ?? data['payment_method'] ?? data['paymentMethod'],
      dueDate: parseDate(data['dueDate'] ?? data['due_date']),
      paidDate: parseDate(data['paidDate'] ?? data['paid_at'] ?? data['paidAt']),
    );
  }
}
