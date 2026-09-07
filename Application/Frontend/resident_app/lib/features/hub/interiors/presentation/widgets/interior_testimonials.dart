import 'package:flutter/material.dart';

class InteriorTestimonials extends StatelessWidget {
  const InteriorTestimonials({super.key});

  static const List<Map<String, dynamic>> _reviews = [
    {
      'name': 'Pooja & Rohan Sharma',
      'flat': 'Flat B-402, Palm Meadows',
      'rating': 5,
      'comment': 'The team finished our complete 3 BHK interior in 38 days without a single noise complaint from RWA. The kitchen finish is exceptional!',
      'tag': 'Complete 3 BHK Turnkey',
    },
    {
      'name': 'Vikram Mehra',
      'flat': 'Flat A-804, Palm Meadows',
      'rating': 5,
      'comment': 'Saved almost ₹80,000 compared to external market quotes. Acrylic modular kitchen with Hafele fittings was installed perfectly.',
      'tag': 'Modular Kitchen & TV Unit',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'What Neighbors Are Saying',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
            fontSize: 16,
          ),
        ),
        const SizedBox(height: 12),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _reviews.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final rev = _reviews[index];
            return Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(rev['name'] as String, style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                          Text(rev['flat'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                        ],
                      ),
                      Row(
                        children: List.generate(
                          rev['rating'] as int,
                          (_) => const Icon(Icons.star_rounded, size: 16, color: Color(0xFFF59E0B)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '"${rev['comment']}"',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF334155), height: 1.35, fontStyle: FontStyle.italic),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE0F2FE),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      rev['tag'] as String,
                      style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Color(0xFF0369A1)),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
