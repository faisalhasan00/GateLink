import 'package:flutter/material.dart';

class InteriorPortfolioView extends StatelessWidget {
  const InteriorPortfolioView({super.key});

  static const List<Map<String, dynamic>> _portfolio = [
    {
      'title': '3 BHK Luxury Modern Minimalist',
      'society': 'Palm Meadows, Tower B-402',
      'timeline': 'Delivered in 38 Days',
      'image': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
    },
    {
      'title': 'Italian Island Modular Kitchen',
      'society': 'Palm Meadows, Tower A-1201',
      'timeline': 'Delivered in 19 Days',
      'image': 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=500',
    },
    {
      'title': 'Warm Wooden Aesthetic Master Bedroom',
      'society': 'Palm Meadows, Tower C-704',
      'timeline': 'Delivered in 22 Days',
      'image': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500',
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
              'Real Completed Flats Lookbook',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
                fontSize: 16,
              ),
            ),
            const Text(
              '100% Authentic Photos',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 220,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: _portfolio.length,
            separatorBuilder: (_, __) => const SizedBox(width: 14),
            itemBuilder: (context, index) {
              final item = _portfolio[index];
              return Container(
                width: 260,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  image: DecorationImage(
                    image: NetworkImage(item['image'] as String),
                    fit: BoxFit.cover,
                    colorFilter: ColorFilter.mode(
                      Colors.black.withOpacity(0.4),
                      BlendMode.darken,
                    ),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(14),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        item['timeline'] as String,
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item['title'] as String,
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white),
                          maxLines: 2,
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            const Icon(Icons.location_on_rounded, size: 12, color: Color(0xFF38BDF8)),
                            const SizedBox(width: 3),
                            Expanded(
                              child: Text(
                                item['society'] as String,
                                style: const TextStyle(fontSize: 11, color: Color(0xFFE2E8F0)),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
