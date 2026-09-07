import 'package:flutter/material.dart';
import 'service_booking_sheet.dart';

class HomeServicesGrid extends StatelessWidget {
  const HomeServicesGrid({super.key});

  static const List<Map<String, dynamic>> _serviceCategories = [
    {
      'id': 'srv_elec',
      'title': 'Electrician',
      'icon': Icons.bolt_rounded,
      'color': Color(0xFFF59E0B),
      'bg': Color(0xFFFEF3C7),
      'pricing': 'Inspection from ₹149',
      'popularTasks': 'Fan install, Switchboard, MCB fix, Inverter wiring',
      'availableExperts': '4 electricians nearby',
    },
    {
      'id': 'srv_plumb',
      'title': 'Plumber',
      'icon': Icons.water_drop_rounded,
      'color': Color(0xFF0EA5E9),
      'bg': Color(0xFFE0F2FE),
      'pricing': 'Inspection from ₹149',
      'popularTasks': 'Tap leak, Flush repair, Blocked pipe, Water purifier',
      'availableExperts': '3 plumbers nearby',
    },
    {
      'id': 'srv_paint',
      'title': 'Painter & Waterproofing',
      'icon': Icons.format_paint_rounded,
      'color': Color(0xFF8B5CF6),
      'bg': Color(0xFFEDE9FE),
      'pricing': 'Custom quote (Free visit)',
      'popularTasks': 'Room repaint, Balcony waterproofing, Texture wall',
      'availableExperts': 'Free in-home estimate',
    },
    {
      'id': 'srv_carp',
      'title': 'Carpenter',
      'icon': Icons.handyman_rounded,
      'color': Color(0xFFEA580C),
      'bg': Color(0xFFFFEDD5),
      'pricing': 'Inspection from ₹199',
      'popularTasks': 'Door lock fix, Modular hinge, Furniture assembly',
      'availableExperts': '2 carpenters nearby',
    },
    {
      'id': 'srv_ac',
      'title': 'AC & Appliance Repair',
      'icon': Icons.ac_unit_rounded,
      'color': Color(0xFF0284C7),
      'bg': Color(0xFFBAE6FD),
      'pricing': 'Servicing from ₹499',
      'popularTasks': 'Foam jet wash, Gas refill, Washing machine, Fridge',
      'availableExperts': 'Same-day slot available',
    },
    {
      'id': 'srv_clean',
      'title': 'Deep Cleaning & Pest Control',
      'icon': Icons.cleaning_services_rounded,
      'color': Color(0xFF10B981),
      'bg': Color(0xFFD1FAE5),
      'pricing': 'Packages from ₹899',
      'popularTasks': 'Bathroom deep clean, Kitchen degrease, Cockroach spray',
      'availableExperts': 'Certified eco-friendly chemicals',
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
              'Standardized Home Repairs',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
                fontSize: 16,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: const Color(0xFFE0F2FE),
                borderRadius: BorderRadius.circular(999),
              ),
              child: const Text(
                '⚡ Fixed Rate Card',
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF0369A1),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _serviceCategories.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final srv = _serviceCategories[index];
            return _ServiceItemCard(srv: srv);
          },
        ),
      ],
    );
  }
}

class _ServiceItemCard extends StatelessWidget {
  final Map<String, dynamic> srv;
  const _ServiceItemCard({required this.srv});

  @override
  Widget build(BuildContext context) {
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
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: srv['bg'] as Color,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              srv['icon'] as IconData,
              size: 26,
              color: srv['color'] as Color,
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
                    Text(
                      srv['title'] as String,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                    ),
                    Text(
                      srv['pricing'] as String,
                      style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: srv['color'] as Color),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  srv['popularTasks'] as String,
                  style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B), height: 1.3),
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '📍 ${srv['availableExperts']}',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF059669)),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (_) => ServiceBookingSheet(service: srv),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E3A8A),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        minimumSize: Size.zero,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: const Text('Book Now', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Colors.white)),
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
