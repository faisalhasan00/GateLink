import 'package:flutter/material.dart';
import 'snabbit_maid_booking_sheet.dart';

class MaidServicesCatalogSection extends StatelessWidget {
  const MaidServicesCatalogSection({super.key});

  static const List<Map<String, dynamic>> _quickChores = [
    {
      'id': 'chore_utensils',
      'title': 'Utensils & Sink Dishwashing',
      'subtitle': 'Spotless sink cleaning & utensil scrubbing with soap wash',
      'price': '₹99',
      'basePriceNum': 99,
      'duration': '30-45 mins',
      'icon': Icons.soup_kitchen_rounded,
      'color': Color(0xFF0EA5E9),
      'bg': Color(0xFFE0F2FE),
      'popular': true,
      'tag': 'Most Booked',
    },
    {
      'id': 'chore_mopping',
      'title': 'Floor Sweeping & Mopping (Jhadu-Pocha)',
      'subtitle': 'Complete dry sweep + wet antiseptic floor mopping',
      'price': '₹149',
      'basePriceNum': 149,
      'duration': '40-60 mins',
      'icon': Icons.cleaning_services_rounded,
      'color': Color(0xFF10B981),
      'bg': Color(0xFFD1FAE5),
      'popular': true,
      'tag': 'Popular',
    },
    {
      'id': 'chore_degrease',
      'title': 'Kitchen Slab & Stove Degreasing',
      'subtitle': 'Chimney exterior, gas stove burners & countertop shine',
      'price': '₹129',
      'basePriceNum': 129,
      'duration': '30-40 mins',
      'icon': Icons.microwave_rounded,
      'color': Color(0xFFF59E0B),
      'bg': Color(0xFFFEF3C7),
      'popular': false,
      'tag': 'Deep Clean',
    },
    {
      'id': 'chore_folding',
      'title': 'Clothes Folding & Wardrobe Stack',
      'subtitle': 'Neat pile fold for washed laundry & bedsheet organization',
      'price': '₹99',
      'basePriceNum': 99,
      'duration': '30 mins',
      'icon': Icons.checkroom_rounded,
      'color': Color(0xFF8B5CF6),
      'bg': Color(0xFFEDE9FE),
      'popular': false,
      'tag': 'Quick Help',
    },
    {
      'id': 'chore_cooking_assist',
      'title': 'Cooking Helper & Chopping Assist',
      'subtitle': 'Vegetable chopping, dough kneading, roti making & prep',
      'price': '₹199',
      'basePriceNum': 199,
      'duration': '45-60 mins',
      'icon': Icons.restaurant_rounded,
      'color': Color(0xFFEA580C),
      'bg': Color(0xFFFFEDD5),
      'popular': true,
      'tag': 'Meal Prep',
    },
    {
      'id': 'chore_bathroom',
      'title': 'Bathroom Quick Clean & Tile Scrub',
      'subtitle': 'Toilet bowl sanitization, basin scrub & mirror wipe',
      'price': '₹149',
      'basePriceNum': 149,
      'duration': '30-45 mins',
      'icon': Icons.bathtub_rounded,
      'color': Color(0xFF0284C7),
      'bg': Color(0xFFBAE6FD),
      'popular': false,
      'tag': 'Sanitization',
    },
  ];

  static const List<Map<String, dynamic>> _monthlyPlans = [
    {
      'id': 'plan_standard',
      'title': 'Daily Essentials (Jhadu + Bartan)',
      'timing': 'Morning or Evening Slot (Daily)',
      'price': '₹2,499/mo',
      'basePriceNum': 2499,
      'savings': 'Save ₹800/mo',
      'features': ['Daily Floor Mopping & Sweeping', 'Daily Utensil Cleaning', 'Zero-Hassle Helper Replacement Guarantee'],
    },
    {
      'id': 'plan_full',
      'title': 'All-in-One Housekeeping',
      'timing': '2 Hours Dedicated Slot Daily',
      'price': '₹4,200/mo',
      'basePriceNum': 4200,
      'savings': 'Save ₹1,400/mo',
      'features': ['Jhadu-Pocha + Bartan Cleaning', 'Daily Dusting & Cloth Folding', 'Kitchen Counter Degreasing', 'Dedicated Verified Maid'],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Assurance & Speed Banner
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0F172A), Color(0xFF1E3A8A)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.flash_on_rounded, color: Color(0xFFFBBF24), size: 18),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'On-Demand Domestic Chores',
                    style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w800),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Book per chore or monthly. GateLink automatically allocates the top-rated verified helper active in your tower.',
                style: TextStyle(color: Color(0xFFE2E8F0), fontSize: 11.5, height: 1.3),
              ),
              const SizedBox(height: 10),
              Row(
                children: const [
                  _BadgeText(icon: Icons.timer_outlined, text: '30-Min Fast Slot'),
                  SizedBox(width: 8),
                  _BadgeText(icon: Icons.shield_outlined, text: 'Police Verified'),
                  SizedBox(width: 8),
                  _BadgeText(icon: Icons.currency_rupee_rounded, text: 'Fixed Rates'),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Section 1: Quick On-Demand Chores
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: const [
            Text(
              'Select a Chore (Pay Per Task)',
              style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF0F172A), fontSize: 15.5),
            ),
            Text('Auto-Assigned', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF0284C7))),
          ],
        ),
        const SizedBox(height: 12),

        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
            maxCrossAxisExtent: 260,
            mainAxisExtent: 175,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: _quickChores.length,
          itemBuilder: (context, index) {
            final chore = _quickChores[index];
            return _ChoreCard(chore: chore);
          },
        ),
        const SizedBox(height: 24),

        // Section 2: Monthly Recurring Subscriptions
        const Text(
          'Monthly Daily Maid Subscriptions',
          style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF0F172A), fontSize: 15.5),
        ),
        const SizedBox(height: 4),
        const Text(
          'Hassle-free daily domestic support with free backup helper guarantee if your maid is on leave.',
          style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
        ),
        const SizedBox(height: 12),

        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _monthlyPlans.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final plan = _monthlyPlans[index];
            return _MonthlyPlanCard(plan: plan);
          },
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}

class _ChoreCard extends StatelessWidget {
  final Map<String, dynamic> chore;
  const _ChoreCard({required this.chore});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: chore['bg'] as Color, borderRadius: BorderRadius.circular(10)),
                child: Icon(chore['icon'] as IconData, color: chore['color'] as Color, size: 20),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  chore['tag'] as String,
                  style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.w700, color: Color(0xFF475569)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            chore['title'] as String,
            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 3),
          Text(
            chore['duration'] as String,
            style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                chore['price'] as String,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
              ),
              InkWell(
                onTap: () => SnabbitMaidBookingSheet.show(context, chore),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E3A8A),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text('Book', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MonthlyPlanCard extends StatelessWidget {
  final Map<String, dynamic> plan;
  const _MonthlyPlanCard({required this.plan});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  plan['title'] as String,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(6)),
                child: Text(
                  plan['savings'] as String,
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFF15803D)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 3),
          Text(plan['timing'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
          const SizedBox(height: 8),
          ...(plan['features'] as List<String>).map((feat) => Padding(
                padding: const EdgeInsets.only(bottom: 3),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_rounded, color: Color(0xFF16A34A), size: 14),
                    const SizedBox(width: 6),
                    Text(feat, style: const TextStyle(fontSize: 11.5, color: Color(0xFF334155))),
                  ],
                ),
              )),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                plan['price'] as String,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
              ),
              ElevatedButton(
                onPressed: () => SnabbitMaidBookingSheet.show(context, plan),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  minimumSize: Size.zero,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('Subscribe & Allocate', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Colors.white)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _BadgeText extends StatelessWidget {
  final IconData icon;
  final String text;

  const _BadgeText({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: const Color(0xFF93C5FD), size: 12),
          const SizedBox(width: 4),
          Text(text, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
