import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/poll_providers.dart';
import '../widgets/poll_card_widget.dart';

class NoticeListScreen extends ConsumerStatefulWidget {
  const NoticeListScreen({super.key});

  @override
  ConsumerState<NoticeListScreen> createState() => _NoticeListScreenState();
}

class _NoticeListScreenState extends ConsumerState<NoticeListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final noticesAsync = ref.watch(noticesStreamProvider);
    final pollsAsync = ref.watch(pollsStreamProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/home/dashboard');
            }
          },
        ),
        title: const Text(
          'Community Hub',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF1E3A8A),
          indicatorWeight: 3,
          labelColor: const Color(0xFF1E3A8A),
          unselectedLabelColor: const Color(0xFF64748B),
          labelStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
          tabs: const [
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.campaign_rounded, size: 18),
                  SizedBox(width: 6),
                  Text('Notice Board'),
                ],
              ),
            ),
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.how_to_vote_rounded, size: 18),
                  SizedBox(width: 6),
                  Text('AGM & Polls'),
                ],
              ),
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // ── TAB 1: NOTICES ────────────────────────────────────────────────
          noticesAsync.when(
            data: (noticesList) {
              if (noticesList.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.campaign_outlined, size: 56, color: Colors.grey.shade400),
                      const SizedBox(height: 12),
                      const Text(
                        'No Notices Published',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Official announcements by Society Admin will appear here.',
                        style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                      ),
                    ],
                  ),
                );
              }

              return ListView.separated(
                padding: const EdgeInsets.all(AppSpacing.md),
                itemCount: noticesList.length,
                separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                itemBuilder: (context, index) {
                  final notice = noticesList[index];
                  String dateStr = notice.date;
                  if (dateStr.isEmpty && notice.createdAt.isNotEmpty) {
                    try {
                      final dt = DateTime.parse(notice.createdAt);
                      dateStr = '${dt.day}/${dt.month}/${dt.year}';
                    } catch (_) {}
                  }

                  final isEmergency = notice.category.toLowerCase() == 'emergency';

                  return GestureDetector(
                    onTap: () => context.go('/home/notices/${notice.id}'),
                    child: Container(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isEmergency ? const Color(0xFFFECACA) : const Color(0xFFE2E8F0),
                          width: isEmergency ? 1.5 : 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.03),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: isEmergency
                                  ? const Color(0xFFFEE2E2)
                                  : const Color(0xFFEFF6FF),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              isEmergency ? Icons.warning_amber_rounded : Icons.campaign_rounded,
                              color: isEmergency ? const Color(0xFFDC2626) : const Color(0xFF1E3A8A),
                              size: 22,
                            ),
                          ),
                          const SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: isEmergency
                                            ? const Color(0xFFFEF2F2)
                                            : const Color(0xFFF1F5F9),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        notice.category.toUpperCase(),
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w800,
                                          color: isEmergency ? const Color(0xFFDC2626) : const Color(0xFF475569),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  notice.title,
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.access_time_rounded, size: 12, color: Color(0xFF94A3B8)),
                                    const SizedBox(width: 4),
                                    Text(
                                      dateStr,
                                      style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
                        ],
                      ),
                    ),
                  );
                },
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (err, _) => Center(
              child: Text('Error loading notices: $err', style: const TextStyle(color: AppColors.error)),
            ),
          ),

          // ── TAB 2: AGM & POLLS ────────────────────────────────────────────
          pollsAsync.when(
            data: (pollsList) {
              if (pollsList.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.how_to_vote_outlined, size: 56, color: Colors.grey.shade400),
                      const SizedBox(height: 12),
                      const Text(
                        'No Active Society Polls',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'AGM voting resolutions and community polls will appear here.',
                        style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                      ),
                    ],
                  ),
                );
              }

              return ListView.builder(
                padding: const EdgeInsets.all(AppSpacing.md),
                itemCount: pollsList.length,
                itemBuilder: (context, index) {
                  final poll = pollsList[index];
                  return PollCardWidget(poll: poll);
                },
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (err, _) => Center(
              child: Text('Error loading polls: $err', style: const TextStyle(color: AppColors.error)),
            ),
          ),
        ],
      ),
    );
  }
}
