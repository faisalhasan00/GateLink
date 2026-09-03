import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';

class ResidentBazaarSection extends StatelessWidget {
  final VoidCallback onPostAd;
  final void Function(String flat) onChatWithResident;

  const ResidentBazaarSection({
    super.key,
    required this.onPostAd,
    required this.onChatWithResident,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(),
        const SizedBox(height: AppSpacing.sm),

        _buildBazaarItem(
          title: 'Solid Sheesham Wood 6-Seater Dining Table',
          price: '₹12,500',
          flat: 'Flat B-402 • Tower 2',
          timeAgo: 'Posted 3 hrs ago',
          condition: 'Like New (Used 1 yr)',
          icon: Icons.table_restaurant_rounded,
          iconColor: const Color(0xFF16A34A),
          onChat: () => onChatWithResident('Flat B-402'),
        ),
        const SizedBox(height: AppSpacing.sm),

        _buildBazaarItem(
          title: 'Firefox Mountain Bike (21 Speed Shimano)',
          price: '₹7,200',
          flat: 'Flat A-801 • Tower 1',
          timeAgo: 'Posted Today',
          condition: 'Excellent Condition',
          icon: Icons.pedal_bike_rounded,
          iconColor: const Color(0xFF0284C7),
          onChat: () => onChatWithResident('Flat A-801'),
        ),
        const SizedBox(height: AppSpacing.sm),

        _buildBazaarItem(
          title: 'LG Smart Inverter Washing Machine 7kg',
          price: '₹9,800',
          flat: 'Flat C-205 • Tower 3',
          timeAgo: 'Posted Yesterday',
          condition: 'Gently Used with Warranty',
          icon: Icons.local_laundry_service_rounded,
          iconColor: const Color(0xFFD97706),
          onChat: () => onChatWithResident('Flat C-205'),
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
            color: const Color(0xFF16A34A).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: const Text(
            'ZERO COMMISSION',
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.w800,
              color: Color(0xFF16A34A),
              letterSpacing: 0.4,
            ),
          ),
        ),
        const SizedBox(width: 8),
        const Expanded(
          child: Text(
            'Resident Bazaar (Buy & Sell)',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
          ),
        ),
        TextButton.icon(
          onPressed: onPostAd,
          icon: const Icon(Icons.add_circle_outline_rounded,
              size: 16, color: Color(0xFF16A34A)),
          label: const Text(
            '+ Post Item',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: Color(0xFF16A34A),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBazaarItem({
    required String title,
    required String price,
    required String flat,
    required String timeAgo,
    required String condition,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onChat,
  }) {
    return Container(
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 28),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Text(
                      price,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF16A34A),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        condition,
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF475569),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '$flat • $timeAgo',
                      style: const TextStyle(
                        fontSize: 10,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    InkWell(
                      onTap: onChat,
                      child: const Row(
                        children: [
                          Icon(Icons.chat_bubble_outline_rounded,
                              size: 13, color: Color(0xFF16A34A)),
                          SizedBox(width: 3),
                          Text(
                            'Chat',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF16A34A),
                            ),
                          ),
                        ],
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
