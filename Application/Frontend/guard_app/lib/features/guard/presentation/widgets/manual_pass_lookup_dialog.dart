import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class ManualPassLookupDialog extends StatefulWidget {
  final ValueChanged<String> onLookup;

  const ManualPassLookupDialog({super.key, required this.onLookup});

  static void show(BuildContext context,
      {required ValueChanged<String> onLookup}) {
    showDialog(
      context: context,
      builder: (ctx) => ManualPassLookupDialog(onLookup: onLookup),
    );
  }

  @override
  State<ManualPassLookupDialog> createState() => _ManualPassLookupDialogState();
}

class _ManualPassLookupDialogState extends State<ManualPassLookupDialog> {
  final _manualCodeController = TextEditingController();

  @override
  void dispose() {
    _manualCodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.xl)),
      title: const Text('Manual Pass Lookup',
          style: TextStyle(fontWeight: FontWeight.w700)),
      content: TextField(
        controller: _manualCodeController,
        autofocus: true,
        decoration: InputDecoration(
          hintText: 'Enter Pass Code or Doc ID',
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.lg)),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            final code = _manualCodeController.text.trim();
            if (code.isNotEmpty) {
              Navigator.pop(context);
              widget.onLookup(code);
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.secondary,
            foregroundColor: Colors.white,
          ),
          child: const Text('Lookup Pass'),
        ),
      ],
    );
  }
}
