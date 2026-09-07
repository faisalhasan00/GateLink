import 'package:flutter/material.dart';
import '../../domain/models/helper_model.dart';

class HelperGateLogItem extends StatelessWidget {
  final HelperLogModel log;

  const HelperGateLogItem({super.key, required this.log});

  @override
  Widget build(BuildContext context) {
    final isEntry = log.type == 'ENTRY';

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isEntry
                  ? const Color(0xFFDCFCE7)
                  : const Color(0xFFFEE2E2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              isEntry
                  ? Icons.arrow_downward_rounded
                  : Icons.arrow_upward_rounded,
              color: isEntry
                  ? const Color(0xFF16A34A)
                  : const Color(0xFFDC2626),
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${log.helperName} (${log.helperType})',
                  style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: Color(0xFF0F172A)),
                ),
                Text(
                  'Flat ${log.flatNumber} • Gate: ${log.gateName} (by ${log.guardName})',
                  style: const TextStyle(
                      fontSize: 11, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
          Text(
            log.formattedTime,
            style: const TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 12,
                color: Color(0xFF1E3A8A)),
          ),
        ],
      ),
    );
  }
}
