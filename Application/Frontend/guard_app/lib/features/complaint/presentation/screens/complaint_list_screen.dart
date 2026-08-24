import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class ComplaintListScreen extends ConsumerStatefulWidget {
  const ComplaintListScreen({super.key});

  @override
  ConsumerState<ComplaintListScreen> createState() => _ComplaintListScreenState();
}

class _ComplaintListScreenState extends ConsumerState<ComplaintListScreen> with SingleTickerProviderStateMixin {
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

  List<_Complaint> _mapDocsToComplaints(List<dynamic> docs) {
    final mapped = docs.map((doc) {
      final data = doc.data() as Map<String, dynamic>;
      
      String dateStr = '';
      DateTime? dt;
      if (data['createdAt'] != null) {
        try {
          dt = DateTime.parse(data['createdAt']);
          dateStr = '${dt.day}/${dt.month}/${dt.year}';
        } catch (_) {}
      }

      return _Complaint(
        id: doc.id,
        title: data['title'] ?? 'Complaint',
        category: data['category'] ?? 'General',
        status: (data['status'] ?? 'Open').toLowerCase(),
        date: dateStr,
        priority: (data['priority'] ?? 'medium').toLowerCase(),
        createdAt: dt ?? DateTime.fromMillisecondsSinceEpoch(0),
      );
    }).toList();

    // Sort locally descending
    mapped.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return mapped;
  }

  List<_Complaint> _filtered(List<_Complaint> complaints, String status) =>
      status == 'all' ? complaints : complaints.where((c) => c.status == status).toList();

  @override
  Widget build(BuildContext context) {
    final complaintsAsync = ref.watch(complaintsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Complaints'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabs: const [Tab(text: 'All'), Tab(text: 'Open'), Tab(text: 'Resolved')],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.go(AppRoutes.raiseComplaint),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Raise Complaint'),
      ),
      body: complaintsAsync.when(
        data: (snapshot) {
          final allComplaints = _mapDocsToComplaints(snapshot.docs);
          
          return TabBarView(
            controller: _tabController,
            children: [
              _ComplaintListView(complaints: _filtered(allComplaints, 'all')),
              _ComplaintListView(complaints: _filtered(allComplaints, 'open')),
              _ComplaintListView(complaints: _filtered(allComplaints, 'resolved')),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _ComplaintListView extends StatelessWidget {
  final List<_Complaint> complaints;
  const _ComplaintListView({required this.complaints});

  @override
  Widget build(BuildContext context) {
    if (complaints.isEmpty) {
      return const Center(child: Text('No complaints found', style: TextStyle(color: AppColors.textSecondary)));
    }
    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: complaints.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, i) {
        final c = complaints[i];
        return GestureDetector(
          onTap: () => context.go('/home/complaints/${c.id}'),
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
                    _CategoryBadge(category: c.category),
                    const Spacer(),
                    _StatusBadge(status: c.status),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(c.title,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                    maxLines: 2, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Row(children: [
                  const Icon(Icons.calendar_today_rounded, size: 12, color: AppColors.textSecondary),
                  const SizedBox(width: 4),
                  Text(c.date, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  const Spacer(),
                  _PriorityDot(priority: c.priority),
                ]),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _CategoryBadge extends StatelessWidget {
  final String category;
  const _CategoryBadge({required this.category});
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(color: AppColors.primarySurface, borderRadius: BorderRadius.circular(AppRadius.full)),
    child: Text(category, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: AppColors.primary)),
  );
}

class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});
  @override
  Widget build(BuildContext context) {
    Color color; String label;
    switch (status) {
      case 'resolved': color = AppColors.success; label = 'Resolved'; break;
      case 'in_progress': color = AppColors.info; label = 'In Progress'; break;
      default: color = AppColors.warning; label = 'Open';
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(AppRadius.full)),
      child: Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
    );
  }
}

class _PriorityDot extends StatelessWidget {
  final String priority;
  const _PriorityDot({required this.priority});
  @override
  Widget build(BuildContext context) {
    Color color;
    switch (priority) {
      case 'high': color = AppColors.error; break;
      case 'medium': color = AppColors.warning; break;
      default: color = AppColors.success;
    }
    return Row(children: [
      Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
      const SizedBox(width: 4),
      Text(priority[0].toUpperCase() + priority.substring(1),
          style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w500)),
    ]);
  }
}

class _Complaint {
  final String id, title, category, status, date, priority;
  final DateTime createdAt;
  const _Complaint({
    required this.id,
    required this.title,
    required this.category,
    required this.status,
    required this.date,
    required this.priority,
    required this.createdAt,
  });
}
