import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../widgets/profile_header_card.dart';
import '../widgets/residency_details_card.dart';
import '../widgets/profile_actions_menu.dart';
import '../widgets/society_support_sheet.dart';
import '../widgets/notification_preferences_dialog.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  void _showPrivacyPolicyModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.shield_outlined, color: AppColors.primary),
                SizedBox(width: 8),
                Text(
                  'Privacy & Data Protection',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Text(
              'GateLink is ISO 27001 certified and complies with India\'s Digital Personal Data Protection (DPDP) Act 2023.',
              style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.privacy_tip_outlined, color: AppColors.primary),
              title: const Text('Read Privacy Policy', style: TextStyle(fontWeight: FontWeight.w600)),
              subtitle: const Text('https://gatelink.in/privacy'),
              onTap: () async {
                Navigator.pop(ctx);
                final Uri uri = Uri.parse('https://gatelink.in/privacy');
                try { await launchUrl(uri, mode: LaunchMode.externalApplication); } catch (_) {}
              },
            ),
            const Divider(height: 1),
            ListTile(
              leading: const Icon(Icons.description_outlined, color: AppColors.primary),
              title: const Text('Read Terms of Service', style: TextStyle(fontWeight: FontWeight.w600)),
              subtitle: const Text('https://gatelink.in/terms'),
              onTap: () async {
                Navigator.pop(ctx);
                final Uri uri = Uri.parse('https://gatelink.in/terms');
                try { await launchUrl(uri, mode: LaunchMode.externalApplication); } catch (_) {}
              },
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  void _showAccountDeletionDialog(BuildContext context, WidgetRef ref) async {
    final user = ref.read(currentUserProvider);
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Authentication required.')),
      );
      return;
    }

    // Check if user has an existing pending deletion request in Firestore
    DocumentSnapshot? existingReq;
    try {
      final query = await FirebaseFirestore.instance
          .collection('account_deletion_requests')
          .where('userId', isEqualTo: user.uid)
          .where('status', isEqualTo: 'pending')
          .limit(1)
          .get();
      if (query.docs.isNotEmpty) {
        existingReq = query.docs.first;
      }
    } catch (_) {}

    if (!context.mounted) return;

    if (existingReq != null && existingReq.exists) {
      final reqData = existingReq.data() as Map<String, dynamic>? ?? {};
      final reqId = reqData['requestId'] ?? existingReq.id;
      final scheduledAt = reqData['scheduledDeletionAt'] ?? '7 days';

      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.xl),
          ),
          title: const Row(
            children: [
              Icon(Icons.shield_outlined, color: AppColors.primary),
              SizedBox(width: 8),
              Text(
                'Deletion Request Active',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Your account deletion request has been submitted and is currently in the 7-day grace period.',
                style: TextStyle(fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Request ID: $reqId', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('Scheduled Erasure: $scheduledAt', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Close'),
            ),
            ElevatedButton(
              onPressed: () async {
                Navigator.pop(ctx);
                try {
                  final callable = FirebaseFunctions.instance.httpsCallable('cancelAccountDeletion');
                  await callable.call();
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Account deletion request successfully cancelled.'),
                        backgroundColor: Colors.green,
                      ),
                    );
                  }
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Unable to cancel request: ${e.toString().replaceAll(RegExp(r'\[.*?\]'), '').trim()}'),
                        backgroundColor: AppColors.error,
                      ),
                    );
                  }
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text('Cancel Deletion'),
            ),
          ],
        ),
      );
      return;
    }

    // Show Request Account Deletion Confirmation Dialog
    showDialog(
      context: context,
      builder: (ctx) {
        bool isSubmitting = false;
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.xl),
              ),
              title: const Row(
                children: [
                  Icon(Icons.warning_amber_rounded, color: AppColors.error),
                  SizedBox(width: 8),
                  Text(
                    'Request Account Deletion',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17),
                  ),
                ],
              ),
              content: const SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Under India\'s DPDP Act 2023, you have the right to request erasure of your personal account data.',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                    ),
                    SizedBox(height: 10),
                    Text(
                      '• Your account will be soft-deactivated immediately.\n• A 7-day grace period applies before permanent processing.\n• Profile photos, notifications, and FCM tokens will be purged.\n• Payment receipts and tax invoices are retained for legal accounting compliance.',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                    ),
                    SizedBox(height: 12),
                    Text(
                      'For privacy inquiries, contact support@gatelink.in',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSubmitting ? null : () => Navigator.pop(ctx),
                  child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
                ),
                ElevatedButton(
                  onPressed: isSubmitting
                      ? null
                      : () async {
                          setState(() => isSubmitting = true);
                          try {
                            final callable = FirebaseFunctions.instance.httpsCallable('requestAccountDeletion');
                            final response = await callable.call({'createdVia': 'app'});
                            final resData = response.data as Map<String, dynamic>? ?? {};

                            if (context.mounted) {
                              Navigator.pop(ctx);
                              _showSuccessDeletionDialog(context, ref, resData);
                            }
                          } catch (err) {
                            setState(() => isSubmitting = false);
                            final cleanMsg = err.toString().replaceAll(RegExp(r'\[.*?\]'), '').trim();
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Deletion Request Error: $cleanMsg'),
                                  backgroundColor: AppColors.error,
                                ),
                              );
                            }
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.error,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                  ),
                  child: isSubmitting
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Confirm Deletion Request'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showSuccessDeletionDialog(BuildContext context, WidgetRef ref, Map<String, dynamic> data) {
    final reqId = data['requestId'] ?? 'DEL_REQ_SUCCESS';
    final scheduledAt = data['scheduledDeletionAt'] ?? '7 days from today';

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.xl),
        ),
        title: const Row(
          children: [
            Icon(Icons.check_circle_outline_rounded, color: Colors.green),
            SizedBox(width: 8),
            Text(
              'Request Submitted',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Your account deletion request has been submitted successfully.',
              style: TextStyle(fontSize: 13, height: 1.4),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Reference ID: $reqId', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('Scheduled Erasure: $scheduledAt', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  const SizedBox(height: 4),
                  const Text('Support: support@gatelink.in', style: TextStyle(fontSize: 12, color: AppColors.primary)),
                ],
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authServiceProvider).signOut();
              if (context.mounted) {
                context.go(AppRoutes.login);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
            ),
            child: const Text('OK, Sign Out'),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.xl),
        ),
        title: const Row(
          children: [
            Icon(Icons.logout_rounded, color: AppColors.error),
            SizedBox(width: 8),
            Text(
              'Sign Out',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
            ),
          ],
        ),
        content: const Text(
          'Are you sure you want to log out of your resident account?',
          style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel',
                style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authServiceProvider).signOut();
              if (context.mounted) {
                context.go('/login');
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
            ),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final profileAsync = ref.watch(userProfileProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            tooltip: 'Edit Profile',
            onPressed: () => context.push(AppRoutes.editProfile),
          ),
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          ref.invalidate(userProfileProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: profileAsync.when(
            data: (profile) {
              final societyName =
                  profile?.displaySocietyName ?? 'Housing Society';

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ProfileHeaderCard(
                    profile: profile,
                    fallbackDisplayName: user?.displayName ?? 'Resident',
                    fallbackEmail: user?.email ?? '',
                    onAvatarTap: () => context.push(AppRoutes.editProfile),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  const Text(
                    'RESIDENCY DETAILS',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textSecondary,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  ResidencyDetailsCard(
                    profile: profile,
                    fallbackPhone: user?.phoneNumber ?? '',
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  const Text(
                    'ACCOUNT & SETTINGS',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textSecondary,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  ProfileActionsMenu(
                    onEditProfile: () => context.push(AppRoutes.editProfile),
                    onVehicles: () => context.push(AppRoutes.parking),
                    onReferral: () => context.push(AppRoutes.referral),
                    onChangePassword: () =>
                        context.push(AppRoutes.changePassword),
                    onNotificationPreferences: () =>
                        NotificationPreferencesDialog.show(context,
                            profile: profile),
                    onSocietySupport: () =>
                        SocietySupportSheet.show(context,
                            societyName: societyName),
                    onTermsAndPrivacy: () => _showPrivacyPolicyModal(context),
                    onRequestAccountDeletion: () =>
                        _showAccountDeletionDialog(context, ref),
                    onLogout: () => _showLogoutDialog(context, ref),
                  ),
                  const SizedBox(height: AppSpacing.xxl),
                  const Center(
                    child: Text(
                      'GateLink Resident App • v2.4.0 (Production)',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.gray400,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                ],
              );
            },
            loading: () => const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 60),
                child: CircularProgressIndicator(color: AppColors.primary),
              ),
            ),
            error: (e, _) => Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 40),
                child: Column(
                  children: [
                    const Icon(Icons.error_outline_rounded,
                        color: AppColors.error, size: 40),
                    const SizedBox(height: 12),
                    const Text(
                      'Unable to load profile data',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () => ref.invalidate(userProfileProvider),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
