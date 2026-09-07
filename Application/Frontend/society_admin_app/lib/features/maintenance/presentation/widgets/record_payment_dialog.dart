import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/models/maintenance_model.dart';
import '../../../../core/providers/admin_providers.dart';
import '../../../../core/theme/app_colors.dart';

class RecordPaymentDialog extends ConsumerStatefulWidget {
  final String societyId;
  final MaintenanceBillModel bill;

  const RecordPaymentDialog({
    super.key,
    required this.societyId,
    required this.bill,
  });

  static void show(
    BuildContext context, {
    required String societyId,
    required MaintenanceBillModel bill,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => RecordPaymentDialog(
        societyId: societyId,
        bill: bill,
      ),
    );
  }

  @override
  ConsumerState<RecordPaymentDialog> createState() =>
      _RecordPaymentDialogState();
}

class _RecordPaymentDialogState extends ConsumerState<RecordPaymentDialog> {
  String _selectedMode = 'cash';
  bool _isSubmitting = false;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Record Payment: Flat ${widget.bill.flatNo}'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Amount: ₹${widget.bill.amount.toStringAsFixed(0)}',
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
          ),
          const SizedBox(height: 16),
          const Text('Payment Mode:',
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            initialValue: _selectedMode,
            items: const [
              DropdownMenuItem(
                  value: 'cash', child: Text('Cash / Offline Receipt')),
              DropdownMenuItem(
                  value: 'upi', child: Text('Direct UPI / QR Transfer')),
              DropdownMenuItem(
                  value: 'cheque', child: Text('Cheque / Bank Draft')),
              DropdownMenuItem(
                  value: 'netbanking', child: Text('NEFT / IMPS Transfer')),
            ],
            onChanged: (val) {
              if (val != null) setState(() => _selectedMode = val);
            },
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: _isSubmitting ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _isSubmitting
              ? null
              : () async {
                  setState(() => _isSubmitting = true);
                  try {
                    await ref
                        .read(firestoreServiceProvider)
                        .markBillPaid(
                          widget.societyId,
                          widget.bill.id,
                          _selectedMode,
                        );
                    if (context.mounted) {
                      Navigator.of(context).pop();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                              'Payment recorded for Flat ${widget.bill.flatNo}'),
                          backgroundColor: AppColors.successEmerald,
                        ),
                      );
                    }
                  } finally {
                    if (mounted) setState(() => _isSubmitting = false);
                  }
                },
          child: _isSubmitting
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Confirm Settlement'),
        ),
      ],
    );
  }
}
