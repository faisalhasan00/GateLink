import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../visitor/domain/models/visitor_model.dart';

class VisitorDetailActions extends ConsumerWidget {
  final VisitorModel visitor;

  const VisitorDetailActions({
    super.key,
    required this.visitor,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final phone = visitor.phone;
    final isInside = visitor.isInside;
    final isPending = visitor.isPending;
    final isApproved = visitor.isApproved;

    return Row(
      children: [
        if (isInside)
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () async {
                final svc = ref.read(firestoreServiceProvider);
                await svc.markVisitorExit(visitor.id);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Visitor marked as checked out.'),
                    ),
                  );
                }
              },
              icon: const Icon(Icons.exit_to_app_rounded),
              label: const Text('Mark Gate Exit'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          )
        else if (isPending || isApproved)
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () async {
                final svc = ref.read(firestoreServiceProvider);
                await svc.updateVisitorStatus(visitor.id, 'inside');
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Visitor checked in successfully!'),
                      backgroundColor: AppColors.success,
                    ),
                  );
                }
              },
              icon: const Icon(Icons.meeting_room_rounded),
              label: const Text('Check In Gate Entry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.success,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
        if (phone.length >= 10) ...[
          const SizedBox(width: AppSpacing.sm),
          ElevatedButton.icon(
            onPressed: () => launchUrl(Uri.parse('tel:$phone')),
            icon: const Icon(Icons.call_rounded),
            label: const Text('Call'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 14,
              ),
            ),
          ),
        ],
      ],
    );
  }
}
