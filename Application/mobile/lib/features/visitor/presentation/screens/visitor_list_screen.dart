import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/services/qr_share_service.dart';

class VisitorListScreen extends ConsumerStatefulWidget {
  const VisitorListScreen({super.key});

  @override
  ConsumerState<VisitorListScreen> createState() => _VisitorListScreenState();
}

class _VisitorListScreenState extends ConsumerState<VisitorListScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final visitorsAsync = ref.watch(visitorsStreamProvider);
    final userProfile = ref.watch(userProfileProvider).value;
    final flatNumber = userProfile?['flatNumber'] ?? '';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Visitors'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabs: const [Tab(text: 'Pending'), Tab(text: 'Expected'), Tab(text: 'History')],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.go(AppRoutes.inviteVisitor),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.person_add_rounded),
        label: const Text('Invite Visitor'),
      ),
      body: visitorsAsync.when(
        data: (snapshot) {
          final allDocs = snapshot.docs;

          // Filter to only this flat's visitors
          final myDocs = allDocs;

          final pending = myDocs.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            return data['status'] == 'pending';
          }).toList();

          final expected = myDocs.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            return data['status'] == 'expected';
          }).toList();

          final history = myDocs.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            return data['status'] != 'expected' && data['status'] != 'pending';
          }).toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _VisitorTabView(docs: pending, isPending: true),
              _VisitorTabView(docs: expected),
              _VisitorTabView(docs: history, isHistory: true),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _VisitorTabView extends ConsumerWidget {
  final List<dynamic> docs;
  final bool isHistory;
  final bool isPending;
  
  const _VisitorTabView({
    required this.docs, 
    this.isHistory = false, 
    this.isPending = false,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (docs.isEmpty) {
      return Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Icon(Icons.person_off_rounded, size: 56, color: AppColors.textDisabled),
          const SizedBox(height: AppSpacing.md),
          Text(isHistory ? 'No visitor history' : (isPending ? 'No pending visitors' : 'No expected visitors'),
              style: const TextStyle(color: AppColors.textSecondary)),
        ]),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: docs.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, i) {
        final doc = docs[i];
        final data = doc.data() as Map<String, dynamic>;
        final name = data['name'] ?? 'Unknown';
        final type = data['type'] ?? 'Visit';
        final status = data['status'] ?? 'expected';
        final initials = name.length >= 2
            ? name.split(' ').map((w) => w.isNotEmpty ? w[0] : '').take(2).join().toUpperCase()
            : name[0].toUpperCase();

        String timeStr = '';
        if (data['entryTime'] != null) {
          try {
            final dt = DateTime.parse(data['entryTime']);
            timeStr = '${dt.day}/${dt.month}/${dt.year} ${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
          } catch (_) {}
        } else if (data['expectedDate'] != null) {
          timeStr = '${data['expectedDate']} ${data['expectedTime'] ?? ''}';
        }

        return GestureDetector(
          onTap: () => context.go('/home/visitors/${doc.id}'),
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: AppColors.visitor.withValues(alpha: 0.12),
                      child: Text(initials, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.visitor)),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                        const SizedBox(height: 2),
                        Text(type, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        const SizedBox(height: 2),
                        Row(children: [
                          const Icon(Icons.access_time_rounded, size: 12, color: AppColors.textSecondary),
                          const SizedBox(width: 4),
                          Text(timeStr, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        ]),
                      ],
                    )),
                    Column(children: [
                      _StatusBadge(status: status),
                      const SizedBox(height: 8),
                      const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppColors.textSecondary),
                    ]),
                  ],
                ),
                if (isPending) ...[
                  const SizedBox(height: AppSpacing.md),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () async {
                            final confirm = await showDialog<bool>(
                              context: context,
                              builder: (ctx) => AlertDialog(
                                title: const Text('Reject Visitor?'),
                                content: Text('Are you sure you want to deny entry to $name?'),
                                actions: [
                                  TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                                  ElevatedButton(
                                    onPressed: () => Navigator.pop(ctx, true),
                                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
                                    child: const Text('Deny Entry'),
                                  ),
                                ],
                              ),
                            );
                            if (confirm == true) {
                              final svc = ref.read(firestoreServiceProvider);
                              final user = ref.read(currentUserProvider);
                              await svc.updateVisitorApproval(
                                visitorId: doc.id, 
                                status: 'rejected', 
                                residentUid: user?.uid ?? 'resident_user',
                              );
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('🛑 Visitor $name denied entry.'), backgroundColor: AppColors.error),
                                );
                              }
                            }
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.error,
                            side: const BorderSide(color: AppColors.error),
                          ),
                          child: const Text('Deny'),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () async {
                            final svc = ref.read(firestoreServiceProvider);
                            final user = ref.read(currentUserProvider);
                            await svc.updateVisitorApproval(
                              visitorId: doc.id, 
                              status: 'approved', 
                              residentUid: user?.uid ?? 'resident_user',
                            );
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('✅ Visitor $name approved for entry!'), backgroundColor: AppColors.success),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.success,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Approve'),
                        ),
                      ),
                    ],
                  ),
                ],
                if (!isPending && !isHistory && status == 'expected') ...[
                  const SizedBox(height: AppSpacing.md),
                  OutlinedButton.icon(
                    onPressed: () => _showQrDialog(context, doc.id, name),
                    icon: const Icon(Icons.qr_code_rounded, size: 16),
                    label: const Text('View QR Pass'),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(40),
                      foregroundColor: AppColors.primary,
                      side: const BorderSide(color: AppColors.primary),
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  void _showQrDialog(BuildContext context, String visitorId, String name) {
    final qrKey = GlobalKey();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Consumer(
        builder: (context, ref, _) => Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(width: 40, height: 4,
                decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2))),
              const SizedBox(height: AppSpacing.lg),
              const Text('QR Pass',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              const SizedBox(height: AppSpacing.sm),
              Text('Scan this pass at the gate for $name.',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 14),
                  textAlign: TextAlign.center),
              const SizedBox(height: AppSpacing.xl),
              RepaintBoundary(
                key: qrKey,
                child: Container(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: QrImageView(
                    data: visitorId,
                    version: QrVersions.auto,
                    size: 180.0,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
              ElevatedButton.icon(
                onPressed: () {
                  final profile = ref.read(userProfileProvider).value;
                  final tower = profile?['tower'] ?? '';
                  final flat = profile?['flatNumber'] ?? '';
                  final societyId = profile?['societyId'] ?? 'SOC-001';
                  final hostFlat = tower.isNotEmpty ? '$tower-$flat' : flat;
                  QrShareService.shareQrPass(
                    qrKey: qrKey,
                    visitorName: name,
                    societyId: societyId,
                    flatNumber: hostFlat,
                    visitTime: 'As scheduled',
                  );
                },
                icon: const Icon(Icons.share_rounded, size: 18),
                label: const Text('Share Pass with Visitor'),
              ),
              const SizedBox(height: AppSpacing.md),
              OutlinedButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Close'),
              ),
              const SizedBox(height: AppSpacing.md),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;
    String label;
    switch (status) {
      case 'inside': color = AppColors.success; label = 'In'; break;
      case 'left': color = AppColors.textSecondary; label = 'Out'; break;
      case 'approved': color = AppColors.success; label = 'Approved'; break;
      case 'denied': color = AppColors.error; label = 'Denied'; break;
      case 'pending': color = AppColors.warning; label = 'Pending'; break;
      default: color = AppColors.warning; label = 'Expected'; break;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(AppRadius.full)),
      child: Text(label, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: color)),
    );
  }
}
