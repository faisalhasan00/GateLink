import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/society_model.dart';

class SocietySelectScreen extends ConsumerWidget {
  const SocietySelectScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final societiesAsync = ref.watch(adminSocietiesProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Select Society'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Sign Out',
            onPressed: () async {
              await ref.read(firebaseAuthProvider).signOut();
              await ref.read(activeSocietyProvider.notifier).clearSociety();
              if (context.mounted) {
                context.go('/login');
              }
            },
          ),
        ],
      ),
      body: societiesAsync.when(
        loading: () => const LoadingStateWidget(message: 'Loading your authorized societies...'),
        error: (err, stack) => ErrorStateWidget(
          message: 'Failed to load societies: ${err.toString()}',
          onRetry: () => ref.invalidate(adminSocietiesProvider),
        ),
        data: (societies) {
          if (societies.isEmpty) {
            return EmptyStateWidget(
              title: 'No Societies Found',
              description: 'Your account is not linked to any registered societies as an administrator.',
              actionLabel: 'Refresh',
              onAction: () => ref.invalidate(adminSocietiesProvider),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(20),
            itemCount: societies.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final society = societies[index];
              return _SocietyItemCard(
                society: society,
                onSelected: () async {
                  await ref.read(activeSocietyProvider.notifier).setSociety(society);
                  if (context.mounted) {
                    context.go('/dashboard');
                  }
                },
              );
            },
          );
        },
      ),
    );
  }
}

class _SocietyItemCard extends StatelessWidget {
  final SocietyModel society;
  final VoidCallback onSelected;

  const _SocietyItemCard({
    required this.society,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onSelected,
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            height: 48,
            width: 48,
            decoration: BoxDecoration(
              color: AppColors.skyLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.apartment_rounded,
              color: AppColors.secondarySky,
              size: 26,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  society.name,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                if (society.city.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    '${society.city}, ${society.state}',
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.home_outlined, size: 14, color: AppColors.textMuted),
                    const SizedBox(width: 4),
                    Text(
                      '${society.totalFlats} Flats',
                      style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppColors.textMuted),
        ],
      ),
    );
  }
}
