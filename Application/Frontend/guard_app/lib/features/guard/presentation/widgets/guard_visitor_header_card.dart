import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class GuardVisitorHeaderCard extends StatelessWidget {
  final String name;
  final String company;
  final String status;
  final String? photoUrl;
  final bool isInside;
  final bool isApproved;
  final bool isRejected;

  const GuardVisitorHeaderCard({
    super.key,
    required this.name,
    required this.company,
    required this.status,
    required this.photoUrl,
    required this.isInside,
    required this.isApproved,
    required this.isRejected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isRejected
              ? [AppColors.error, const Color(0xFF991B1B)]
              : isApproved || isInside
                  ? [AppColors.success, const Color(0xFF047857)]
                  : [const Color(0xFF0F1923), const Color(0xFF1A2A3A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppRadius.xl),
      ),
      child: Column(
        children: [
          if (photoUrl != null && photoUrl!.isNotEmpty)
            ClipRRect(
              borderRadius: BorderRadius.circular(50),
              child: Image.network(photoUrl!, width: 80, height: 80, fit: BoxFit.cover),
            )
          else
            CircleAvatar(
              radius: 36,
              backgroundColor: Colors.white.withValues(alpha: 0.2),
              child: Text(
                name.isNotEmpty ? name[0].toUpperCase() : 'V',
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
          const SizedBox(height: 12),
          Text(name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
          if (company.isNotEmpty) ...[
            const SizedBox(height: 2),
            Text(company, style: const TextStyle(fontSize: 13, color: Colors.white70)),
          ],
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(AppRadius.full),
            ),
            child: Text(
              status.toUpperCase().replaceAll('_', ' '),
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
