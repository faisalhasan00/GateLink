import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';

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
  final String? instructions;

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
    this.instructions,
  });

  bool get isOneTime => passType == 'one_time';

  void _sharePass(BuildContext context) {
    final isSingle = isOneTime;
    final instructionSection = instructions != null && instructions!.isNotEmpty
        ? '\n📝 *Instructions:* $instructions\n'
        : '';

    final shareText = isSingle
        ? '''
🛡️ *GateLink Digital Entry Pass*
━━━━━━━━━━━━━━━━━━━━
👤 *Guest / Delivery:* $visitorName
🏢 *Visiting:* Flat $hostFlat
🔑 *Passcode:* $passCode
⏳ *Validity:* 1 Single Entry ($expectedDate $expectedTime)$instructionSection━━━━━━━━━━━━━━━━━━━━
Show this 6-digit passcode or QR code to the Security Guard for instant gate clearance.
'''
        : '''
🛡️ *GateLink Multi-Day Guest Pass*
━━━━━━━━━━━━━━━━━━━━
👤 *Guest:* $visitorName
🏢 *Visiting:* Flat $hostFlat
🔑 *Passcode:* $passCode
📅 *Valid:* ${validFrom ?? expectedDate} to ${validUntil ?? expectedDate}$instructionSection━━━━━━━━━━━━━━━━━━━━
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
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFFF8FAFC),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag Handle
          Container(
            width: 44,
            height: 4,
            decoration: BoxDecoration(
              color: const Color(0xFFCBD5E1),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),

          // Header Badge
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
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
                      isOneTime ? Icons.verified_user_rounded : Icons.date_range_rounded,
                      size: 14,
                      color: isOneTime ? const Color(0xFF1D4ED8) : const Color(0xFFB45309),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isOneTime ? 'ONE-TIME GATE PASS' : 'MULTI-DAY PASS',
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w800,
                        color: isOneTime ? const Color(0xFF1D4ED8) : const Color(0xFFB45309),
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Ticket Card Motif
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF1E3A8A).withValues(alpha: 0.06),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                // Top Ticket Header: Guest & Flat
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(
                    color: Color(0xFF1E3A8A),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(19)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.person_rounded, color: Colors.white, size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              visitorName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Visiting Flat $hostFlat',
                              style: const TextStyle(
                                color: Color(0xFF93C5FD),
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'ACTIVE',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Middle: QR Code & Large Code
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                  child: Column(
                    children: [
                      QrImageView(
                        data: passCode,
                        version: QrVersions.auto,
                        size: 150.0,
                        eyeStyle: const QrEyeStyle(
                          eyeShape: QrEyeShape.square,
                          color: Color(0xFF1E3A8A),
                        ),
                        dataModuleStyle: const QrDataModuleStyle(
                          dataModuleShape: QrDataModuleShape.square,
                          color: Color(0xFF1E3A8A),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Perforated Line Effect
                      Row(
                        children: List.generate(
                          24,
                          (index) => Expanded(
                            child: Container(
                              color: index % 2 == 0 ? Colors.transparent : const Color(0xFFCBD5E1),
                              height: 1.5,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),

                      const Text(
                        'ENTRY PASSCODE',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF64748B),
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              passCode,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 4,
                                color: Color(0xFF1E3A8A),
                              ),
                            ),
                            const SizedBox(width: 8),
                            InkWell(
                              onTap: () {
                                HapticFeedback.selectionClick();
                                Clipboard.setData(ClipboardData(text: passCode));
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Passcode copied to clipboard!'),
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              },
                              child: const Icon(Icons.copy_rounded, size: 18, color: Color(0xFF0EA5E9)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // Action Buttons: WhatsApp Share & Done
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    HapticFeedback.lightImpact();
                    _sharePass(context);
                  },
                  icon: const Icon(Icons.share_rounded, size: 18),
                  label: const Text(
                    'Share with Guest',
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.go(AppRoutes.home);
            },
            child: const Text(
              'Done & Go to Home',
              style: TextStyle(
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

