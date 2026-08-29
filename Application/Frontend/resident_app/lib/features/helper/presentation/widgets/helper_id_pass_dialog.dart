import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';
import '../../domain/models/helper_model.dart';

class HelperIdPassDialog extends StatelessWidget {
  final HelperModel helper;
  final String societyName;

  const HelperIdPassDialog({
    super.key,
    required this.helper,
    this.societyName = 'GateLink Community',
  });

  static void show(BuildContext context, {required HelperModel helper, String societyName = 'GateLink Community'}) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (_) => HelperIdPassDialog(helper: helper, societyName: societyName),
    );
  }

  void _sharePass(BuildContext context) {
    final qrData = helper.qrCodeData ?? 'GATELINK:HELPER:${helper.id}';
    final shareText = '''
🛡️ *GateLink Digital Staff Pass*
━━━━━━━━━━━━━━━━━━━━
👤 *Staff Name:* ${helper.name}
💼 *Role / Type:* ${helper.type}
🏢 *Flat Access:* Flat ${helper.flatNumber} ($societyName)
📱 *Phone:* ${helper.phone}
🗓️ *Schedule:* ${helper.workingDays}
🔑 *Security QR String:* $qrData
━━━━━━━━━━━━━━━━━━━━
Show this digital pass or QR code at the Security Gate for instant verification and entry.
''';
    SharePlus.instance.share(
      ShareParams(
        text: shareText,
        subject: '${helper.name} - GateLink Digital Gate Pass',
      ),
    );
  }

  Color _getRoleColor(String type) {
    switch (type.toLowerCase()) {
      case 'maid':
        return const Color(0xFF0EA5E9);
      case 'cook':
        return const Color(0xFFF59E0B);
      case 'driver':
        return const Color(0xFF10B981);
      case 'cleaner':
      case 'car cleaner':
        return const Color(0xFF8B5CF6);
      default:
        return const Color(0xFF1E3A8A);
    }
  }

  IconData _getRoleIcon(String type) {
    switch (type.toLowerCase()) {
      case 'maid':
        return Icons.cleaning_services_rounded;
      case 'cook':
        return Icons.restaurant_rounded;
      case 'driver':
        return Icons.directions_car_rounded;
      case 'cleaner':
      case 'car cleaner':
        return Icons.local_car_wash_rounded;
      default:
        return Icons.badge_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final roleColor = _getRoleColor(helper.type);
    final qrData = helper.qrCodeData ?? 'GATELINK:HELPER:${helper.id}';
    final isActive = helper.isActive;

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: SingleChildScrollView(
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 24,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Top Lanyard / Badge Header
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isActive
                        ? [const Color(0xFF1E3A8A), const Color(0xFF0EA5E9)]
                        : [const Color(0xFF64748B), const Color(0xFF475569)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.shield_rounded, color: Colors.white, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'GateLink Verified Staff Pass',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.2,
                            ),
                          ),
                          Text(
                            societyName,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.85),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isActive
                            ? const Color(0xFF10B981)
                            : const Color(0xFFEF4444),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        isActive ? 'ACTIVE' : 'REVOKED',
                        style: const TextStyle(
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

              // Staff Details & Avatar
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 28,
                          backgroundColor: roleColor.withValues(alpha: 0.15),
                          child: Icon(_getRoleIcon(helper.type), color: roleColor, size: 28),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                helper.name,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: roleColor.withValues(alpha: 0.12),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      helper.type.toUpperCase(),
                                      style: TextStyle(
                                        color: roleColor,
                                        fontSize: 11,
                                        fontWeight: FontWeight.w800,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Flat ${helper.flatNumber}',
                                    style: const TextStyle(
                                      color: Color(0xFF64748B),
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // QR Code Frame
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isActive ? const Color(0xFF0EA5E9).withValues(alpha: 0.3) : const Color(0xFFEF4444).withValues(alpha: 0.3),
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: (isActive ? const Color(0xFF0EA5E9) : const Color(0xFFEF4444)).withValues(alpha: 0.08),
                            blurRadius: 16,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          QrImageView(
                            data: qrData,
                            version: QrVersions.auto,
                            size: 190,
                            backgroundColor: Colors.white,
                            foregroundColor: isActive ? const Color(0xFF0F172A) : const Color(0xFF94A3B8),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            isActive ? 'Scan at Gate for Instant Entry' : 'Pass Revoked - Not Authorized',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: isActive ? const Color(0xFF0EA5E9) : const Color(0xFFEF4444),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Live Gate Status Strip
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: helper.isInside
                            ? const Color(0xFFECFDF5)
                            : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: helper.isInside
                              ? const Color(0xFFA7F3D0)
                              : const Color(0xFFE2E8F0),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                helper.isInside
                                    ? Icons.location_on_rounded
                                    : Icons.schedule_rounded,
                                color: helper.isInside
                                    ? const Color(0xFF059669)
                                    : const Color(0xFF64748B),
                                size: 16,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                helper.isInside
                                    ? 'Currently Inside Gate'
                                    : 'Outside Society',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: helper.isInside
                                      ? const Color(0xFF059669)
                                      : const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                          Text(
                            'Days: ${helper.workingDays}',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Actions: Share via WhatsApp & Close
                    Row(
                      children: [
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
                        const SizedBox(width: 12),
                        OutlinedButton(
                          onPressed: () => Navigator.pop(context),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Close'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
