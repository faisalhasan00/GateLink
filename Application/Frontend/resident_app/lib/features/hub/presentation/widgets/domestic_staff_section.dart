import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';

class DomesticStaffSection extends StatelessWidget {
  final VoidCallback onSelectCategory;
  final void Function(String name, String role) onHireStaff;

  const DomesticStaffSection({
    super.key,
    required this.onSelectCategory,
    required this.onHireStaff,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(),
        const SizedBox(height: AppSpacing.sm),

        _buildStaffCard(
          name: 'Sunita Sharma',
          role: 'All-Rounder House Maid & Cook',
          rating: '4.9 ★',
          reviews: '18 Flat Recommendations',
          timing: 'Available: Morning (7 AM - 11 AM)',
          onHire: () => onHireStaff('Sunita Sharma', 'All-Rounder House Maid & Cook'),
        ),
        const SizedBox(height: AppSpacing.sm),

        _buildStaffCard(
          name: 'Rameshwar Yadav',
          role: 'Certified Private Driver',
          rating: '4.8 ★',
          reviews: '9 Flat Recommendations',
          timing: 'Available: Full Day (8 AM - 7 PM)',
          onHire: () => onHireStaff('Rameshwar Yadav', 'Certified Private Driver'),
        ),
      ],
    );
  }

  Widget _buildSectionHeader() {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(
            color: const Color(0xFF0284C7).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: const Text(
            'GATE-AUTHENTICATED',
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0284C7),
              letterSpacing: 0.4,
            ),
          ),
        ),
        const SizedBox(width: 8),
        const Expanded(
          child: Text(
            'Hire Verified Domestic Staff',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
          ),
        ),
        InkWell(
          onTap: onSelectCategory,
          child: const Text(
            'View All',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E3A8A),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStaffCard({
    required String name,
    required String role,
    required String rating,
    required String reviews,
    required String timing,
    required VoidCallback onHire,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 24,
            backgroundColor: Color(0xFFE0F2FE),
            child: Icon(Icons.person_rounded, color: Color(0xFF0284C7), size: 28),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.verified_rounded,
                        size: 14, color: Color(0xFF0284C7)),
                  ],
                ),
                Text(
                  role,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0284C7),
                  ),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Text(
                      rating,
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFFD97706),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '($reviews)',
                      style: const TextStyle(
                          fontSize: 10, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
                Text(
                  timing,
                  style: const TextStyle(
                      fontSize: 10, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: onHire,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0284C7),
              foregroundColor: Colors.white,
              elevation: 0,
              padding:
                  const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text(
              'Hire / Info',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
            ),
          ),
        ],
      ),
    );
  }
}
