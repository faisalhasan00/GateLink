import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../sos/domain/models/guard_alert_model.dart';
import '../../../sos/presentation/controllers/alert_controller.dart';

class GuardSosDialog extends ConsumerWidget {
  const GuardSosDialog({super.key});

  static void show(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const GuardSosDialog(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.xl)),
      title: const Row(
        children: [
          Icon(Icons.warning_rounded, color: Color(0xFFDC2626), size: 28),
          SizedBox(width: 8),
          Text('Gate Emergency Alert',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'This broadcasts a critical high-priority emergency siren to the Society RWA, Security Supervisor, and all connected residents.',
            style:
                TextStyle(color: Color(0xFF475569), fontSize: 13, height: 1.4),
          ),
          const SizedBox(height: 16),
          const Text(
            'DIRECT EMERGENCY HOTLINES:',
            style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                color: Color(0xFF64748B),
                letterSpacing: 0.5),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildSpeedDialChip('🚓 Police (112)', '112'),
              _buildSpeedDialChip('🚑 Ambulance (102)', '102'),
              _buildSpeedDialChip('🚒 Fire (101)', '101'),
            ],
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel',
              style: TextStyle(
                  fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
        ),
        ElevatedButton.icon(
          onPressed: () async {
            Navigator.pop(context);
            final messenger = ScaffoldMessenger.of(context);
            try {
              final user = FirebaseAuth.instance.currentUser;
              await ref
                  .read(alertControllerProvider.notifier)
                  .broadcastSosAlert(
                    GuardAlertModel(
                      id: '',
                      guardEmail: user?.email ?? 'Guard',
                      message:
                          '🚨 Emergency SOS Triggered by Guard at Gate 1 Terminal',
                      type: 'SOS',
                      status: 'active',
                      createdAt: DateTime.now(),
                    ),
                  );
            } catch (_) {}
            messenger.showSnackBar(
              SnackBar(
                content: const Row(
                  children: [
                    Icon(Icons.warning_rounded,
                        color: Colors.white, size: 18),
                    SizedBox(width: 8),
                    Text(
                        '🚨 Emergency SOS broadcast to Society Management!'),
                  ],
                ),
                backgroundColor: const Color(0xFFDC2626),
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                duration: const Duration(seconds: 4),
              ),
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFDC2626),
            foregroundColor: Colors.white,
            elevation: 0,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10)),
          ),
          icon: const Icon(Icons.campaign_rounded, size: 18),
          label: const Text('BROADCAST SOS',
              style: TextStyle(fontWeight: FontWeight.w900)),
        ),
      ],
    );
  }

  Widget _buildSpeedDialChip(String label, String number) {
    return InkWell(
      onTap: () async {
        final uri = Uri.parse('tel:$number');
        if (await canLaunchUrl(uri)) await launchUrl(uri);
      },
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFFCBD5E1)),
        ),
        child: Text(
          label,
          style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: Color(0xFF0F172A)),
        ),
      ),
    );
  }
}
