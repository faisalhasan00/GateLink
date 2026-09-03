import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';

class InteriorsFurnitureSection extends StatelessWidget {
  final VoidCallback onSelectCategory;
  final void Function(String packageTitle) onBookConsultation;

  const InteriorsFurnitureSection({
    super.key,
    required this.onSelectCategory,
    required this.onBookConsultation,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(),
        const SizedBox(height: AppSpacing.sm),

        // Hero Interior Package Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF581C87), Color(0xFF7E22CE)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF7E22CE).withValues(alpha: 0.25),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'EXCLUSIVE SOCIETY PARTNER OFFER • 15% OFF',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Complete 2BHK / 3BHK Modular Interiors',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Modular Kitchen, Master Bedroom Wardrobes, TV Unit, False Ceiling & Premium Sofa Sets.',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 11,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Packages from ₹2.99 Lakhs',
                    style: TextStyle(
                      color: Color(0xFFE9D5FF),
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => onBookConsultation('Full Modular 2BHK/3BHK Package'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF581C87),
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      'Book Free Consultation',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.sm),

        // Furniture Horizontal Carousel
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          child: Row(
            children: [
              _buildFurnitureCard(
                title: 'Scandinavian 3-Seater Velvet Sofa',
                price: '₹24,999',
                originalPrice: '₹34,000',
                tag: 'LIVING ROOM',
                icon: Icons.weekend_rounded,
                iconColor: const Color(0xFF7E22CE),
                onTap: () => onBookConsultation('Scandinavian 3-Seater Velvet Sofa'),
              ),
              const SizedBox(width: 12),
              _buildFurnitureCard(
                title: 'Smart Hydraulic King Bed with Storage',
                price: '₹32,499',
                originalPrice: '₹45,000',
                tag: 'BEDROOM',
                icon: Icons.bed_rounded,
                iconColor: const Color(0xFF0284C7),
                onTap: () => onBookConsultation('Smart Hydraulic King Bed'),
              ),
              const SizedBox(width: 12),
              _buildFurnitureCard(
                title: 'Acrylic Finish Modular L-Kitchen',
                price: '₹1.15 Lakhs',
                originalPrice: '₹1.40 Lakhs',
                tag: 'KITCHEN',
                icon: Icons.kitchen_rounded,
                iconColor: const Color(0xFFD97706),
                onTap: () => onBookConsultation('Acrylic Finish Modular L-Kitchen'),
              ),
            ],
          ),
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
            color: const Color(0xFF9333EA).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: const Text(
            'CURATED FOR FLATS',
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.w800,
              color: Color(0xFF9333EA),
              letterSpacing: 0.4,
            ),
          ),
        ),
        const SizedBox(width: 8),
        const Expanded(
          child: Text(
            'Home Interiors & Designer Furniture',
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

  Widget _buildFurnitureCard({
    required String title,
    required String price,
    required String originalPrice,
    required String tag,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return Container(
      width: 200,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 90,
            width: double.infinity,
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Icon(icon, size: 44, color: iconColor),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              tag,
              style: const TextStyle(
                fontSize: 8,
                fontWeight: FontWeight.w800,
                color: Color(0xFF475569),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Text(
                price,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(width: 4),
              Text(
                originalPrice,
                style: const TextStyle(
                  fontSize: 10,
                  decoration: TextDecoration.lineThrough,
                  color: Color(0xFF94A3B8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            height: 32,
            child: OutlinedButton(
              onPressed: onTap,
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: iconColor),
                padding: EdgeInsets.zero,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Enquire / Quote',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: iconColor,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
