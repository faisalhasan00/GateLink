import 'package:flutter/material.dart';
import 'post_bazaar_ad_sheet.dart';

class BazaarDashboardView extends StatefulWidget {
  const BazaarDashboardView({super.key});

  @override
  State<BazaarDashboardView> createState() => _BazaarDashboardViewState();
}

class _BazaarDashboardViewState extends State<BazaarDashboardView> {
  String _selectedCategory = 'All';

  static const List<Map<String, dynamic>> _allListings = [
    {
      'title': 'Solid Sheesham Wood 6-Seater Dining Table',
      'price': '₹12,500',
      'originalPrice': '₹24,000',
      'category': 'Furniture',
      'flat': 'Flat B-402 (Tower 2)',
      'timeAgo': '3 hrs ago',
      'condition': 'Like New (1 yr used)',
      'image': 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=300',
    },
    {
      'title': 'Firefox 21-Speed Mountain Gear Bicycle',
      'price': '₹7,200',
      'originalPrice': '₹14,500',
      'category': 'Vehicles',
      'flat': 'Flat A-801 (Tower 1)',
      'timeAgo': 'Today',
      'condition': 'Excellent Condition',
      'image': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300',
    },
    {
      'title': 'LG Smart Inverter Washing Machine 7kg',
      'price': '₹9,800',
      'originalPrice': '₹18,990',
      'category': 'Electronics',
      'flat': 'Flat C-205 (Tower 3)',
      'timeAgo': 'Yesterday',
      'condition': 'Gently Used with Bill',
      'image': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300',
    },
    {
      'title': 'Wooden Bookshelf & Study Desk Combo',
      'price': '₹4,500',
      'originalPrice': '₹8,900',
      'category': 'Furniture',
      'flat': 'Flat B-1104 (Tower 2)',
      'timeAgo': '2 days ago',
      'condition': 'Good Condition',
      'image': 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=300',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedCategory == 'All'
        ? _allListings
        : _allListings.where((it) => it['category'] == _selectedCategory).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Top Action: Post Ad Banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFF0FDF4),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFBBF7D0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: Color(0xFFDCFCE7),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.sell_rounded, color: Color(0xFF15803D), size: 20),
                  ),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Declutter & Earn Fast',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF14532D),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Sell or giveaway unused items to verified neighbors with zero packing or shipping hassle.',
                style: TextStyle(
                  fontSize: 12,
                  height: 1.35,
                  color: Color(0xFF166534),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 38,
                child: ElevatedButton.icon(
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (_) => const PostBazaarAdSheet(),
                    );
                  },
                  icon: const Icon(Icons.add_circle_outline_rounded, size: 16, color: Colors.white),
                  label: const Text(
                    'Post an Ad for Neighbors',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF16A34A),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Categories filter
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          child: Row(
            children: ['All', 'Furniture', 'Electronics', 'Vehicles'].map((cat) {
              final isSel = _selectedCategory == cat;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(cat, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: isSel ? Colors.white : const Color(0xFF334155))),
                  selected: isSel,
                  selectedColor: const Color(0xFF1E3A8A),
                  backgroundColor: const Color(0xFFF1F5F9),
                  onSelected: (_) => setState(() => _selectedCategory = cat),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 14),

        // Listings
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: filtered.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final item = filtered[index];
            return _BazaarCard(item: item);
          },
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}

class _BazaarCard extends StatelessWidget {
  final Map<String, dynamic> item;
  const _BazaarCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(item['image'] as String, width: 90, height: 90, fit: BoxFit.cover),
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
                      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(4)),
                      child: Text(item['condition'] as String, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                    ),
                    Text(item['timeAgo'] as String, style: const TextStyle(fontSize: 10.5, color: Color(0xFF94A3B8))),
                  ],
                ),
                const SizedBox(height: 4),
                Text(item['title'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)), maxLines: 2),
                const SizedBox(height: 3),
                Text('📍 ${item['flat']}', style: const TextStyle(fontSize: 11, color: Color(0xFF0284C7), fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(item['price'] as String, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
                        const SizedBox(width: 6),
                        Text(item['originalPrice'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), decoration: TextDecoration.lineThrough)),
                      ],
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Opening direct chat with neighbor at ${item['flat']}...'),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                      icon: const Icon(Icons.chat_bubble_outline_rounded, size: 13, color: Colors.white),
                      label: const Text('Chat', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E3A8A),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        minimumSize: Size.zero,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
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
