import 'package:flutter/material.dart';
import 'book_flat_consultation_sheet.dart';

class InteriorPackagesGrid extends StatelessWidget {
  const InteriorPackagesGrid({super.key});

  static const List<Map<String, dynamic>> _packages = [
    {
      'id': 'pkg_kitchen',
      'title': 'Smart Modular Kitchen',
      'tagline': 'Anti-scratch acrylic, soft-close Blum hinges, quartz top',
      'startingPrice': '₹1.75 Lakhs',
      'duration': '21 Days Delivery',
      'badge': 'Best Seller',
      'image': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400',
      'items': ['L-Shape/Parallel layout', 'Tandem drawer boxes', 'Spice pull-out rack', 'Overhead profile LED lights'],
    },
    {
      'id': 'pkg_bedroom',
      'title': 'Master Bedroom Suite',
      'tagline': 'Floor-to-ceiling wardrobe + Backlit headboard + Dressing unit',
      'startingPrice': '₹1.95 Lakhs',
      'duration': '25 Days Delivery',
      'badge': 'Popular',
      'image': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400',
      'items': ['Lacquer glass sliding wardrobe', 'Floating side tables', 'Fluted panel accent wall', 'Vanity mirror with LED'],
    },
    {
      'id': 'pkg_living',
      'title': 'Contemporary Living Room',
      'tagline': 'Floating TV media console + Gypsum false ceiling + Ambient lighting',
      'startingPrice': '₹1.45 Lakhs',
      'duration': '18 Days Delivery',
      'badge': 'Trending',
      'image': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400',
      'items': ['Large format TV console', 'Cove lighting false ceiling', 'Vertical charcoal louvers', 'Smart switch integration'],
    },
    {
      'id': 'pkg_turnkey',
      'title': 'Complete 2BHK/3BHK Turnkey',
      'tagline': 'End-to-end full flat transformation with furniture & decor',
      'startingPrice': '₹4.25 Lakhs',
      'duration': '45 Days Guaranteed',
      'badge': 'Turnkey All-in-One',
      'image': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400',
      'items': ['Modular kitchen + 2 Bedrooms', 'Living room + Dining unit', 'Complete false ceiling & painting', '10-year warranty certificate'],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Curated Interior Packages',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
                fontSize: 16,
              ),
            ),
            const Text(
              '10-Year Warranty',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF059669)),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _packages.length,
          separatorBuilder: (_, __) => const SizedBox(height: 14),
          itemBuilder: (context, index) {
            final pkg = _packages[index];
            return _PackageCard(pkg: pkg);
          },
        ),
      ],
    );
  }
}

class _PackageCard extends StatelessWidget {
  final Map<String, dynamic> pkg;
  const _PackageCard({required this.pkg});

  @override
  Widget build(BuildContext context) {
    final items = (pkg['items'] as List<String>?) ?? [];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              Image.network(
                pkg['image'] as String,
                height: 150,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E3A8A),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    pkg['badge'] as String,
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                ),
              ),
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.65),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    pkg['duration'] as String,
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        pkg['title'] as String,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                      ),
                    ),
                    Text(
                      pkg['startingPrice'] as String,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF0284C7)),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  pkg['tagline'] as String,
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.3),
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: items.map((it) => Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.check_circle_rounded, size: 13, color: Color(0xFF10B981)),
                      const SizedBox(width: 4),
                      Text(it, style: const TextStyle(fontSize: 11, color: Color(0xFF334155), fontWeight: FontWeight.w500)),
                    ],
                  )).toList(),
                ),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (_) => BookFlatConsultationSheet(
                          bhk: 'Custom Flat',
                          scope: pkg['title'] as String,
                          finish: 'Premium',
                          estimatedPrice: pkg['startingPrice'] as String,
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: const Text('Book Free In-Flat Consultation', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: Colors.white)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
