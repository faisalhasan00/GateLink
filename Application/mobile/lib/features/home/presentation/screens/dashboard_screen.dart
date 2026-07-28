import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/ad_banner_carousel.dart';
import '../../../advertisement/models/ad_model.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          _DashboardAppBar(),
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Maintenance Alert Banner
                const _MaintenanceDueBanner(),
                const SizedBox(height: AppSpacing.lg),

                // Quick Actions Grid
                _SectionTitle(title: 'Quick Actions'),
                const SizedBox(height: AppSpacing.md),
                const _QuickActionsGrid(),
                const SizedBox(height: AppSpacing.lg),

                // Advertisement Banner
                const _AdsBannerSection(),
                const SizedBox(height: AppSpacing.lg),

                // Pending Visitors
                _SectionTitle(
                  title: 'Pending Visitor Approvals',
                  action: TextButton(
                    onPressed: () => context.go(AppRoutes.visitors),
                    child: const Text('View All'),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                const _PendingVisitorsList(),
                const SizedBox(height: AppSpacing.lg),

                // Recent Notices
                _SectionTitle(
                  title: 'Recent Notices',
                  action: TextButton(
                    onPressed: () => context.go(AppRoutes.notices),
                    child: const Text('View All'),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                const _RecentNoticesList(),
                const SizedBox(height: AppSpacing.lg),

                // Society Info Card
                const _SocietyInfoCard(),
                const SizedBox(height: AppSpacing.xl),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _DashboardAppBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      floating: true,
      snap: true,
      backgroundColor: Colors.white,
      elevation: 0,
      titleSpacing: AppSpacing.pagePadding,
      title: Row(
        children: [
          const CircleAvatar(
            radius: 18,
            backgroundColor: AppColors.primarySurface,
            child: Icon(Icons.person_rounded, size: 20, color: AppColors.primary),
          ),
          const SizedBox(width: AppSpacing.sm),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Good Morning 👋',
                style: TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w400),
              ),
              const Text(
                'Mohammed Faisal',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
              ),
            ],
          ),
        ],
      ),
      actions: [
        IconButton(
          onPressed: () => context.go(AppRoutes.notifications),
          icon: Stack(
            children: [
              const Icon(Icons.notifications_outlined, color: AppColors.textPrimary),
              Positioned(
                right: 0,
                top: 0,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(height: 1, color: AppColors.border),
      ),
    );
  }
}

class _MaintenanceDueBanner extends StatelessWidget {
  const _MaintenanceDueBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2563EB), Color(0xFF3B82F6)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppRadius.xl),
      ),
      child: Row(
        children: [
          const Icon(Icons.receipt_long_rounded, color: Colors.white, size: 36),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Maintenance Due',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
                const Text(
                  '₹ 3,500',
                  style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w700),
                ),
                const Text(
                  'Due by 10 Aug 2026',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () => context.go(AppRoutes.payMaintenance),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppColors.primary,
              minimumSize: const Size(80, 36),
              textStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              padding: const EdgeInsets.symmetric(horizontal: 16),
            ),
            child: const Text('Pay Now'),
          ),
        ],
      ),
    );
  }
}

class _QuickActionsGrid extends StatelessWidget {
  const _QuickActionsGrid();

  @override
  Widget build(BuildContext context) {
    final actions = [
      _QuickAction(icon: Icons.person_add_rounded, label: 'Invite\nVisitor', color: AppColors.visitor, route: AppRoutes.inviteVisitor),
      _QuickAction(icon: Icons.support_agent_rounded, label: 'Raise\nComplaint', color: AppColors.complaint, route: AppRoutes.raiseComplaint),
      _QuickAction(icon: Icons.sports_tennis_rounded, label: 'Book\nAmenity', color: AppColors.amenity, route: AppRoutes.amenities),
      _QuickAction(icon: Icons.local_parking_rounded, label: 'My\nParking', color: AppColors.parking, route: AppRoutes.parking),
      _QuickAction(icon: Icons.campaign_rounded, label: 'Notices', color: AppColors.notice, route: AppRoutes.notices),
      _QuickAction(icon: Icons.folder_rounded, label: 'Documents', color: AppColors.textSecondary, route: AppRoutes.documents),
    ];

    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: AppSpacing.md,
      crossAxisSpacing: AppSpacing.md,
      childAspectRatio: 1.1,
      children: actions.map((a) => _QuickActionCard(action: a)).toList(),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final _QuickAction action;
  const _QuickActionCard({required this.action});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go(action.route),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: action.color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(action.icon, color: action.color, size: 22),
            ),
            const SizedBox(height: 8),
            Text(
              action.label,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: AppColors.textPrimary, height: 1.3),
            ),
          ],
        ),
      ),
    );
  }
}

class _PendingVisitorsList extends ConsumerWidget {
  const _PendingVisitorsList();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final visitorsAsync = ref.watch(pendingVisitorsForFlatStreamProvider);

    return visitorsAsync.when(
      data: (snapshot) {
        final visitors = snapshot.docs.where((doc) => doc['status'] == 'pending').take(3).toList();
        
        if (visitors.isEmpty) {
          return const _EmptyStateSmall(message: 'No pending visitor approvals');
        }

        return Column(
          children: visitors.map((doc) {
            final data = doc.data() as Map<String, dynamic>;
            final name = data['name'] ?? 'Unknown';
            final initials = name.isNotEmpty ? name[0].toUpperCase() : '?';
            final purpose = data['type'] ?? 'Visit';
            
            // Format time safely
            String timeStr = 'Just now';
            if (data['entryTime'] != null) {
              try {
                final dt = DateTime.parse(data['entryTime']);
                timeStr = '${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
              } catch (_) {}
            }

            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: _VisitorCard(
                visitor: _VisitorPreview(
                  id: doc.id,
                  name: name,
                  purpose: purpose,
                  time: timeStr,
                  initials: initials,
                ),
              ),
            );
          }).toList(),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Text('Error: $e'),
    );
  }
}

class _VisitorCard extends ConsumerWidget {
  final _VisitorPreview visitor;
  const _VisitorCard({required this.visitor});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: AppColors.visitor.withOpacity(0.1),
            child: Text(
              visitor.initials,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.visitor),
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(visitor.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                Text(visitor.purpose, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                Text(visitor.time, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ),
          Row(
            children: [
              _ApproveButton(
                label: 'Approve', 
                color: AppColors.success, 
                onTap: () {
                  ref.read(firestoreServiceProvider).updateVisitorStatus(visitor.id, 'approved');
                },
              ),
              const SizedBox(width: 8),
              _ApproveButton(
                label: 'Deny', 
                color: AppColors.error, 
                onTap: () {
                  ref.read(firestoreServiceProvider).updateVisitorStatus(visitor.id, 'denied');
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ApproveButton extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _ApproveButton({required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(AppRadius.sm),
        ),
        child: Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
      ),
    );
  }
}

class _RecentNoticesList extends ConsumerWidget {
  const _RecentNoticesList();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final noticesAsync = ref.watch(noticesStreamProvider);

    return noticesAsync.when(
      data: (snapshot) {
        final notices = snapshot.docs.take(3).toList();
        
        if (notices.isEmpty) {
          return const _EmptyStateSmall(message: 'No recent notices');
        }

        return Column(
          children: notices.map((doc) {
            final data = doc.data() as Map<String, dynamic>;
            final title = data['title'] ?? 'Notice';
            
            String dateStr = '';
            if (data['createdAt'] != null) {
              try {
                final dt = DateTime.parse(data['createdAt']);
                dateStr = '${dt.day}/${dt.month}/${dt.year}';
              } catch (_) {}
            }

            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.notice.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                      child: const Icon(Icons.campaign_rounded, color: AppColors.notice, size: 20),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textPrimary), maxLines: 2, overflow: TextOverflow.ellipsis),
                          Text(dateStr, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                    if (data['isNew'] == true)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primarySurface,
                          borderRadius: BorderRadius.circular(AppRadius.full),
                        ),
                        child: const Text('NEW', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.primary)),
                      ),
                  ],
                ),
              ),
            );
          }).toList(),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Text('Error: $e'),
    );
  }
}

class _SocietyInfoCard extends ConsumerWidget {
  const _SocietyInfoCard();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(userProfileProvider).value;
    final societyId = profile?['societyId'] ?? 'SOC-001';
    final tower = profile?['tower'] ?? 'Tower A';
    final flat = profile?['flatNumber'] ?? 'Unknown';

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
          const Text('My Society', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          const SizedBox(height: AppSpacing.sm),
          const Divider(),
          const SizedBox(height: AppSpacing.sm),
          _InfoRow(icon: Icons.apartment_rounded, label: 'Society ID', value: societyId),
          _InfoRow(icon: Icons.layers_rounded, label: 'Tower', value: tower),
          _InfoRow(icon: Icons.door_front_door_rounded, label: 'Flat', value: flat),
          const _InfoRow(icon: Icons.person_rounded, label: 'Status', value: 'Active', valueColor: AppColors.success),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;
  const _InfoRow({required this.icon, required this.label, required this.value, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 14, color: AppColors.textSecondary),
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          const Spacer(),
          Text(value, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: valueColor ?? AppColors.textPrimary)),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final Widget? action;
  const _SectionTitle({required this.title, this.action});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary))),
        if (action != null) action!,
      ],
    );
  }
}

class _EmptyStateSmall extends StatelessWidget {
  final String message;
  const _EmptyStateSmall({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Center(
        child: Text(message, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
      ),
    );
  }
}

class _QuickAction {
  final IconData icon;
  final String label;
  final Color color;
  final String route;
  const _QuickAction({required this.icon, required this.label, required this.color, required this.route});
}

class _VisitorPreview {
  final String id, name, purpose, time, initials;
  const _VisitorPreview({required this.id, required this.name, required this.purpose, required this.time, required this.initials});
}

class _NoticePreview {
  final String title, date;
  final bool isNew;
  const _NoticePreview({required this.title, required this.date, required this.isNew});
}

/// Advertisement banner section shown on the dashboard.
class _AdsBannerSection extends ConsumerWidget {
  const _AdsBannerSection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final adsAsync = ref.watch(adCampaignsStreamProvider);

    return adsAsync.when(
      data: (snapshot) {
        if (snapshot.docs.isEmpty) return const SizedBox.shrink();

        final List<AdModel> ads = snapshot.docs.map((doc) {
          final data = doc.data() as Map<String, dynamic>;
          return AdModel(
            id: doc.id,
            businessName: data['companyName'] ?? data['title'] ?? 'Advertisement',
            tagline: data['description'] ?? '',
            ctaText: data['badgeText'] ?? 'Offer',
            ctaUrl: data['targetUrl'],
            gradientStart: const Color(0xFF1D4ED8),
            gradientEnd: const Color(0xFF60A5FA),
            icon: Icons.campaign_rounded,
          );
        }).toList();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section header with label
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Local Offers & Services',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.primarySurface,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  child: const Text(
                    'SPONSORED',
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),
            AdBannerCarousel(ads: ads),
          ],
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => const SizedBox.shrink(),
    );
  }
}
