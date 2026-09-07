import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';

class GuardNotificationDialog extends StatefulWidget {
  final WidgetRef ref;
  const GuardNotificationDialog({super.key, required this.ref});

  @override
  State<GuardNotificationDialog> createState() => _GuardNotificationDialogState();
}

class _GuardNotificationDialogState extends State<GuardNotificationDialog> {
  bool _visitors = true;
  bool _bills = true;
  bool _complaints = true;
  bool _amenities = true;
  bool _notices = true;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Notification Preferences', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SwitchListTile(
              title: const Text('Visitor Alerts', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Real-time gate arrival & approval alerts'),
              value: _visitors,
              onChanged: (v) => setState(() => _visitors = v),
            ),
            SwitchListTile(
              title: const Text('Billing & Maintenance', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Invoice generation & payment receipts'),
              value: _bills,
              onChanged: (v) => setState(() => _bills = v),
            ),
            SwitchListTile(
              title: const Text('Complaint Status', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Staff assignment & resolution updates'),
              value: _complaints,
              onChanged: (v) => setState(() => _complaints = v),
            ),
            SwitchListTile(
              title: const Text('Amenity Bookings', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Slot confirmation & cancellation updates'),
              value: _amenities,
              onChanged: (v) => setState(() => _amenities = v),
            ),
            SwitchListTile(
              title: const Text('Society Notices', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Emergency announcements & circulars'),
              value: _notices,
              onChanged: (v) => setState(() => _notices = v),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        ElevatedButton(
          onPressed: () async {
            final user = widget.ref.read(currentUserProvider);
            final svc = widget.ref.read(firestoreServiceProvider);
            if (user != null) {
              await svc.updateNotificationPreferences(user.uid, {
                'visitors': _visitors,
                'bills': _bills,
                'complaints': _complaints,
                'amenities': _amenities,
                'notices': _notices,
              });
              if (context.mounted) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Notification preferences saved!')),
                );
              }
            }
          },
          child: const Text('Save Settings'),
        ),
      ],
    );
  }
}
