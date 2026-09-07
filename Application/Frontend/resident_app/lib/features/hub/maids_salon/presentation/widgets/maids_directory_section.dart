import 'package:flutter/material.dart';
import 'package:societysphere/core/theme/app_colors.dart';
import 'book_maid_salon_sheet.dart';

class MaidsDirectorySection extends StatelessWidget {
  const MaidsDirectorySection({super.key});

  static const List<Map<String, dynamic>> _sampleStaff = [
    {
      'id': 'st_1',
      'name': 'Sunita Devi',
      'role': 'Housekeeper & Maid',
      'rating': 4.9,
      'reviewsCount': 28,
      'experience': '6 yrs exp',
      'flatsActive': 'Works in 4 flats (Tower A & B)',
      'rate': '₹2,500/mo (1 BHK)',
      'skills': ['Floor Mopping', 'Utensils', 'Dusting', 'Ironing'],
      'verified': true,
      'available': true,
      'image': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      'id': 'st_2',
      'name': 'Ramesh Kumar',
      'role': 'Cook & Chef',
      'rating': 4.8,
      'reviewsCount': 42,
      'experience': '8 yrs exp',
      'flatsActive': 'Works in 3 flats (Tower C)',
      'rate': '₹4,000/mo (2 meals)',
      'skills': ['North Indian', 'South Indian', 'Diet Meals', 'Baking'],
      'verified': true,
      'available': true,
      'image': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150',
    },
    {
      'id': 'st_3',
      'name': 'Anil Sharma',
      'role': 'Personal Driver & Car Care',
      'rating': 4.9,
      'reviewsCount': 19,
      'experience': '10 yrs exp',
      'flatsActive': 'Works in 2 flats (Tower D)',
      'rate': '₹8,000/mo (Full-time)',
      'skills': ['Automatic & Manual', 'City Navigation', 'Daily Car Wash'],
      'verified': true,
      'available': true,
      'image': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
    {
      'id': 'st_4',
      'name': 'Meena Kumari',
      'role': 'Nanny & Babysitter',
      'rating': 5.0,
      'reviewsCount': 15,
      'experience': '5 yrs exp',
      'flatsActive': 'Works in 2 flats (Tower B)',
      'rate': '₹5,500/mo (4 hrs/day)',
      'skills': ['Infant Care', 'Toddler Activities', 'First Aid Certified'],
      'verified': true,
      'available': false,
      'image': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
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
              'Verified Society Helpers',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
                fontSize: 16,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: const Color(0xFFDCFCE7),
                borderRadius: BorderRadius.circular(999),
              ),
              child: const Text(
                '🛡️ Police Verified',
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF15803D),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _sampleStaff.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final staff = _sampleStaff[index];
            return _StaffCard(staff: staff);
          },
        ),
      ],
    );
  }
}

class _StaffCard extends StatelessWidget {
  final Map<String, dynamic> staff;
  const _StaffCard({required this.staff});

  @override
  Widget build(BuildContext context) {
    final skills = (staff['skills'] as List<String>?) ?? [];

    return Container(
      padding: const EdgeInsets.all(16),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: const Color(0xFFE2E8F0),
                backgroundImage: NetworkImage(staff['image'] as String),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            staff['name'] as String,
                            style: const TextStyle(
                              fontSize: 15.5,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Icon(Icons.verified_rounded, size: 16, color: Color(0xFF0EA5E9)),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      staff['role'] as String,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF64748B),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.star_rounded, size: 16, color: Color(0xFFF59E0B)),
                        const SizedBox(width: 3),
                        Text(
                          '${staff['rating']} (${staff['reviewsCount']} ratings)',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF334155),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '•  ${staff['experience']}',
                          style: const TextStyle(
                            fontSize: 11.5,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                const Icon(Icons.location_city_rounded, size: 14, color: Color(0xFF64748B)),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    staff['flatsActive'] as String,
                    style: const TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF475569),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: skills.map((s) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                s,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
              ),
            )).toList(),
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Starting from', style: TextStyle(fontSize: 10.5, color: Color(0xFF94A3B8))),
                  Text(
                    staff['rate'] as String,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
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
                      title: 'Hire ${staff['name']}',
                      subtitle: staff['role'] as String,
                      type: 'helper',
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: const Text(
                  'Contact / Hire',
                  style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Colors.white),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
