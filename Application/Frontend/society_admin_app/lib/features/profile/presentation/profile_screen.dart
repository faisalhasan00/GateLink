import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/providers/admin_providers.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final society = ref.watch(activeSocietyProvider);
    final user = ref.watch(firebaseAuthProvider).currentUser;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Society Admin Operations Hub'),
        actions: [
          IconButton(
            icon: const Icon(Icons.sync_alt),
            tooltip: 'Switch Society',
            onPressed: () => context.push('/select-society'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Admin Profile & Society Banner
            AppCard(
              padding: const EdgeInsets.all(18),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: AppColors.primaryNavy,
                    child: Text(
                      (user?.email?.isNotEmpty == true) ? user!.email![0].toUpperCase() : 'A',
                      style: const TextStyle(fontSize: 22, color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          society?.name ?? 'GateLink Society',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          user?.email ?? 'admin@gatelink.in',
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 6),
                        const AppBadge(label: 'Management Committee / RWA', variant: BadgeVariant.primary, fontSize: 10),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Section: All Society Services & Modules (Web Parity)
            Text(
              'All Management Modules',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),

            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.25,
              children: [
                _ModuleCard(
                  icon: Icons.people_alt_outlined,
                  title: 'Residents Directory',
                  subtitle: 'Approvals & flats',
                  color: AppColors.primaryNavy,
                  onTap: () => context.push('/residents'),
                ),
                _ModuleCard(
                  icon: Icons.shield_outlined,
                  title: 'Gate & Visitors',
                  subtitle: 'Live gate check-ins',
                  color: AppColors.secondarySky,
                  onTap: () => context.push('/gate-security'),
                ),
                _ModuleCard(
                  icon: Icons.receipt_long_outlined,
                  title: 'Maintenance Dues',
                  subtitle: 'Invoices & settlements',
                  color: AppColors.successEmerald,
                  onTap: () => context.push('/maintenance'),
                ),
                _ModuleCard(
                  icon: Icons.pool_outlined,
                  title: 'Amenities',
                  subtitle: 'Slots & bookings',
                  color: AppColors.purple,
                  onTap: () => context.push('/amenities'),
                ),
                _ModuleCard(
                  icon: Icons.badge_outlined,
                  title: 'Staff & Guards',
                  subtitle: 'Roster & shift status',
                  color: AppColors.accentAmber,
                  onTap: () => context.push('/staff'),
                ),
                _ModuleCard(
                  icon: Icons.cleaning_services_outlined,
                  title: 'Daily Helpers',
                  subtitle: 'Maids, drivers & entry',
                  color: Colors.teal,
                  onTap: () => context.push('/helpers'),
                ),
                _ModuleCard(
                  icon: Icons.local_parking_outlined,
                  title: 'Parking Slots',
                  subtitle: 'Flat & vehicle maps',
                  color: Colors.indigo,
                  onTap: () => context.push('/parking'),
                ),
                _ModuleCard(
                  icon: Icons.campaign_outlined,
                  title: 'Notices & Circulars',
                  subtitle: 'Instant broadcasts',
                  color: Colors.deepOrange,
                  onTap: () => context.push('/notices'),
                ),
                _ModuleCard(
                  icon: Icons.how_to_vote_outlined,
                  title: 'Community Polls',
                  subtitle: 'Voting & opinions',
                  color: Colors.blueAccent,
                  onTap: () => context.push('/polls'),
                ),
                _ModuleCard(
                  icon: Icons.report_problem_outlined,
                  title: 'Complaints',
                  subtitle: 'Helpdesk & tickets',
                  color: AppColors.dangerCrimson,
                  onTap: () => context.push('/complaints'),
                ),
                _ModuleCard(
                  icon: Icons.folder_open_outlined,
                  title: 'Documents & Bylaws',
                  subtitle: 'Official records',
                  color: Colors.brown,
                  onTap: () => context.push('/documents'),
                ),
                _ModuleCard(
                  icon: Icons.sync_alt_rounded,
                  title: 'Switch Society',
                  subtitle: 'Multi-society panel',
                  color: Colors.blueGrey,
                  onTap: () => context.push('/select-society'),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Sign Out Button
            AppButton(
              label: 'Sign Out of Admin Console',
              variant: ButtonVariant.danger,
              icon: Icons.logout,
              width: double.infinity,
              onPressed: () async {
                await ref.read(firebaseAuthProvider).signOut();
                await ref.read(activeSocietyProvider.notifier).clearSociety();
                if (context.mounted) {
                  context.go('/login');
                }
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}

class _ModuleCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ModuleCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
