import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/notice_providers.dart';
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
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Emergency',
    'Maintenance',
    'Events',
    'General',
  ];

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
    final profile = ref.watch(userProfileProvider).value;
    final activeSocId = profile?.societyId ?? 'SOC-001';

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
                  child: Padding(
                    padding: const EdgeInsets.all(28),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: const BoxDecoration(
                            color: Color(0xFFEFF6FF),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.campaign_outlined, size: 48, color: Color(0xFF1E3A8A)),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'No Notices Published',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Official society announcements, maintenance notices, and emergency alerts will appear here.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton.icon(
                          onPressed: () async {
                            final repo = ref.read(noticeRepositoryProvider);
                            await repo.seedDemoNotices(activeSocId);
                          },
                          icon: const Icon(Icons.add_rounded, size: 18),
                          label: const Text('Publish Sample Notices'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF1E3A8A),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }

              final filteredList = _selectedCategory == 'All'
                  ? noticesList
                  : noticesList
                      .where((n) => n.category.toLowerCase() == _selectedCategory.toLowerCase())
                      .toList();

              return Column(
                children: [
                  // Category Filter Horizontal Ribbon
                  Container(
                    height: 52,
                    color: Colors.white,
                    child: ListView.separated(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      scrollDirection: Axis.horizontal,
                      itemCount: _categories.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final cat = _categories[index];
                        final isSelected = _selectedCategory == cat;

                        return ChoiceChip(
                          label: Text(
                            cat == 'Emergency'
                                ? '🚨 Emergency'
                                : cat == 'Maintenance'
                                    ? '🔧 Maintenance'
                                    : cat == 'Events'
                                        ? '🎉 Events'
                                        : cat == 'General'
                                            ? '📢 General'
                                            : '📋 All',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                              color: isSelected ? Colors.white : const Color(0xFF475569),
                            ),
                          ),
                          selected: isSelected,
                          selectedColor: const Color(0xFF1E3A8A),
                          backgroundColor: const Color(0xFFF1F5F9),
                          showCheckmark: false,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(999),
                            side: BorderSide(
                              color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFE2E8F0),
                            ),
                          ),
                          onSelected: (_) {
                            setState(() => _selectedCategory = cat);
                          },
                        );
                      },
                    ),
                  ),
                  const Divider(height: 1, thickness: 1, color: Color(0xFFE2E8F0)),

                  Expanded(
                    child: filteredList.isEmpty
                        ? Center(
                            child: Text(
                              'No $_selectedCategory notices found.',
                              style: const TextStyle(fontSize: 14, color: Color(0xFF94A3B8)),
                            ),
                          )
                        : ListView.separated(
                            padding: const EdgeInsets.all(AppSpacing.md),
                            itemCount: filteredList.length,
                            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                            itemBuilder: (context, index) {
                              final notice = filteredList[index];
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
                          ),
                  ),
                ],
              );
            },
            loading: () => const _NoticeSkeletonList(),
            error: (err, _) => Center(
              child: Text('Error loading notices: $err', style: const TextStyle(color: AppColors.error)),
            ),
          ),

          // ── TAB 2: AGM & POLLS ────────────────────────────────────────────
          pollsAsync.when(
            data: (pollsList) {
              if (pollsList.isEmpty) {
                return Center(
                  child: Padding(
                    padding: const EdgeInsets.all(28),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: const BoxDecoration(
                            color: Color(0xFFF5F3FF),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.how_to_vote_outlined, size: 48, color: Color(0xFF7C3AED)),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'No Active Society Polls',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'AGM voting resolutions and community polls will appear here with real-time percentage counts.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton.icon(
                          onPressed: () async {
                            final repo = ref.read(pollRepositoryProvider);
                            await repo.seedDemoPolls(activeSocId);
                          },
                          icon: const Icon(Icons.how_to_vote_rounded, size: 18),
                          label: const Text('Launch Sample AGM Polls'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF7C3AED),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                          ),
                        ),
                      ],
                    ),
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
            loading: () => const _NoticeSkeletonList(),
            error: (err, _) => Center(
              child: Text('Error loading polls: $err', style: const TextStyle(color: AppColors.error)),
            ),
          ),
        ],
      ),
    );
  }
}

class _NoticeSkeletonList extends StatelessWidget {
  const _NoticeSkeletonList();

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE2E8F0),
      highlightColor: const Color(0xFFF8FAFC),
      child: ListView.builder(
        padding: const EdgeInsets.all(AppSpacing.md),
        itemCount: 4,
        itemBuilder: (_, __) => Container(
          margin: const EdgeInsets.only(bottom: AppSpacing.sm),
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 60,
                      height: 10,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      width: double.infinity,
                      height: 14,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      width: 100,
                      height: 10,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
