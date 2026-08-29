import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/services/visitor_pass_service.dart';

class HelperScanModal extends ConsumerStatefulWidget {
  final Map<String, dynamic> data;
  final String helperId;
  final bool isValid;
  final String? error;
  final VoidCallback onDismiss;

  const HelperScanModal({
    super.key,
    required this.data,
    required this.helperId,
    required this.isValid,
    this.error,
    required this.onDismiss,
  });

  static void show(
    BuildContext context, {
    required Map<String, dynamic> data,
    required String helperId,
    required bool isValid,
    String? error,
    required VoidCallback onDismiss,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => HelperScanModal(
        data: data,
        helperId: helperId,
        isValid: isValid,
        error: error,
        onDismiss: onDismiss,
      ),
    );
  }

  @override
  ConsumerState<HelperScanModal> createState() => _HelperScanModalState();
}

class _HelperScanModalState extends ConsumerState<HelperScanModal> {
  bool _isProcessing = false;

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

  Future<void> _handleCheckInOut(bool checkIn) async {
    setState(() => _isProcessing = true);
    HapticFeedback.mediumImpact();

    final userProfile = ref.read(userProfileProvider).value;
    final societyId = userProfile?['societyId'] as String? ?? '';
    final guardName = userProfile?['name'] as String? ?? 'Gate Guard';
    final gateName = userProfile?['gateName'] as String? ?? 'Main Gate';

    final name = widget.data['name'] as String? ?? 'Domestic Staff';
    final type = widget.data['type'] as String? ?? 'Staff';
    final flatNo = widget.data['flatNumber'] as String? ?? '';
    final residentUid = widget.data['residentUid'] as String? ?? '';

    final passService = VisitorPassService(societyId: societyId);
    final success = await passService.checkInOutHelper(
      helperId: widget.helperId,
      helperName: name,
      helperType: type,
      flatNumber: flatNo,
      residentUid: residentUid,
      checkIn: checkIn,
      gateName: gateName,
      guardName: guardName,
    );

    if (mounted) {
      setState(() => _isProcessing = false);
      Navigator.pop(context);
      widget.onDismiss();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              Icon(
                checkIn ? Icons.check_circle_rounded : Icons.logout_rounded,
                color: Colors.white,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  checkIn
                      ? '✅ Check-In Logged: $name entered $gateName.'
                      : '⚪ Check-Out Logged: $name left the society.',
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          backgroundColor: checkIn ? const Color(0xFF10B981) : const Color(0xFF3B82F6),
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final name = widget.data['name'] as String? ?? 'Domestic Staff';
    final type = widget.data['type'] as String? ?? 'Maid';
    final flatNo = widget.data['flatNumber'] as String? ?? 'Unknown';
    final phone = widget.data['phone'] as String? ?? 'No Phone';
    final residentName = widget.data['residentName'] as String? ?? 'Resident';
    final workingDays = widget.data['workingDays'] as String? ?? 'Mon - Sat';
    final isInside = widget.data['isInside'] as bool? ?? false;
    final roleColor = _getRoleColor(type);
    final isValid = widget.isValid;

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        left: 20,
        right: 20,
        top: 16,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag Handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Security Status Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: isValid ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isValid ? const Color(0xFFA7F3D0) : const Color(0xFFFECACA),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  isValid ? Icons.verified_user_rounded : Icons.gpp_bad_rounded,
                  color: isValid ? const Color(0xFF059669) : const Color(0xFFDC2626),
                  size: 24,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    isValid ? 'VERIFIED PERMANENT STAFF PASS' : 'ACCESS REVOKED / BLOCKED',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                      color: isValid ? const Color(0xFF065F46) : const Color(0xFF991B1B),
                      letterSpacing: 0.3,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Staff Profile Info
          Row(
            children: [
              CircleAvatar(
                radius: 32,
                backgroundColor: roleColor.withValues(alpha: 0.15),
                child: Icon(_getRoleIcon(type), color: roleColor, size: 34),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 20,
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
                            type.toUpperCase(),
                            style: TextStyle(
                              color: roleColor,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          phone,
                          style: const TextStyle(
                            fontSize: 13,
                            color: Color(0xFF64748B),
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

          const SizedBox(height: 18),

          // Key-Value Badges Box
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Authorized Flat:',
                      style: TextStyle(color: Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w500),
                    ),
                    Text(
                      'Flat $flatNo ($residentName)',
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF0F172A)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Working Days:',
                      style: TextStyle(color: Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w500),
                    ),
                    Text(
                      workingDays,
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF334155)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Current Location:',
                      style: TextStyle(color: Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w500),
                    ),
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: isInside ? const Color(0xFF10B981) : const Color(0xFF94A3B8),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          isInside ? 'Inside Society Now' : 'Outside Society',
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 13,
                            color: isInside ? const Color(0xFF059669) : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Action Section
          if (!isValid) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFFCA5A5)),
              ),
              child: Column(
                children: [
                  Text(
                    widget.error ?? 'Pass revoked by resident. Do not permit gate entry.',
                    style: const TextStyle(
                      color: Color(0xFF991B1B),
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      height: 1.4,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton(
                onPressed: () {
                  Navigator.pop(context);
                  widget.onDismiss();
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF64748B),
                  side: const BorderSide(color: Color(0xFFCBD5E1)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Dismiss', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ] else ...[
            // Active Staff Actions: Check-In vs Check-Out
            Row(
              children: [
                if (!isInside) ...[
                  Expanded(
                    child: SizedBox(
                      height: 52,
                      child: ElevatedButton.icon(
                        onPressed: _isProcessing ? null : () => _handleCheckInOut(true),
                        icon: _isProcessing
                            ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Icon(Icons.login_rounded, size: 20),
                        label: const Text(
                          'Confirm Check-In',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          elevation: 1,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ),
                ] else ...[
                  Expanded(
                    child: SizedBox(
                      height: 52,
                      child: ElevatedButton.icon(
                        onPressed: _isProcessing ? null : () => _handleCheckInOut(false),
                        icon: _isProcessing
                            ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Icon(Icons.logout_rounded, size: 20),
                        label: const Text(
                          'Confirm Check-Out',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF3B82F6),
                          foregroundColor: Colors.white,
                          elevation: 1,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ),
                ],
                const SizedBox(width: 12),
                SizedBox(
                  height: 52,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      widget.onDismiss();
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF64748B),
                      side: const BorderSide(color: Color(0xFFCBD5E1)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Cancel'),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
