import 'package:flutter/material.dart';
import 'book_maid_salon_sheet.dart';

class SalonBeauticianSection extends StatelessWidget {
  const SalonBeauticianSection({super.key});

  static const List<Map<String, dynamic>> _salonPackages = [
    {
      'id': 'sal_1',
      'title': 'Glow Facial & Cleanup',
      'category': 'Women’s Care',
      'duration': '60 mins',
      'price': '₹899',
      'originalPrice': '₹1,299',
      'rating': 4.9,
      'includes': ['Deep cleansing', 'Fruit scrub', 'Steam & extraction', 'Glow mask'],
      'image': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=300',
    },
    {
      'id': 'sal_2',
      'title': 'Full Body Waxing & Mani-Pedi',
      'category': 'Women’s Care',
      'duration': '90 mins',
      'price': '₹1,499',
      'originalPrice': '₹2,199',
      'rating': 4.8,
      'includes': ['Rica chocolate wax', 'Cuticle care', 'Foot scrub & massage'],
      'image': 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=300',
    },
    {
      'id': 'sal_3',
      'title': 'Men’s Grooming & Head Massage',
      'category': 'Men’s Care',
      'duration': '45 mins',
      'price': '₹499',
      'originalPrice': '₹799',
      'rating': 4.9,
      'includes': ['Haircut & styling', 'Beard trim & shape', 'Herbal head oil massage'],
      'image': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300',
    },
    {
      'id': 'sal_4',
      'title': 'Relaxing Stress Relief Massage',
      'category': 'Unisex Wellness',
      'duration': '60 mins',
      'price': '₹1,199',
      'originalPrice': '₹1,699',
      'rating': 5.0,
      'includes': ['Aroma essential oils', 'Shoulder & back pressure', 'Steam towel wrap'],
      'image': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300',
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
              'Doorstep Salon & Beautician',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
                fontSize: 16,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: BorderRadius.circular(999),
              ),
              child: const Text(
                '✨ 100% Hygienic Kits',
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFFB45309),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _salonPackages.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final pkg = _salonPackages[index];
            return _SalonCard(pkg: pkg);
          },
        ),
      ],
    );
  }
}

class _SalonCard extends StatelessWidget {
  final Map<String, dynamic> pkg;
  const _SalonCard({required this.pkg});

  @override
  Widget build(BuildContext context) {
    final includes = (pkg['includes'] as List<String>?) ?? [];

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              pkg['image'] as String,
              width: 85,
              height: 95,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        pkg['category'] as String,
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
                      ),
                    ),
                    Row(
                      children: [
                        const Icon(Icons.star_rounded, size: 15, color: Color(0xFFF59E0B)),
                        const SizedBox(width: 2),
                        Text(
                          '${pkg['rating']}',
                          style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  pkg['title'] as String,
                  style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 3),
                Text(
                  '⏱️ ${pkg['duration']}  •  Single-use kit',
                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 6),
                Text(
                  includes.join(' • '),
                  style: const TextStyle(fontSize: 11, color: Color(0xFF475569)),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(
                          pkg['price'] as String,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          pkg['originalPrice'] as String,
                          style: const TextStyle(
                            fontSize: 11.5,
                            color: Color(0xFF94A3B8),
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                    ),
                    ElevatedButton(
                      onPressed: () {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (_) => BookMaidSalonSheet(
                            title: 'Book ${pkg['title']}',
                            subtitle: '${pkg['price']} • ${pkg['duration']}',
                            type: 'salon',
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0EA5E9),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        minimumSize: Size.zero,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: const Text('Book Slot', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Colors.white)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
