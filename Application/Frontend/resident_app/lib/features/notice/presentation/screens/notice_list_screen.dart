import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/notice_providers.dart';
import '../../providers/poll_providers.dart';
import '../widgets/notice_category_filter.dart';
import '../widgets/notice_empty_state.dart';
import '../widgets/notice_item_card.dart';
import '../widgets/notice_skeleton_list.dart';
import '../widgets/poll_card_widget.dart';
import '../widgets/poll_empty_state.dart';

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
                return NoticeEmptyState(
                  onSeedSample: () async {
                    final repo = ref.read(noticeRepositoryProvider);
                    await repo.seedDemoNotices(activeSocId);
                  },
                );
              }

              final filteredList = _selectedCategory == 'All'
                  ? noticesList
                  : noticesList
                      .where((n) => n.category.toLowerCase() == _selectedCategory.toLowerCase())
                      .toList();

              return Column(
                children: [
                  NoticeCategoryFilter(
                    categories: _categories,
                    selectedCategory: _selectedCategory,
                    onCategorySelected: (cat) {
                      setState(() => _selectedCategory = cat);
                    },
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
                              return NoticeItemCard(notice: filteredList[index]);
                            },
                          ),
                  ),
                ],
              );
            },
            loading: () => const NoticeSkeletonList(),
            error: (err, _) => Center(
              child: Text('Error loading notices: $err', style: const TextStyle(color: AppColors.error)),
            ),
          ),

          // ── TAB 2: AGM & POLLS ────────────────────────────────────────────
          pollsAsync.when(
            data: (pollsList) {
              if (pollsList.isEmpty) {
                return PollEmptyState(
                  onSeedSample: () async {
                    final repo = ref.read(pollRepositoryProvider);
                    await repo.seedDemoPolls(activeSocId);
                  },
                );
              }

              return ListView.builder(
                padding: const EdgeInsets.all(AppSpacing.md),
                itemCount: pollsList.length,
                itemBuilder: (context, index) {
                  return PollCardWidget(poll: pollsList[index]);
                },
              );
            },
            loading: () => const NoticeSkeletonList(),
            error: (err, _) => Center(
              child: Text('Error loading polls: $err', style: const TextStyle(color: AppColors.error)),
            ),
          ),
        ],
      ),
    );
  }
}
