import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class GuardVisitorInfoTable extends StatelessWidget {
  final Map<String, dynamic> data;

  const GuardVisitorInfoTable({
    super.key,
    required this.data,
  });

  @override
  Widget build(BuildContext context) {
    final type = data['type'] ?? 'Guest';
    final phone = data['phone'] ?? 'N/A';
    final hostFlat = data['hostFlat'] ?? 'N/A';
    final residentName = data['hostResidentName'] ?? 'Resident';
    final vehicleNumber = data['vehicleNumber'] ?? 'None';
    final vehicleType = data['vehicleType'] ?? '4-Wheeler';
    final gender = data['gender'] ?? 'Not Specified';
    final gateName = data['gateName'] ?? 'Gate 1 — Main Entry';
    final createdDate = data['createdDate'] ?? '';
    final entryTime = data['entryTime'];
    final exitTime = data['exitTime'];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _DetailRow(label: 'Visitor Category', value: type),
          _DetailRow(label: 'Mobile Number', value: phone),
          _DetailRow(label: 'Gender', value: gender),
          _DetailRow(label: 'Destination Flat', value: hostFlat),
          _DetailRow(label: 'Resident Name', value: residentName),
          _DetailRow(
            label: 'Vehicle Info',
            value: vehicleNumber.isEmpty ? 'None' : '$vehicleNumber ($vehicleType)',
          ),
          _DetailRow(label: 'Gate Name', value: gateName),
          _DetailRow(label: 'Logged At', value: createdDate.isEmpty ? 'Just now' : createdDate),
          if (entryTime != null) _DetailRow(label: 'Entry Timestamp', value: entryTime),
          if (exitTime != null) _DetailRow(label: 'Exit Timestamp', value: exitTime),
          if (data['durationString'] != null)
            _DetailRow(label: 'Visit Duration', value: data['durationString'] as String),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}
