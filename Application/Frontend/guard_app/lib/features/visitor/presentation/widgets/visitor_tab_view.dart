import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import 'visitor_list_item.dart';

class VisitorTabView extends StatelessWidget {
  final List<dynamic> docs;
  final bool isHistory;
  final bool isPending;

  const VisitorTabView({
    super.key,
    required this.docs,
    this.isHistory = false,
    this.isPending = false,
  });

  @override
  Widget build(BuildContext context) {
    if (docs.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.person_off_rounded,
              size: 56,
              color: AppColors.textDisabled,
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              isHistory
                  ? 'No visitor history'
                  : (isPending
                      ? 'No pending visitors'
                      : 'No expected visitors'),
              style: const TextStyle(color: AppColors.textSecondary),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: docs.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (context, i) {
        return VisitorListItem(
          doc: docs[i],
          isPending: isPending,
          isHistory: isHistory,
        );
      },
    );
  }
}
