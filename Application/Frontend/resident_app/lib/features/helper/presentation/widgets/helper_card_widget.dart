import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../domain/models/helper_model.dart';
import '../../providers/helper_providers.dart';
import '../controllers/helper_controller.dart';
import '../screens/helper_timesheet_screen.dart';
import '../widgets/helper_id_pass_dialog.dart';

class HelperCardWidget extends ConsumerWidget {
  final HelperModel helper;
  final String societyId;
  final String societyName;

  const HelperCardWidget({
    super.key,
    required this.helper,
    required this.societyId,
    this.societyName = 'GateLink Community',
  });

  String _formatTime(String? isoString) {
    if (isoString == null || isoString.isEmpty) return '';
    try {
      final dt = DateTime.parse(isoString).toLocal();
      return DateFormat('hh:mm a').format(dt);
    } catch (_) {
      return isoString;
    }
  }

  Future<void> _makeCall(String phone) async {
    if (phone.isEmpty) return;
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
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

  void _confirmRevoke(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: const [
            Icon(Icons.warning_amber_rounded, color: Color(0xFFEF4444), size: 24),
            SizedBox(width: 8),
            Text('Revoke Gate Pass?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Text(
          'Are you sure you want to cancel the permanent gate pass for ${helper.name} (${helper.type})?\n\nSecurity guards will immediately block gate entry.',
          style: const TextStyle(fontSize: 14, color: Color(0xFF475569)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              final success = await ref
                  .read(helperControllerProvider.notifier)
                  .revokeHelperAccess(
                    societyId: societyId,
                    helperId: helper.id,
                    helperName: helper.name,
                  );
              if (context.mounted && success) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('🛑 Access revoked for ${helper.name}.'),
                    backgroundColor: const Color(0xFFEF4444),
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
            ),
            child: const Text('Revoke Access'),
          ),
        ],
      ),
    );
  }

  void _confirmReactivate(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Reactivate Gate Pass?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        content: Text(
          'Reactivate the permanent gate pass for ${helper.name} (${helper.type})?\n\nSecurity guards will allow regular gate entry again.',
          style: const TextStyle(fontSize: 14, color: Color(0xFF475569)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              final success = await ref
                  .read(helperControllerProvider.notifier)
                  .reactivateHelperAccess(
                    societyId: societyId,
                    helperId: helper.id,
                    helperName: helper.name,
                  );
              if (context.mounted && success) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('✅ Access reactivated for ${helper.name}.'),
                    backgroundColor: const Color(0xFF10B981),
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
            ),
            child: const Text('Reactivate Pass'),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Delete Helper Record?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        content: Text('Permanently remove ${helper.name} from your registered staff list?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await ref
                  .read(helperControllerProvider.notifier)
                  .deleteHelper(
                    societyId: societyId,
                    helperId: helper.id,
                    helperName: helper.name,
                  );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final roleColor = _getRoleColor(helper.type);
    final isActive = helper.isActive;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isActive ? const Color(0xFFE2E8F0) : const Color(0xFFFCA5A5),
          width: isActive ? 1 : 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: roleColor.withValues(alpha: 0.12),
                  child: Icon(_getRoleIcon(helper.type), color: roleColor, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              helper.name,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: isActive
                                  ? const Color(0xFFDCFCE7)
                                  : const Color(0xFFFEE2E2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              isActive ? 'ACTIVE' : 'REVOKED',
                              style: TextStyle(
                                color: isActive
                                    ? const Color(0xFF166534)
                                    : const Color(0xFF991B1B),
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                          PopupMenuButton<String>(
                            padding: EdgeInsets.zero,
                            icon: const Icon(Icons.more_vert, size: 20, color: Color(0xFF64748B)),
                            onSelected: (value) {
                              if (value == 'delete') {
                                _confirmDelete(context, ref);
                              }
                            },
                            itemBuilder: (ctx) => [
                              const PopupMenuItem(
                                value: 'delete',
                                child: Row(
                                  children: [
                                    Icon(Icons.delete_outline_rounded, color: Color(0xFFDC2626), size: 18),
                                    SizedBox(width: 8),
                                    Text('Delete Record', style: TextStyle(color: Color(0xFFDC2626), fontSize: 13)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                            decoration: BoxDecoration(
                              color: roleColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              helper.type,
                              style: TextStyle(
                                color: roleColor,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            helper.phone.isNotEmpty ? helper.phone : 'No Phone',
                            style: const TextStyle(
                              color: Color(0xFF64748B),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          if (helper.phone.isNotEmpty) ...[
                            const SizedBox(width: 6),
                            InkWell(
                              onTap: () => _makeCall(helper.phone),
                              borderRadius: BorderRadius.circular(12),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFDCFCE7),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: const [
                                    Icon(Icons.phone_rounded, size: 11, color: Color(0xFF15803D)),
                                    SizedBox(width: 3),
                                    Text(
                                      'Call',
                                      style: TextStyle(
                                        fontSize: 10.5,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFF15803D),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),
            const Divider(height: 1, color: Color(0xFFF1F5F9)),
            const SizedBox(height: 10),

            // Live Inside Gate status + Working Days info
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: helper.isInside
                            ? const Color(0xFF10B981)
                            : const Color(0xFF94A3B8),
                        boxShadow: helper.isInside
                            ? [
                                BoxShadow(
                                  color: const Color(0xFF10B981).withValues(alpha: 0.5),
                                  blurRadius: 6,
                                  spreadRadius: 1,
                                ),
                              ]
                            : null,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          helper.isInside ? 'Inside Society Now' : 'Outside Society',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: helper.isInside
                                ? const Color(0xFF059669)
                                : const Color(0xFF64748B),
                          ),
                        ),
                        if (helper.isInside && helper.lastCheckIn != null && helper.lastCheckIn!.isNotEmpty)
                          Text(
                            'Checked In: ${_formatTime(helper.lastCheckIn)}',
                            style: const TextStyle(
                              fontSize: 10.5,
                              color: Color(0xFF10B981),
                              fontWeight: FontWeight.w600,
                            ),
                          )
                        else if (!helper.isInside && helper.lastCheckOut != null && helper.lastCheckOut!.isNotEmpty)
                          Text(
                            'Last Exit: ${_formatTime(helper.lastCheckOut)}',
                            style: const TextStyle(
                              fontSize: 10.5,
                              color: Color(0xFF94A3B8),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Text(
                    helper.workingDays,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF475569),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Timesheet & Salary Entry Banner Button
            InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (ctx) => HelperTimesheetScreen(
                      helper: helper,
                      societyName: societyName,
                    ),
                  ),
                );
              },
              borderRadius: BorderRadius.circular(10),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFBFDBFE)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(5),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E3A8A),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Icon(Icons.calendar_month_rounded, color: Colors.white, size: 14),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Monthly Attendance & Salary',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1E3A8A),
                            ),
                          ),
                          Text(
                            'Base: ₹${(helper.monthlySalary ?? 3500.0).toStringAsFixed(0)}/mo • View Timesheet',
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Color(0xFF1E3A8A)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Buttons: View Digital QR Pass & Revoke Access
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: ElevatedButton.icon(
                    onPressed: () => HelperIdPassDialog.show(
                      context,
                      helper: helper,
                      societyName: societyName,
                    ),
                    icon: const Icon(Icons.qr_code_2_rounded, size: 18),
                    label: const Text('Digital QR Pass'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      elevation: 0,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 2,
                  child: OutlinedButton(
                    onPressed: () {
                      if (isActive) {
                        _confirmRevoke(context, ref);
                      } else {
                        _confirmReactivate(context, ref);
                      }
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: isActive
                          ? const Color(0xFFEF4444)
                          : const Color(0xFF10B981),
                      side: BorderSide(
                        color: isActive
                            ? const Color(0xFFFCA5A5)
                            : const Color(0xFF86EFAC),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: Text(
                      isActive ? 'Revoke' : 'Reactivate',
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
