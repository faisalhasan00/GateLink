import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';

class ComplaintDescriptionCard extends StatelessWidget {
  final String description;
  final String? photoUrl;

  const ComplaintDescriptionCard({
    super.key,
    required this.description,
    this.photoUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'ISSUE DESCRIPTION',
            style: TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.8,
              color: Color(0xFF64748B),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description.isNotEmpty
                ? description
                : 'No detailed description provided.',
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFF334155),
              height: 1.45,
            ),
          ),
          if (photoUrl != null && photoUrl!.isNotEmpty) ...[
            const SizedBox(height: 16),
            const Text(
              'ATTACHED PHOTO PROOF',
              style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
                color: Color(0xFF64748B),
              ),
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                photoUrl!,
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  height: 120,
                  color: const Color(0xFFF1F5F9),
                  child: const Center(
                    child: Icon(
                      Icons.broken_image_rounded,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
