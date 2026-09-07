import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/services/qr_share_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class VisitorQrPassDialog extends StatelessWidget {
  final String visitorId;
  final String name;

  const VisitorQrPassDialog({
    super.key,
    required this.visitorId,
    required this.name,
  });

  static void show(BuildContext context, String visitorId, String name) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => VisitorQrPassDialog(visitorId: visitorId, name: name),
    );
  }

  @override
  Widget build(BuildContext context) {
    final qrKey = GlobalKey();

    return Consumer(
      builder: (context, ref, _) => Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            const Text(
              'QR Pass',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Scan this pass at the gate for $name.',
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
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
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
        ),
      ),
    );
  }
}
