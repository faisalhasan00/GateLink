import 'package:flutter/material.dart';

class BillingScopeSelector extends StatelessWidget {
  final String scope;
  final ValueChanged<String> onScopeChanged;

  const BillingScopeSelector({
    super.key,
    required this.scope,
    required this.onScopeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Target Scope',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
        const SizedBox(height: 8),
        SegmentedButton<String>(
          segments: const [
            ButtonSegment(
              value: 'single',
              label: Text('Single Flat'),
              icon: Icon(Icons.person_outline, size: 16),
            ),
            ButtonSegment(
              value: 'all',
              label: Text('All Registered Flats'),
              icon: Icon(Icons.apartment_outlined, size: 16),
            ),
          ],
          selected: {scope},
          onSelectionChanged: (newSelection) {
            onScopeChanged(newSelection.first);
          },
        ),
      ],
    );
  }
}
