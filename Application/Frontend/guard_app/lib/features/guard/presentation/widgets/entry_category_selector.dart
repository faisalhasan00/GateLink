import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../models/gate_entry_model.dart';

class EntryCategorySelector extends StatelessWidget {
  final EntryType selectedType;
  final ValueChanged<EntryType> onTypeChanged;
  final Function(String brand, EntryType type, String defaultName)? onBrandPresetSelected;

  const EntryCategorySelector({
    super.key,
    required this.selectedType,
    required this.onTypeChanged,
    this.onBrandPresetSelected,
  });

  static const List<Map<String, dynamic>> _brandPresets = [
    {'name': 'Swiggy', 'type': EntryType.delivery, 'icon': '🍕', 'color': Color(0xFFF97316)},
    {'name': 'Zomato', 'type': EntryType.delivery, 'icon': '🍔', 'color': Color(0xFFEF4444)},
    {'name': 'Blinkit', 'type': EntryType.delivery, 'icon': '⚡', 'color': Color(0xFFFBBF24)},
    {'name': 'Zepto', 'type': EntryType.delivery, 'icon': '🛍️', 'color': Color(0xFF8B5CF6)},
    {'name': 'Amazon', 'type': EntryType.delivery, 'icon': '📦', 'color': Color(0xFF0284C7)},
    {'name': 'Uber', 'type': EntryType.cab, 'icon': '🚕', 'color': Color(0xFF0F172A)},
    {'name': 'Ola', 'type': EntryType.cab, 'icon': '🚗', 'color': Color(0xFF10B981)},
    {'name': 'Urban Company', 'type': EntryType.dailyHelp, 'icon': '🔧', 'color': Color(0xFF6366F1)},
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 1-Tap Quick Delivery & Service Presets
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: const [
            Text(
              '1-Tap Fast Presets',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
            Text(
              'Auto-fills in 1 tap',
              style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: _brandPresets.map((preset) {
              final brand = preset['name'] as String;
              final type = preset['type'] as EntryType;
              final icon = preset['icon'] as String;
              final color = preset['color'] as Color;

              return Padding(
                padding: const EdgeInsets.only(right: 6),
                child: Material(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  child: InkWell(
                    onTap: () {
                      onTypeChanged(type);
                      onBrandPresetSelected?.call(brand, type, '$brand Executive');
                    },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(icon, style: const TextStyle(fontSize: 13)),
                          const SizedBox(width: 5),
                          Text(
                            brand,
                            style: const TextStyle(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1E293B),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),

        const SizedBox(height: 16),

        const Text(
          'Select Entry Category',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: EntryType.values.map((type) {
            final isSelected = selectedType == type;
            final model = GateEntryModel(
              id: '',
              visitorName: '',
              phone: '',
              flatNumber: '',
              tower: '',
              status: EntryStatus.inside,
              entryTime: DateTime.now(),
              type: type,
            );

            Color typeColor;
            switch (type) {
              case EntryType.delivery:
                typeColor = const Color(0xFFF97316);
                break;
              case EntryType.cab:
                typeColor = const Color(0xFFEAB308);
                break;
              case EntryType.dailyHelp:
                typeColor = const Color(0xFF10B981);
                break;
              default:
                typeColor = const Color(0xFF2563EB);
            }

            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 3),
                child: GestureDetector(
                  onTap: () => onTypeChanged(type),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF1E3A8A) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFE2E8F0),
                        width: isSelected ? 1.5 : 1.0,
                      ),
                      boxShadow: [
                        if (isSelected)
                          BoxShadow(
                            color: const Color(0xFF1E3A8A).withValues(alpha: 0.2),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Icon(
                          model.typeIcon,
                          color: isSelected ? Colors.white : typeColor,
                          size: 20,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          type.name.toUpperCase(),
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: isSelected ? Colors.white : const Color(0xFF475569),
                            letterSpacing: 0.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
