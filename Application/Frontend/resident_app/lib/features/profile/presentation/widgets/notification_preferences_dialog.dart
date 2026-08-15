import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/models/user_profile_model.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class NotificationPreferencesDialog extends ConsumerStatefulWidget {
  final UserProfileModel? profile;

  const NotificationPreferencesDialog({super.key, required this.profile});

  static void show(BuildContext context, {required UserProfileModel? profile}) {
    showDialog(
      context: context,
      builder: (_) => NotificationPreferencesDialog(profile: profile),
    );
  }

  @override
  ConsumerState<NotificationPreferencesDialog> createState() =>
      _NotificationPreferencesDialogState();
}

class _NotificationPreferencesDialogState
    extends ConsumerState<NotificationPreferencesDialog> {
  late bool _gatePassAlerts;
  late bool _maintenanceReminders;
  late bool _societyNotices;
  late bool _emergencyAlerts;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final prefs = widget.profile?.notificationPreferences ?? {};
    _gatePassAlerts = prefs['gatePassAlerts'] ?? true;
    _maintenanceReminders = prefs['maintenanceReminders'] ?? true;
    _societyNotices = prefs['societyNotices'] ?? true;
    _emergencyAlerts = prefs['emergencyAlerts'] ?? true;
  }

  Future<void> _save() async {
    setState(() => _isSaving = true);
    final user = ref.read(currentUserProvider);
    final societyId = widget.profile?.societyId ?? '';
    final uid = widget.profile?.uid.isNotEmpty == true
        ? widget.profile!.uid
        : (user?.uid ?? '');

    try {
      final success = await ref
          .read(profileControllerProvider.notifier)
          .updateNotificationPreferences(
            societyId: societyId,
            uid: uid,
            preferences: {
              'gatePassAlerts': _gatePassAlerts,
              'maintenanceReminders': _maintenanceReminders,
              'societyNotices': _societyNotices,
              'emergencyAlerts': _emergencyAlerts,
            },
          );
      if (mounted) {
        Navigator.pop(context);
        ref.invalidate(userProfileProvider);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(success
                ? 'Notification preferences saved successfully'
                : 'Could not save preferences'),
            backgroundColor:
                success ? AppColors.success : AppColors.error,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save: $e'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.xl),
      ),
      title: const Row(
        children: [
          Icon(Icons.notifications_active_outlined, color: AppColors.primary),
          SizedBox(width: 8),
          Text(
            'Notifications',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
          ),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SwitchListTile(
              title: const Text('Gate & Visitor Alerts',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Entry approvals and deliveries',
                  style: TextStyle(fontSize: 12)),
              value: _gatePassAlerts,
              activeThumbColor: AppColors.primary,
              onChanged: (v) => setState(() => _gatePassAlerts = v),
            ),
            SwitchListTile(
              title: const Text('Maintenance Reminders',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('Bill generation and due date alerts',
                  style: TextStyle(fontSize: 12)),
              value: _maintenanceReminders,
              activeThumbColor: AppColors.primary,
              onChanged: (v) => setState(() => _maintenanceReminders = v),
            ),
            SwitchListTile(
              title: const Text('Society Notices',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('RWA announcements and events',
                  style: TextStyle(fontSize: 12)),
              value: _societyNotices,
              activeThumbColor: AppColors.primary,
              onChanged: (v) => setState(() => _societyNotices = v),
            ),
            SwitchListTile(
              title: const Text('Emergency SOS Alerts',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('High priority community safety alerts',
                  style: TextStyle(fontSize: 12)),
              value: _emergencyAlerts,
              activeThumbColor: AppColors.error,
              onChanged: (v) => setState(() => _emergencyAlerts = v),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _isSaving ? null : _save,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
          ),
          child: _isSaving
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                )
              : const Text('Save'),
        ),
      ],
    );
  }
}
