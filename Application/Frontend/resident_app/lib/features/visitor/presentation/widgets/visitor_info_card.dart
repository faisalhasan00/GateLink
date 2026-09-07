import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/visitor_model.dart';

class VisitorInfoCard extends StatelessWidget {
  final VisitorModel visitor;

  const VisitorInfoCard({super.key, required this.visitor});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          _InfoRow(
            icon: Icons.phone_rounded,
            label: 'Mobile',
            value: visitor.phone,
            color: AppColors.success,
          ),
          const Divider(height: 1, indent: 56),
          _InfoRow(
            icon: Icons.category_rounded,
            label: 'Entry Type',
            value: visitor.type,
            color: AppColors.amenity,
          ),
          const Divider(height: 1, indent: 56),
          _InfoRow(
            icon: Icons.directions_car_rounded,
            label: 'Vehicle Number',
            value: visitor.vehicleNumber ?? 'None',
            color: AppColors.warning,
          ),
          const Divider(height: 1, indent: 56),
          _InfoRow(
            icon: Icons.door_front_door_rounded,
            label: 'Visiting Flat',
            value: visitor.hostFlat,
            color: AppColors.visitor,
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 18, color: color),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
