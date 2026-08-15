import 'package:flutter/material.dart';
import '../../../../core/widgets/widgets.dart';
import '../../domain/models/visitor_status.dart';

class VisitorStatusBadge extends StatelessWidget {
  final VisitorStatus status;

  const VisitorStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    AppBadgeVariant variant;

    switch (status) {
      case VisitorStatus.approved:
        variant = AppBadgeVariant.success;
        break;
      case VisitorStatus.rejected:
        variant = AppBadgeVariant.error;
        break;
      case VisitorStatus.expected:
        variant = AppBadgeVariant.info;
        break;
      case VisitorStatus.inside:
        variant = AppBadgeVariant.primary;
        break;
      case VisitorStatus.checkedOut:
        variant = AppBadgeVariant.neutral;
        break;
      case VisitorStatus.pending:
      case VisitorStatus.unknown:
        variant = AppBadgeVariant.warning;
    }

    return AppBadge(
      text: status.displayName,
      variant: variant,
      size: AppBadgeSize.sm,
      showDot: status == VisitorStatus.inside || status == VisitorStatus.pending,
    );
  }
}
