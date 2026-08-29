import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class VisitorPassBottomSheet extends StatelessWidget {
  final String visitorId;
  final String passCode;
  final String visitorName;
  final String expectedDate;
  final String expectedTime;
  final String hostFlat;
  final String passType; // 'one_time' or 'multi_day'
  final String? validFrom;
  final String? validUntil;

  const VisitorPassBottomSheet({
    super.key,
    required this.visitorId,
    required this.passCode,
    required this.visitorName,
    required this.expectedDate,
    required this.expectedTime,
    required this.hostFlat,
    this.passType = 'one_time',
    this.validFrom,
    this.validUntil,
  });

  bool get isOneTime => passType == 'one_time';

  void _sharePass(BuildContext context) {
    final isSingle = isOneTime;
    final shareText = isSingle
        ? '''
🛡️ *GateLink One-Time Gate Pass*
━━━━━━━━━━━━━━━━━━━━
👤 *Guest:* $visitorName
🏢 *Visiting Flat:* $hostFlat
🔑 *Entry Passcode:* $passCode
⏳ *Validity:* 1 Single Entry ($expectedDate $expectedTime)
━━━━━━━━━━━━━━━━━━━━
Show this 6-digit passcode or QR code to the Security Guard for instant gate entry.
'''
        : '''
🛡️ *GateLink Multi-Day Guest Pass*
━━━━━━━━━━━━━━━━━━━━
👤 *Guest:* $visitorName
🏢 *Visiting Flat:* $hostFlat
🔑 *Entry Passcode:* $passCode
📅 *Valid Period:* ${validFrom ?? expectedDate} to ${validUntil ?? expectedDate}
🔄 *Access:* Multiple entries & exits allowed during validity
━━━━━━━━━━━━━━━━━━━━
Show this passcode or QR code to the Security Guard for authorized gate access.
''';

    SharePlus.instance.share(
      ShareParams(
        text: shareText,
        subject: '$visitorName - GateLink Gate Pass',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
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

          // Header Icon & Title
          const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 52),
          const SizedBox(height: AppSpacing.md),
          Text(
            isOneTime ? 'One-Time Pass Generated!' : 'Multi-Day Pass Active!',
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            isOneTime
                ? 'Single-use pass for $visitorName. Auto-expires after entry.'
                : 'Multi-entry pass for $visitorName (${validFrom ?? expectedDate} - ${validUntil ?? expectedDate}).',
            style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.md),

          // Pass Type Pill
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: isOneTime ? const Color(0xFFEFF6FF) : const Color(0xFFFEF3C7),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isOneTime ? const Color(0xFFBFDBFE) : const Color(0xFFFDE68A),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isOneTime ? Icons.flash_on_rounded : Icons.date_range_rounded,
                  size: 14,
                  color: isOneTime ? const Color(0xFF1D4ED8) : const Color(0xFFB45309),
                ),
                const SizedBox(width: 6),
                Text(
                  isOneTime ? '⚡ 1-TIME SINGLE ENTRY PASS' : '📅 MULTI-DAY GUEST PASS',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: isOneTime ? const Color(0xFF1D4ED8) : const Color(0xFFB45309),
                    letterSpacing: 0.3,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // QR Code Card
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                QrImageView(
                  data: passCode,
                  version: QrVersions.auto,
                  size: 160.0,
                  eyeStyle: const QrEyeStyle(
                    eyeShape: QrEyeShape.square,
                    color: Color(0xFF1E3A8A),
                  ),
                  dataModuleStyle: const QrDataModuleStyle(
                    dataModuleShape: QrDataModuleShape.square,
                    color: Color(0xFF1E3A8A),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                const Text(
                  '6-Digit Entry Passcode',
                  style: TextStyle(
                    fontSize: 11,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  passCode,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 4,
                    color: Color(0xFF1E3A8A),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Action Buttons: Copy Code & WhatsApp Share
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: passCode));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Gate Passcode copied to clipboard!'),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                  icon: const Icon(Icons.copy_rounded, size: 18),
                  label: const Text('Copy Code'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _sharePass(context),
                  icon: const Icon(Icons.share_rounded, size: 18),
                  label: const Text('Share Pass'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.go(AppRoutes.home);
            },
            child: const Text('Done & Go to Home'),
          ),
        ],
      ),
    );
  }
}
