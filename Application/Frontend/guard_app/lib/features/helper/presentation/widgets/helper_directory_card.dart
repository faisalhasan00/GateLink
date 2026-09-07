import 'package:flutter/material.dart';
import '../../domain/models/helper_model.dart';

class HelperDirectoryCard extends StatelessWidget {
  final HelperModel helper;
  final bool isProcessing;
  final VoidCallback onToggleAttendance;

  const HelperDirectoryCard({
    super.key,
    required this.helper,
    required this.isProcessing,
    required this.onToggleAttendance,
  });

  String _formatTimestamp(String isoString) {
    try {
      final dt = DateTime.parse(isoString).toLocal();
      final hour =
          dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
      final period = dt.hour >= 12 ? 'PM' : 'AM';
      final minute = dt.minute.toString().padLeft(2, '0');
      return '$hour:$minute $period';
    } catch (_) {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isInside = helper.isInside;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isInside
              ? const Color(0xFF86EFAC)
              : const Color(0xFFE2E8F0),
          width: isInside ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Avatar with live indicator badge
          Stack(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: isInside
                    ? const Color(0xFFDCFCE7)
                    : const Color(0xFFF1F5F9),
                child: Text(
                  helper.name.isNotEmpty
                      ? helper.name.substring(0, 1).toUpperCase()
                      : 'H',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: isInside
                        ? const Color(0xFF15803D)
                        : const Color(0xFF475569),
                  ),
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  width: 14,
                  height: 14,
                  decoration: BoxDecoration(
                    color: isInside
                        ? const Color(0xFF10B981)
                        : const Color(0xFF94A3B8),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 14),

          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        helper.name,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF0F172A),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Flat ${helper.flatNumber}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1D4ED8),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  '${helper.type} • ${helper.workingDays}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  isInside
                      ? '🟢 Inside since ${helper.lastCheckIn != null ? _formatTimestamp(helper.lastCheckIn!) : 'today'}'
                      : '⚪ Outside campus',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isInside
                        ? const Color(0xFF16A34A)
                        : const Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          ),

          // Quick In/Out Toggle Action Button
          SizedBox(
            height: 40,
            child: isProcessing
                ? const Center(
                    child: SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(strokeWidth: 2.5)))
                : ElevatedButton.icon(
                    onPressed: onToggleAttendance,
                    icon: Icon(
                      isInside
                          ? Icons.logout_rounded
                          : Icons.login_rounded,
                      size: 16,
                    ),
                    label: Text(
                      isInside ? 'Mark OUT' : 'Mark IN',
                      style: const TextStyle(
                          fontSize: 12, fontWeight: FontWeight.w800),
                    ),
                    style: ElevatedButton.styleFrom(
                      elevation: 0,
                      backgroundColor: isInside
                          ? const Color(0xFFEF4444)
                          : const Color(0xFF10B981),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
