import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:shimmer/shimmer.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../visitor/providers/visitor_providers.dart';

class PendingVisitorsList extends ConsumerWidget {
  const PendingVisitorsList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final visitorsAsync = ref.watch(pendingVisitorsForFlatStreamProvider);

    return visitorsAsync.when(
      data: (visitorsList) {
        final pendingVisitors =
            visitorsList.where((v) => v.isPending).take(3).toList();

        if (pendingVisitors.isEmpty) {
          return const _EmptyStateSmall();
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
      error: (e, st) =>
          const _EmptyStateSmall(errorMessage: 'Unable to load visitor logs'),
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
            backgroundColor: AppColors.visitor.withValues(alpha: 0.1),
            child: Text(
              visitor.initials,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.visitor),
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(visitor.name,
                    style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary)),
                Text(visitor.purpose,
                    style: const TextStyle(
                        fontSize: 12, color: AppColors.textSecondary)),
                Text(visitor.time,
                    style: const TextStyle(
                        fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ),
          Row(
            children: [
              _ApproveButton(
                label: 'Approve',
                color: AppColors.success,
                onTap: () async {
                  final user = ref.read(currentUserProvider);
                  if (user != null) {
                    await ref
                        .read(visitorControllerProvider.notifier)
                        .updateVisitorApproval(
                          visitorId: visitor.id,
                          status: 'approved',
                          residentUid: user.uid,
                        );
                  }
                },
              ),
              const SizedBox(width: 8),
              _ApproveButton(
                label: 'Deny',
                color: AppColors.error,
                onTap: () async {
                  final user = ref.read(currentUserProvider);
                  if (user != null) {
                    await ref
                        .read(visitorControllerProvider.notifier)
                        .updateVisitorApproval(
                          visitorId: visitor.id,
                          status: 'denied',
                          residentUid: user.uid,
                        );
                  }
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
  const _ApproveButton(
      {required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(AppRadius.sm),
        ),
        child: Text(label,
            style: TextStyle(
                fontSize: 11, fontWeight: FontWeight.w600, color: color)),
      ),
    );
  }
}

class _VisitorPreview {
  final String id, name, purpose, time, initials;
  const _VisitorPreview(
      {required this.id,
      required this.name,
      required this.purpose,
      required this.time,
      required this.initials});
}

class _EmptyStateSmall extends StatelessWidget {
  final String? errorMessage;
  const _EmptyStateSmall({this.errorMessage});

  @override
  Widget build(BuildContext context) {
    if (errorMessage != null) {
      return Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Center(
          child: Text(
            errorMessage!,
            style: const TextStyle(
              color: Color(0xFF64748B),
              fontSize: 12.5,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFECFDF5),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.verified_user_rounded,
              color: Color(0xFF10B981),
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Gate is Clear',
                  style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0F172A),
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'No visitors waiting at the security gate',
                  style: TextStyle(
                    fontSize: 11.5,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          OutlinedButton(
            onPressed: () => context.push(AppRoutes.inviteVisitor),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              side: const BorderSide(color: Color(0xFF0EA5E9), width: 1.2),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text(
              '+ Invite',
              style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF0EA5E9),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SkeletonCardList extends StatelessWidget {
  const _SkeletonCardList();

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE2E8F0),
      highlightColor: const Color(0xFFF8FAFC),
      child: Column(
        children: List.generate(
          2,
          (index) => Container(
            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.lg),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 120,
                        height: 12,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        width: 80,
                        height: 10,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 60,
                  height: 28,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
