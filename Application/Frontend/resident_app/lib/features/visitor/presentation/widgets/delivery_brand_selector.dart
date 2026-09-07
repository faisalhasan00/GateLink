import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class DeliveryBrandSelector extends StatelessWidget {
  final String? selectedName;
  final ValueChanged<Map<String, dynamic>> onSelectBrand;

  const DeliveryBrandSelector({
    super.key,
    required this.selectedName,
    required this.onSelectBrand,
  });

  static const List<Map<String, dynamic>> deliveryBrands = [
    {
      'name': 'Swiggy',
      'icon': Icons.delivery_dining_rounded,
      'color': Color(0xFFFC8019),
      'defaultName': 'Swiggy Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Zomato',
      'icon': Icons.restaurant_rounded,
      'color': Color(0xFFCB202D),
      'defaultName': 'Zomato Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Blinkit',
      'icon': Icons.shopping_bag_rounded,
      'color': Color(0xFFEAB308),
      'defaultName': 'Blinkit Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Amazon',
      'icon': Icons.local_shipping_rounded,
      'color': Color(0xFF0F172A),
      'defaultName': 'Amazon Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Zepto',
      'icon': Icons.flash_on_rounded,
      'color': Color(0xFF7C3AED),
      'defaultName': 'Zepto Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Uber / Cab',
      'icon': Icons.local_taxi_rounded,
      'color': Color(0xFF0284C7),
      'defaultName': 'Cab Driver',
      'purpose': 'Cab / Taxi',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Text(
              'QUICK DELIVERY BRANDS',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
                color: Color(0xFF64748B),
              ),
            ),
            SizedBox(width: 6),
            Text(
              '• 1-Tap Autofill',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: Color(0xFF0EA5E9),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 38,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: deliveryBrands.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final brand = deliveryBrands[index];
              final isSelected = selectedName == brand['defaultName'];
              final brandColor = brand['color'] as Color;

              return InkWell(
                onTap: () {
                  HapticFeedback.selectionClick();
                  onSelectBrand(brand);
                },
                borderRadius: BorderRadius.circular(10),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? brandColor : Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isSelected ? brandColor : const Color(0xFFE2E8F0),
                      width: isSelected ? 1.5 : 1.0,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isSelected
                            ? brandColor.withValues(alpha: 0.25)
                            : Colors.black.withValues(alpha: 0.03),
                        blurRadius: isSelected ? 6 : 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        brand['icon'] as IconData,
                        size: 15,
                        color: isSelected ? Colors.white : brandColor,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        brand['name'] as String,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: isSelected ? Colors.white : const Color(0xFF0F172A),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
