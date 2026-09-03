import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/language_provider.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../visitor/domain/models/visitor_model.dart';

class GateEntryCard extends ConsumerWidget {
  final VisitorModel visitor;
  final VoidCallback onMarkOut;
  final VoidCallback onApprove;

  const GateEntryCard({
    super.key,
    required this.visitor,
    required this.onMarkOut,
    required this.onApprove,
  });

  Color get _typeColor {
    final t = visitor.type.toLowerCase();
    if (t.contains('delivery') || t.contains('swiggy') || t.contains('zomato') || t.contains('blinkit') || t.contains('zepto') || t.contains('amazon')) {
      return const Color(0xFFF97316); // Bright Orange
    }
    if (t.contains('cab') || t.contains('uber') || t.contains('ola') || t.contains('taxi')) {
      return const Color(0xFFEAB308); // Amber/Yellow
    }
    if (t.contains('help') || t.contains('maid') || t.contains('staff') || t.contains('driver')) {
      return const Color(0xFF10B981); // Emerald Green
    }
    if (t.contains('service') || t.contains('plumber') || t.contains('electrician')) {
      return const Color(0xFF8B5CF6); // Purple
    }
    return const Color(0xFF2563EB); // Navy/Blue Guest
  }

  IconData get _typeIcon {
    final t = visitor.type.toLowerCase();
    if (t.contains('delivery') || t.contains('swiggy') || t.contains('zomato') || t.contains('blinkit') || t.contains('zepto') || t.contains('amazon')) {
      return Icons.delivery_dining_rounded;
    }
    if (t.contains('cab') || t.contains('uber') || t.contains('ola') || t.contains('taxi')) {
      return Icons.local_taxi_rounded;
    }
    if (t.contains('help') || t.contains('maid') || t.contains('staff') || t.contains('driver')) {
      return Icons.cleaning_services_rounded;
    }
    if (t.contains('service') || t.contains('plumber') || t.contains('electrician')) {
      return Icons.handyman_rounded;
    }
    return Icons.person_rounded;
  }

  String get _status => visitor.status.toLowerCase();

  bool get _isOverstayed {
    if (_status != 'inside' || visitor.entryTime == null) return false;
    final diff = DateTime.now().difference(visitor.entryTime!);
    return diff.inHours >= 4;
  }

  Future<void> _makeCall(String phone) async {
    if (phone.isEmpty) return;
    final clean = phone.replaceAll(RegExp(r'[^0-9+]'), '');
    final uri = Uri.parse('tel:$clean');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Widget _buildStatusPill(AppStrings tr) {
    switch (_status) {
      case 'inside':
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFFECFDF5),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFF10B981)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.circle, size: 7, color: Color(0xFF10B981)),
              const SizedBox(width: 4),
              Text(
                '🟢 ${tr.get('filter_inside').toUpperCase()}',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF047857)),
              ),
            ],
          ),
        );
      case 'pending':
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFFFEF3C7),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFFF59E0B)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.hourglass_top_rounded, size: 12, color: Color(0xFFD97706)),
              const SizedBox(width: 4),
              Text(
                '🟡 ${tr.get('filter_pending').toUpperCase()}',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFFB45309)),
              ),
            ],
          ),
        );
      case 'approved':
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFFE0F2FE),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFF0EA5E9)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.check_circle_rounded, size: 12, color: Color(0xFF0284C7)),
              const SizedBox(width: 4),
              Text(
                '🔵 ${tr.get('filter_approved').toUpperCase()}',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF0369A1)),
              ),
            ],
          ),
        );
      default:
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFF94A3B8)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.exit_to_app_rounded, size: 12, color: Color(0xFF64748B)),
              const SizedBox(width: 4),
              Text(
                '⚪ ${tr.get('filter_exited').toUpperCase()}',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF475569)),
              ),
            ],
          ),
        );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tr = ref.watch(stringsProvider);
    final timeStr = visitor.entryTime != null ? DateFormat('hh:mm a').format(visitor.entryTime!) : '--';

    return GestureDetector(
      onTap: () => context.push('/visitors/${visitor.id}'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.xl),
          border: Border.all(
            color: _status == 'pending'
                ? const Color(0xFFF59E0B)
                : _isOverstayed
                    ? const Color(0xFFEF4444)
                    : const Color(0xFFCBD5E1),
            width: _status == 'pending' || _isOverstayed ? 2.0 : 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Big Flat Number + Category Icon + Status
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Big Flat Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E3A8A),
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF1E3A8A).withValues(alpha: 0.2),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.home_rounded, color: Colors.white, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        visitor.hostFlat.isNotEmpty ? visitor.hostFlat : 'Gate',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),

                // Category Tag
                Flexible(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _typeColor.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: _typeColor.withValues(alpha: 0.25)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(_typeIcon, color: _typeColor, size: 14),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            visitor.type.toUpperCase(),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: _typeColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Status Badge
                _buildStatusPill(tr),
              ],
            ),

            const SizedBox(height: 12),

            // Visitor Name & Company / Notes
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        visitor.name.isNotEmpty ? visitor.name : 'Visitor / आगंतुक',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                          letterSpacing: -0.3,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (visitor.company != null && visitor.company!.trim().isNotEmpty) ...[
                        const SizedBox(height: 2),
                        Text(
                          visitor.company!,
                          style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ] else if (visitor.notes != null && visitor.notes!.trim().isNotEmpty) ...[
                        const SizedBox(height: 2),
                        Text(
                          visitor.notes!,
                          style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ],
                  ),
                ),
                if (visitor.vehicleNumber != null && visitor.vehicleNumber!.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 4,
                          height: 12,
                          decoration: BoxDecoration(
                            color: const Color(0xFF2563EB),
                            borderRadius: BorderRadius.circular(1),
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          visitor.vehicleNumber!,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFFFBBF24),
                            fontFamily: 'monospace',
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),

            const SizedBox(height: 8),

            // Time & Meta info row
            Row(
              children: [
                const Icon(Icons.access_time_rounded, size: 14, color: Color(0xFF94A3B8)),
                const SizedBox(width: 4),
                Text(
                  timeStr,
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                ),
                if (visitor.phone.isNotEmpty) ...[
                  const SizedBox(width: 12),
                  const Icon(Icons.phone_iphone_rounded, size: 14, color: Color(0xFF94A3B8)),
                  const SizedBox(width: 4),
                  Text(
                    visitor.phone,
                    style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                  ),
                ],
              ],
            ),

            if (_isOverstayed) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEE2E2),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: const Color(0xFFEF4444)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.warning_amber_rounded, size: 13, color: Color(0xFFDC2626)),
                    const SizedBox(width: 4),
                    Text(
                      '⚠️ ${tr.get('overstay_warning')}',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFFDC2626)),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 12),
            const Divider(height: 1, color: Color(0xFFE2E8F0)),
            const SizedBox(height: 10),

            // Action Buttons Strip (Big, colorful, 1-tap guard friendly)
            Row(
              children: [
                // Call Resident Button (Green)
                if (visitor.phone.isNotEmpty)
                  Expanded(
                    flex: 1,
                    child: OutlinedButton.icon(
                      onPressed: () => _makeCall(visitor.phone),
                      icon: const Icon(Icons.phone_rounded, size: 15),
                      label: Text(tr.get('call_resident')),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF059669),
                        side: const BorderSide(color: Color(0xFF10B981), width: 1.5),
                        backgroundColor: const Color(0xFFECFDF5),
                        minimumSize: const Size(0, 38),
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ),

                if (visitor.phone.isNotEmpty) const SizedBox(width: 8),

                // Primary Gate Action Button
                if (_status == 'inside')
                  Expanded(
                    flex: 1,
                    child: ElevatedButton.icon(
                      onPressed: onMarkOut,
                      icon: const Icon(Icons.logout_rounded, size: 15),
                      label: Text(tr.get('mark_exit')),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEF4444),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        minimumSize: const Size(0, 38),
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                      ),
                    ),
                  )
                else if (_status == 'pending')
                  Expanded(
                    flex: 1,
                    child: ElevatedButton.icon(
                      onPressed: onApprove,
                      icon: const Icon(Icons.check_circle_rounded, size: 15),
                      label: Text(tr.get('allow_entry')),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        minimumSize: const Size(0, 38),
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                      ),
                    ),
                  )
                else if (_status == 'approved')
                  Expanded(
                    flex: 1,
                    child: ElevatedButton.icon(
                      onPressed: onApprove,
                      icon: const Icon(Icons.login_rounded, size: 15),
                      label: Text(tr.get('check_in')),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2563EB),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        minimumSize: const Size(0, 38),
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
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

class StatusBadge extends StatelessWidget {
  final String status;
  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;

    switch (status.toLowerCase()) {
      case 'inside':
        bg = const Color(0xFFDCFCE7);
        fg = const Color(0xFF15803D);
        label = 'INSIDE';
        break;
      case 'left':
      case 'exited':
        bg = const Color(0xFFF1F5F9);
        fg = const Color(0xFF64748B);
        label = 'EXITED';
        break;
      case 'approved':
        bg = const Color(0xFFE0F2FE);
        fg = const Color(0xFF0284C7);
        label = 'APPROVED';
        break;
      case 'denied':
        bg = const Color(0xFFFEE2E2);
        fg = const Color(0xFFDC2626);
        label = 'DENIED';
        break;
      case 'pending':
        bg = const Color(0xFFFEF3C7);
        fg = const Color(0xFFD97706);
        label = 'WAITING';
        break;
      default:
        bg = const Color(0xFFF1F5F9);
        fg = const Color(0xFF64748B);
        label = status.toUpperCase();
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 9.5,
          fontWeight: FontWeight.w800,
          color: fg,
          letterSpacing: 0.4,
        ),
      ),
    );
  }
}
