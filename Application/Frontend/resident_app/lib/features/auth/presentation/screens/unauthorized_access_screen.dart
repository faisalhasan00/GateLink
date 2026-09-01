import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class UnauthorizedAccessScreen extends ConsumerWidget {
  final String? requiredRole;
  final String? actualRole;

  const UnauthorizedAccessScreen({
    super.key,
    this.requiredRole = 'Resident',
    this.actualRole,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(userProfileProvider).value;
    final currentRole = actualRole ?? profile?.role ?? 'Unknown';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.error.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Icon(
                    Icons.gpp_bad_rounded,
                    size: 48,
                    color: AppColors.error,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              Text(
                'Access Restricted',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Your account is assigned the role "$currentRole", which does not have permission to access the GateLink Resident App.\n\nPlease log in via the GateLink Guard App or Society Admin Portal corresponding to your assigned role.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
              ),
              const Spacer(),
              ElevatedButton.icon(
                onPressed: () async {
                  await ref.read(authServiceProvider).signOut();
                  if (context.mounted) {
                    context.go(AppRoutes.login);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                icon: const Icon(Icons.logout_rounded),
                label: const Text(
                  'Sign Out & Switch Account',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ),
              const SizedBox(height: AppSpacing.md),
            ],
          ),
        ),
      ),
    );
  }
}
