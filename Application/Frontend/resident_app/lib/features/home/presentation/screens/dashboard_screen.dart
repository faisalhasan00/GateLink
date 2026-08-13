import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/ad_banner_carousel.dart';
import '../../../maintenance/presentation/screens/pay_maintenance_screen.dart';
import '../../../advertisement/models/ad_model.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          const _DashboardAppBar(),
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Maintenance Alert Banner (Dynamic)
                const _DynamicMaintenanceBanner(),
                const SizedBox(height: AppSpacing.lg),

                // Quick Actions Grid
                const _SectionTitle(title: 'Quick Actions'),
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

                // Recent Complaints Summary
                _SectionTitle(
                  title: 'My Complaints',
                  action: TextButton(
                    onPressed: () => context.go(AppRoutes.raiseComplaint),
                    child: const Text('View All'),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                const _RecentComplaintsWidget(),
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

                // Emergency Contacts
                const _SectionTitle(title: 'Emergency Contacts'),
                const SizedBox(height: AppSpacing.md),
                const _EmergencyContactsWidget(),
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

// ── DYNAMIC APP BAR & GREETING ───────────────────────────────────────────────

class _DashboardAppBar extends ConsumerWidget {
  const _DashboardAppBar();

  String _getTimeBasedGreeting() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) {
      return '🌅 Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return '☀️ Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return '🌆 Good Evening';
    } else {
      return '🌙 Good Night';
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(userProfileProvider);
    final user = ref.watch(currentUserProvider);

    final String residentName = profileAsync.value?['name'] ?? 
                                profileAsync.value?['displayName'] ?? 
                                user?.displayName ?? 
                                (user?.email?.split('@').first ?? 'Resident');

    final String societyName = profileAsync.value?['societyName'] ?? 
                               profileAsync.value?['societyId'] ?? 
                               'SocietySphere Residency';

    final String greeting = _getTimeBasedGreeting();

    return SliverAppBar(
      floating: true,
      snap: true,
      backgroundColor: Colors.white,
      elevation: 0,
      titleSpacing: AppSpacing.pagePadding,
      title: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: AppColors.primarySurface,
            child: Text(
              residentName.isNotEmpty ? residentName[0].toUpperCase() : 'R',
              style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.primary, fontSize: 16),
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$greeting 👋',
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w400),
                ),
                Text(
                  residentName,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  societyName,
                  style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w600),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
      actions: [
        Consumer(
          builder: (context, ref, _) {
            final unreadCountAsync = ref.watch(unreadNotificationsCountStreamProvider);
            final count = unreadCountAsync.value ?? 0;

            return IconButton(
              onPressed: () => context.go(AppRoutes.notifications),
              icon: Stack(
                clipBehavior: Clip.none,
                children: [
                  const Icon(Icons.notifications_outlined, color: AppColors.textPrimary, size: 24),
                  if (count > 0)
                    Positioned(
                      right: -2,
                      top: -2,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle),
                        constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                        child: Text(
                          count > 9 ? '9+' : '$count',
                          style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w800),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
            );
          },
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

// ── DYNAMIC MAINTENANCE BANNER ──────────────────────────────────────────────

class _DynamicMaintenanceBanner extends ConsumerWidget {
  const _DynamicMaintenanceBanner();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final billsAsync = ref.watch(maintenanceBillsStreamProvider);

    return billsAsync.when(
      data: (bills) {
        final pendingBills = bills.where((b) => !b.isPaid).toList();

        if (pendingBills.isEmpty) {
          // No pending dues state
          return Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: const Color(0xFFECFDF5),
              borderRadius: BorderRadius.circular(AppRadius.xl),
              border: Border.all(color: const Color(0xFFA7F3D0)),
            ),
            child: Row(
              children: [
                const Icon(Icons.check_circle_rounded, color: Color(0xFF059669), size: 32),
                const SizedBox(width: AppSpacing.md),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('No Pending Dues', style: TextStyle(color: Color(0xFF065F46), fontSize: 15, fontWeight: FontWeight.w700)),
                      Text('All maintenance bills are paid up to date!', style: TextStyle(color: Color(0xFF047857), fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          );
        }

        final firstBill = pendingBills.first;
        final amount = firstBill.amount;
        final dueDateStr = firstBill.dueDate.isNotEmpty ? firstBill.dueDate : firstBill.month;

        return Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF1E40AF), Color(0xFF3B82F6)],
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
                      'Pending Maintenance',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    Text(
                      '₹ ${amount.toString()}',
                      style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w700),
                    ),
                    Text(
                      'Due: $dueDateStr',
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  final firstDoc = pendingDocs.first;
                  final fbData = firstDoc.data() as Map<String, dynamic>;
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PayMaintenanceScreen(
                        billId: firstDoc.id,
                        amount: (fbData['amount'] ?? 0).toDouble(),
                        month: fbData['month'] ?? 'August 2026',
                        invoiceNumber: fbData['invoiceNumber'] ?? fbData['billNumber'] ?? 'INV-${firstDoc.id.substring(0, 6)}',
                        dueDate: fbData['dueDate'] ?? '10 Aug 2026',
                        maintenanceCharge: (fbData['maintenanceCharge'] ?? fbData['maintenanceCharges'] ?? 0).toDouble(),
                        waterCharge: (fbData['waterCharge'] ?? fbData['waterCharges'] ?? 0).toDouble(),
                        parkingCharge: (fbData['parkingCharge'] ?? 0).toDouble(),
                        sinkingFund: (fbData['sinkingFund'] ?? 0).toDouble(),
                        penaltyFee: (fbData['penaltyFee'] ?? fbData['lateFee'] ?? 0).toDouble(),
                      ),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppColors.primary,
                  minimumSize: const Size(80, 36),
                  textStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                ),
                child: const Text('Pay Now'),
              ),
            ],
          ),
        );
      },
      loading: () => const _SkeletonBanner(),
      error: (err, stack) => const SizedBox.shrink(),
    );
  }
}

// ── QUICK ACTIONS ────────────────────────────────────────────────────────────

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
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.3),
            ),
          ],
        ),
      ),
    );
  }
}

// ── PENDING VISITORS ─────────────────────────────────────────────────────────

class _PendingVisitorsList extends ConsumerWidget {
  const _PendingVisitorsList();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final visitorsAsync = ref.watch(pendingVisitorsForFlatStreamProvider);

    return visitorsAsync.when(
      data: (visitorsList) {
        final pendingVisitors = visitorsList.where((v) => v.isPending).take(3).toList();
        
        if (pendingVisitors.isEmpty) {
          return const _EmptyStateSmall(message: 'No pending visitor approvals 👋');
        }

        return Column(
          children: pendingVisitors.map((visitor) {
            final name = visitor.name;
            final purpose = visitor.type;
            
            String timeStr = 'Just now';
            if (visitor.entryTime != null) {
              try {
                final dt = DateTime.parse(visitor.entryTime!);
                timeStr = DateFormat('h:mm a').format(dt);
              } catch (_) {}
            }

            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: _VisitorCard(
                visitor: _VisitorPreview(
                  id: visitor.id,
                  name: name,
                  purpose: purpose,
                  time: timeStr,
                  initials: visitor.initials,
                ),
              ),
            );
          }).toList(),
        );
      },
      loading: () => const _SkeletonCardList(),
      error: (e, st) => const _EmptyStateSmall(message: 'Unable to load visitor logs'),
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

// ── RECENT COMPLAINTS WIDGET ─────────────────────────────────────────────────

class _RecentComplaintsWidget extends ConsumerWidget {
  const _RecentComplaintsWidget();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final complaintsAsync = ref.watch(complaintsStreamProvider);

    return complaintsAsync.when(
      data: (snapshot) {
        if (snapshot.docs.isEmpty) {
          return const _EmptyStateSmall(message: 'No active complaints 🛠️');
        }

        final doc = snapshot.docs.first;
        final data = doc.data() as Map<String, dynamic>;
        final title = data['title'] ?? 'Complaint';
        final status = data['status'] ?? 'Pending';
        final category = data['category'] ?? 'General';

        Color statusColor = AppColors.warning;
        if (status.toString().toLowerCase() == 'resolved') {
          statusColor = AppColors.success;
        } else if (status.toString().toLowerCase() == 'in progress') {
          statusColor = AppColors.primary;
        }

        return Container(
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
                  color: AppColors.complaint.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: const Icon(Icons.support_agent_rounded, color: AppColors.complaint, size: 22),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                    Text('Category: $category', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: Text(
                  status.toUpperCase(),
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: statusColor),
                ),
              ),
            ],
          ),
        );
      },
      loading: () => const _SkeletonCardList(),
      error: (e, st) => const SizedBox.shrink(),
    );
  }
}

// ── RECENT NOTICES ───────────────────────────────────────────────────────────

class _RecentNoticesList extends ConsumerWidget {
  const _RecentNoticesList();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final noticesAsync = ref.watch(noticesStreamProvider);

    return noticesAsync.when(
      data: (snapshot) {
        final notices = snapshot.docs.take(3).toList();
        
        if (notices.isEmpty) {
          return const _EmptyStateSmall(message: 'No recent notices 📢');
        }

        return Column(
          children: notices.map((doc) {
            final data = doc.data() as Map<String, dynamic>;
            final title = data['title'] ?? 'Notice';
            
            String dateStr = 'Today';
            if (data['createdAt'] != null) {
              try {
                final dt = DateTime.parse(data['createdAt']);
                dateStr = DateFormat('dd MMM yyyy').format(dt);
              } catch (_) {}
            }

            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: InkWell(
                onTap: () => context.go(AppRoutes.notices),
                borderRadius: BorderRadius.circular(AppRadius.lg),
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
                            Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary), maxLines: 2, overflow: TextOverflow.ellipsis),
                            Text(dateStr, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        );
      },
      loading: () => const _SkeletonCardList(),
      error: (e, st) => const _EmptyStateSmall(message: 'Unable to load notices'),
    );
  }
}

// ── EMERGENCY CONTACTS ──────────────────────────────────────────────────────

class _EmergencyContactsWidget extends StatelessWidget {
  const _EmergencyContactsWidget();

  void _callNumber(String phone) async {
    final Uri uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final contacts = [
      {'name': 'Security Desk', 'phone': '+91 98201 11111', 'icon': Icons.security_rounded, 'color': AppColors.primary},
      {'name': 'Society Office', 'phone': '+91 98201 22222', 'icon': Icons.business_rounded, 'color': AppColors.secondary},
      {'name': 'Plumber & Electrician', 'phone': '+91 98201 33333', 'icon': Icons.build_rounded, 'color': AppColors.warning},
      {'name': 'Emergency Ambulance', 'phone': '108', 'icon': Icons.local_hospital_rounded, 'color': AppColors.error},
    ];

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: contacts.map((c) {
          final icon = c['icon'] as IconData;
          final color = c['color'] as Color;
          final name = c['name'] as String;
          final phone = c['phone'] as String;

          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundColor: color.withOpacity(0.1),
                  child: Icon(icon, size: 16, color: color),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                ),
                IconButton(
                  onPressed: () => _callNumber(phone),
                  icon: const Icon(Icons.phone_in_talk_rounded, color: AppColors.success, size: 20),
                  constraints: const BoxConstraints(),
                  padding: EdgeInsets.zero,
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ── MY SOCIETY INFO CARD ─────────────────────────────────────────────────────

class _SocietyInfoCard extends ConsumerWidget {
  const _SocietyInfoCard();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(userProfileProvider).value;
    final societyId = profile?['societyId'] ?? 'SOC-001';
    final societyName = profile?['societyName'] ?? 'SocietySphere Residency';
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
          const Text('My Resident Profile', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          const SizedBox(height: AppSpacing.sm),
          const Divider(),
          const SizedBox(height: AppSpacing.sm),
          _InfoRow(icon: Icons.apartment_rounded, label: 'Society', value: societyName),
          _InfoRow(icon: Icons.tag_rounded, label: 'Society ID', value: societyId),
          _InfoRow(icon: Icons.layers_rounded, label: 'Tower', value: tower),
          _InfoRow(icon: Icons.door_front_door_rounded, label: 'Flat Number', value: flat),
          const _InfoRow(icon: Icons.verified_user_rounded, label: 'Account Status', value: 'Active Resident', valueColor: AppColors.success),
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
        Expanded(child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary))),
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
        child: Text(message, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w500)),
      ),
    );
  }
}

class _SkeletonBanner extends StatelessWidget {
  const _SkeletonBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(AppRadius.xl),
      ),
    );
  }
}

class _SkeletonCardList extends StatelessWidget {
  const _SkeletonCardList();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(AppRadius.lg),
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
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Local Offers & Services',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
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
      loading: () => const _SkeletonCardList(),
      error: (e, st) => const SizedBox.shrink(),
    );
  }
}
