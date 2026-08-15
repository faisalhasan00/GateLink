import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/services/qr_share_service.dart';

class VisitorPassSheet extends StatelessWidget {
  final String visitorId;
  final String passCode;
  final String visitorName;
  final String societyName;
  final String flatNumber;

  const VisitorPassSheet({
    super.key,
    required this.visitorId,
    required this.passCode,
    required this.visitorName,
    required this.societyName,
    required this.flatNumber,
  });

  static void show(
    BuildContext context, {
    required String visitorId,
    required String passCode,
    required String visitorName,
    required String societyName,
    required String flatNumber,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => VisitorPassSheet(
        visitorId: visitorId,
        passCode: passCode,
        visitorName: visitorName,
        societyName: societyName,
        flatNumber: flatNumber,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final qrKey = GlobalKey();

    return Padding(
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
          Text(
            'Entry Pass for $visitorName',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          RepaintBoundary(
            key: qrKey,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  QrImageView(
                    data: passCode,
                    version: QrVersions.auto,
                    size: 180,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Pass Code: $passCode',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          ElevatedButton.icon(
            onPressed: () => QrShareService.shareQrPass(
              qrKey: qrKey,
              visitorName: visitorName,
              societyId: societyName,
              flatNumber: flatNumber,
              visitTime: 'Today',
            ),
            icon: const Icon(Icons.share_rounded),
            label: const Text('Share Pass with Visitor'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 48),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
        ],
      ),
    );
  }
}
