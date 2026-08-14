import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class PermissionDashboardScreen extends StatefulWidget {
  const PermissionDashboardScreen({super.key});

  @override
  State<PermissionDashboardScreen> createState() =>
      _PermissionDashboardScreenState();
}

class _PermissionDashboardScreenState extends State<PermissionDashboardScreen> {
  Map<Permission, PermissionStatus> _statuses = {};
  bool _loading = true;

  final List<Map<String, dynamic>> _permissionsList = [
    {
      'permission': Permission.camera,
      'title': 'Camera Access',
      'subtitle':
          'Required for gate QR code scanning, visitor photo capture & document uploads.',
      'icon': Icons.camera_alt_rounded,
    },
    {
      'permission': Permission.location,
      'title': 'Location Services',
      'subtitle': 'Required for Emergency SOS incident location broadcasting.',
      'icon': Icons.location_on_rounded,
    },
    {
      'permission': Permission.photos,
      'title': 'Photos & Gallery',
      'subtitle':
          'Required for uploading profile photos, complaint proofs & maintenance receipts.',
      'icon': Icons.photo_library_rounded,
    },
    {
      'permission': Permission.notification,
      'title': 'Push Notifications',
      'subtitle':
          'Required for immediate gate visitor arrival alerts, SOS alerts & notice updates.',
      'icon': Icons.notifications_active_rounded,
    },
    {
      'permission': Permission.contacts,
      'title': 'Contacts Access',
      'subtitle':
          'Optional. Used for inviting family members or resident emergency contacts.',
      'icon': Icons.contacts_rounded,
    },
  ];

  @override
  void initState() {
    super.initState();
    _checkPermissions();
  }

  Future<void> _checkPermissions() async {
    final Map<Permission, PermissionStatus> results = {};
    for (final item in _permissionsList) {
      final perm = item['permission'] as Permission;
      results[perm] = await perm.status;
    }
    if (mounted) {
      setState(() {
        _statuses = results;
        _loading = false;
      });
    }
  }

  Future<void> _requestPermission(Permission permission) async {
    final status = await permission.request();
    if (status.isPermanentlyDenied) {
      openAppSettings();
    }
    _checkPermissions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('App Permissions Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_rounded),
            onPressed: () => openAppSettings(),
            tooltip: 'Open System Settings',
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.separated(
              padding: const EdgeInsets.all(AppSpacing.pagePadding),
              itemCount: _permissionsList.length,
              separatorBuilder: (_, __) =>
                  const SizedBox(height: AppSpacing.md),
              itemBuilder: (context, index) {
                final item = _permissionsList[index];
                final perm = item['permission'] as Permission;
                final status = _statuses[perm] ?? PermissionStatus.denied;

                final isGranted = status.isGranted;
                final isPermanentlyDenied = status.isPermanentlyDenied;

                return Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.xl),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 42,
                            height: 42,
                            decoration: BoxDecoration(
                              color: isGranted
                                  ? AppColors.success.withValues(alpha: 0.15)
                                  : AppColors.gray100,
                              borderRadius: BorderRadius.circular(AppRadius.md),
                            ),
                            child: Icon(
                              item['icon'] as IconData,
                              color: isGranted
                                  ? AppColors.success
                                  : AppColors.textSecondary,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item['title'] as String,
                                    style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold)),
                                Text(
                                  isGranted
                                      ? 'GRANTED'
                                      : isPermanentlyDenied
                                          ? 'PERMANENTLY DENIED'
                                          : 'DENIED',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                    color: isGranted
                                        ? AppColors.success
                                        : isPermanentlyDenied
                                            ? AppColors.error
                                            : AppColors.warning,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          ElevatedButton(
                            onPressed: () => isPermanentlyDenied
                                ? openAppSettings()
                                : _requestPermission(perm),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isGranted
                                  ? AppColors.gray100
                                  : AppColors.primary,
                              foregroundColor: isGranted
                                  ? AppColors.textSecondary
                                  : Colors.white,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 8),
                            ),
                            child: Text(isGranted
                                ? 'Granted'
                                : isPermanentlyDenied
                                    ? 'Settings'
                                    : 'Grant'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(item['subtitle'] as String,
                          style: const TextStyle(
                              fontSize: 12, color: AppColors.textSecondary)),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
