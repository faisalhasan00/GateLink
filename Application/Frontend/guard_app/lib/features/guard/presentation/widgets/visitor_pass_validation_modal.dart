import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class VisitorPassValidationModal extends StatelessWidget {
  final String code;
  final bool isValid;
  final String reason;
  final String? docId;
  final Map<String, dynamic> data;
  final String? error;
  final Future<void> Function(String docId) onAllowEntry;
  final Future<void> Function(String docId) onDenyEntry;
  final Future<void> Function(String docId) onMarkExit;

  const VisitorPassValidationModal({
    super.key,
    required this.code,
    required this.isValid,
    required this.reason,
    required this.docId,
    required this.data,
    this.error,
    required this.onAllowEntry,
    required this.onDenyEntry,
    required this.onMarkExit,
  });

  static Future<void> show(
    BuildContext context, {
    required String code,
    required bool isValid,
    required String reason,
    required String? docId,
    required Map<String, dynamic> data,
    String? error,
    required Future<void> Function(String docId) onAllowEntry,
    required Future<void> Function(String docId) onDenyEntry,
    required Future<void> Function(String docId) onMarkExit,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => VisitorPassValidationModal(
        code: code,
        isValid: isValid,
        reason: reason,
        docId: docId,
        data: data,
        error: error,
        onAllowEntry: onAllowEntry,
        onDenyEntry: onDenyEntry,
        onMarkExit: onMarkExit,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isAlreadyUsed = reason == 'already_used';
    final isExpired = reason == 'expired';
    final isMultiDayInside = reason == 'multi_day_inside';
    final isNotYetValid = reason == 'not_yet_valid';

    String headerTitle = 'PASS VERIFIED ✅';
    String headerSub = 'Pre-approved visitor pass verified for gate entry.';
    Color primaryColor = AppColors.success;
    IconData statusIcon = Icons.verified_rounded;

    if (isMultiDayInside) {
      headerTitle = 'VISITOR INSIDE 🟢';
      headerSub =
          'Multi-Day guest is currently inside. Ready for check-out.';
      primaryColor = AppColors.secondary;
      statusIcon = Icons.exit_to_app_rounded;
    } else if (isAlreadyUsed) {
      headerTitle = 'ALREADY USED ❌';
      headerSub = 'This one-time pass has already been used for entry.';
      primaryColor = AppColors.error;
      statusIcon = Icons.cancel_rounded;
      HapticFeedback.heavyImpact();
    } else if (isExpired) {
      headerTitle = 'PASS EXPIRED ❌';
      headerSub = error ?? 'Pass expiration date & time has passed.';
      primaryColor = AppColors.error;
      statusIcon = Icons.timer_off_rounded;
      HapticFeedback.heavyImpact();
    } else if (isNotYetValid) {
      headerTitle = 'NOT YET VALID ⏳';
      headerSub = error ?? 'Pass date range has not started yet.';
      primaryColor = AppColors.warning;
      statusIcon = Icons.schedule_rounded;
      HapticFeedback.heavyImpact();
    } else if (!isValid) {
      headerTitle = 'INVALID QR CODE ❌';
      headerSub = error ?? 'QR code is not recognised or corrupted.';
      primaryColor = AppColors.error;
      statusIcon = Icons.error_rounded;
      HapticFeedback.heavyImpact();
    }

    return Container(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.lg,
        AppSpacing.md,
        AppSpacing.lg,
        AppSpacing.xl,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppRadius.xxl)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.gray300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          CircleAvatar(
            radius: 32,
            backgroundColor: primaryColor.withValues(alpha: 0.15),
            child: Icon(statusIcon, color: primaryColor, size: 38),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            headerTitle,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: primaryColor,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            headerSub,
            textAlign: TextAlign.center,
            style:
                const TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.md),
          const Divider(),
          const SizedBox(height: AppSpacing.sm),
          if (data.isNotEmpty) ...[
            _modalInfoRow('Visitor Name', data['name'] as String? ?? '-'),
            _modalInfoRow(
                'Destination Flat', data['hostFlat'] as String? ?? '-'),
            _modalInfoRow(
                'Visitor Type', data['type'] as String? ?? 'Guest'),
            _modalInfoRow(
              'Pass Type',
              (data['passType'] as String? ?? 'one_time') == 'multi_day'
                  ? '📅 Multi-Day (${data['validFrom'] ?? ''} - ${data['validUntil'] ?? ''})'
                  : '⚡ One-Time Single Entry',
            ),
            _modalInfoRow('Current Status',
                (data['status'] as String? ?? 'pending').toUpperCase()),
            _modalInfoRow(
                'Pass Code',
                code.length > 18
                    ? '${code.substring(0, 18)}...'
                    : code),
          ] else ...[
            _modalInfoRow(
                'Scanned Code',
                code.length > 22
                    ? '${code.substring(0, 22)}...'
                    : code),
          ],
          const SizedBox(height: AppSpacing.lg),
          Row(
            children: [
              if ((isAlreadyUsed || isMultiDayInside) && docId != null)
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () async {
                      Navigator.of(context).pop();
                      await onMarkExit(docId!);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content:
                              Text('✅ Visitor marked as checked out at gate!'),
                          backgroundColor: AppColors.secondary,
                        ),
                      );
                    },
                    icon: const Icon(Icons.exit_to_app_rounded),
                    label: const Text('MARK VISITOR EXIT'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.secondary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(AppRadius.lg)),
                    ),
                  ),
                )
              else if (isValid && docId != null) ...[
                Expanded(
                  child: OutlinedButton(
                    onPressed: () async {
                      Navigator.of(context).pop();
                      await onDenyEntry(docId!);
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(AppRadius.lg)),
                    ),
                    child: const Text('Deny Entry'),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    onPressed: () async {
                      Navigator.of(context).pop();
                      await onAllowEntry(docId!);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content:
                              Text('✅ Visitor allowed entry at Gate!'),
                          backgroundColor: AppColors.success,
                        ),
                      );
                    },
                    icon: const Icon(Icons.how_to_reg_rounded),
                    label: const Text('ALLOW ENTRY'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(AppRadius.lg)),
                    ),
                  ),
                ),
              ] else
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.gray400,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text('CLOSE'),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _modalInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(
                  fontSize: 13, color: AppColors.textSecondary)),
          Text(value,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}
