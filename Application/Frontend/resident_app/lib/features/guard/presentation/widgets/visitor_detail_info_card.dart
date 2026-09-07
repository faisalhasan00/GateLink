import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../visitor/domain/models/visitor_model.dart';

class VisitorDetailInfoCard extends StatelessWidget {
  final VisitorModel visitor;

  const VisitorDetailInfoCard({
    super.key,
    required this.visitor,
  });

  @override
  Widget build(BuildContext context) {
    final type = visitor.type;
    final phone = visitor.phone;
    final gender = visitor.gender ?? 'Not Specified';
    final hostFlat = visitor.hostFlat;
    final residentName = visitor.hostResidentName ?? 'Resident';
    final vehicleNumber = visitor.vehicleNumber ?? 'None';
    final vehicleType = visitor.vehicleType ?? '4-Wheeler';
    final gateName = visitor.gateName ?? 'Gate 1 — Main Entry';
    final createdDate = visitor.createdDate ?? '';
    final entryTime = visitor.entryTime;
    final exitTime = visitor.exitTime;

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
          _DetailRow(
            label: 'Logged At',
            value: createdDate.isEmpty ? 'Just now' : createdDate,
          ),
          if (entryTime != null)
            _DetailRow(label: 'Entry Timestamp', value: entryTime),
          if (exitTime != null)
            _DetailRow(label: 'Exit Timestamp', value: exitTime),
          if (visitor.durationString != null)
            _DetailRow(label: 'Visit Duration', value: visitor.durationString!),
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
          Text(
            label,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
