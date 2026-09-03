import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';

class HomeServicesSection extends StatelessWidget {
  final VoidCallback onSelectCategory;
  final void Function(String serviceName, String price) onBookService;

  const HomeServicesSection({
    super.key,
    required this.onSelectCategory,
    required this.onBookService,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(),
        const SizedBox(height: AppSpacing.sm),

        Row(
          children: [
            Expanded(
              child: _buildServiceQuickCard(
                title: 'Electrician',
                price: '₹199 visit',
                icon: Icons.electrical_services_rounded,
                color: const Color(0xFFF59E0B),
                onTap: () => onBookService('Certified Electrician', '₹199 visit fee'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildServiceQuickCard(
                title: 'Plumber',
                price: '₹199 visit',
                icon: Icons.plumbing_rounded,
                color: const Color(0xFF0284C7),
                onTap: () => onBookService('Certified Plumber', '₹199 visit fee'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _buildServiceQuickCard(
                title: 'AC Service',
                price: '₹499 per unit',
                icon: Icons.ac_unit_rounded,
                color: const Color(0xFF10B981),
                onTap: () => onBookService('AC Deep Clean & Service', '₹499 per unit'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildServiceQuickCard(
                title: 'Home Salon',
                price: '₹599 starts',
                icon: Icons.spa_rounded,
                color: const Color(0xFFEC4899),
                onTap: () => onBookService('Doorstep Beautician & Salon', '₹599 starts'),
              ),
            ),
          ],
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
            color: const Color(0xFFD97706).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: const Text(
            'FIXED RATES',
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.w800,
              color: Color(0xFFD97706),
              letterSpacing: 0.4,
            ),
          ),
        ),
        const SizedBox(width: 8),
        const Expanded(
          child: Text(
            'Doorstep Repairs & Certified Experts',
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

  Widget _buildServiceQuickCard({
    required String title,
    required String price,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
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
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    price,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
