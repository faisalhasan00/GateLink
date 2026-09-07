import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'book_flat_consultation_sheet.dart';

class InteriorCostEstimator extends StatefulWidget {
  const InteriorCostEstimator({super.key});

  @override
  State<InteriorCostEstimator> createState() => _InteriorCostEstimatorState();
}

class _InteriorCostEstimatorState extends State<InteriorCostEstimator> {
  String _bhk = '2 BHK';
  String _scope = 'Full Home Turnkey';
  String _finish = 'Premium (Acrylic/PU)';

  // Approximate realistic estimation calculation
  String get _estimatedRange {
    int base = 350000;
    if (_bhk == '1 BHK') base = 240000;
    if (_bhk == '2 BHK') base = 390000;
    if (_bhk == '3 BHK') base = 580000;
    if (_bhk == '4 BHK / Villa') base = 850000;

    double scopeMultiplier = 1.0;
    if (_scope == 'Modular Kitchen Only') scopeMultiplier = 0.40;
    if (_scope == 'Wardrobes & Storage') scopeMultiplier = 0.50;
    if (_scope == 'Living Room Makeover') scopeMultiplier = 0.35;

    double finishMultiplier = 1.0;
    if (_finish == 'Essential (Laminate)') finishMultiplier = 0.85;
    if (_finish == 'Premium (Acrylic/PU)') finishMultiplier = 1.0;
    if (_finish == 'Luxury (Veneer/Glass)') finishMultiplier = 1.35;

    final low = (base * scopeMultiplier * finishMultiplier / 10000).round() * 10000;
    final high = (low * 1.18 / 10000).round() * 10000;

    return '₹${(low / 100000).toStringAsFixed(1)}L - ₹${(high / 100000).toStringAsFixed(1)}L';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E3A8A).withOpacity(0.04),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.calculate_rounded, color: Color(0xFFD97706), size: 20),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Instant Flat Cost Estimator',
                    style: TextStyle(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    'Calculate customized quotation for your flat',
                    style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),

          // 1. Flat Type Selector
          const Text('1. Flat Configuration', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
          const SizedBox(height: 6),
          Row(
            children: ['1 BHK', '2 BHK', '3 BHK', '4 BHK / Villa'].map((opt) {
              final isSel = _bhk == opt;
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: InkWell(
                    onTap: () {
                      HapticFeedback.selectionClick();
                      setState(() => _bhk = opt);
                    },
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 7),
                      decoration: BoxDecoration(
                        color: isSel ? const Color(0xFF1E3A8A) : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: isSel ? const Color(0xFF1E3A8A) : const Color(0xFFE2E8F0)),
                      ),
                      child: Center(
                        child: Text(
                          opt,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: isSel ? Colors.white : const Color(0xFF334155),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 12),

          // 2. Scope Selector
          const Text('2. Scope of Work', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
          const SizedBox(height: 6),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: ['Full Home Turnkey', 'Modular Kitchen Only', 'Wardrobes & Storage', 'Living Room Makeover'].map((opt) {
              final isSel = _scope == opt;
              return ChoiceChip(
                label: Text(opt, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: isSel ? Colors.white : const Color(0xFF334155))),
                selected: isSel,
                selectedColor: const Color(0xFF1E3A8A),
                backgroundColor: const Color(0xFFF8FAFC),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8), side: BorderSide(color: isSel ? const Color(0xFF1E3A8A) : const Color(0xFFE2E8F0))),
                onSelected: (_) {
                  HapticFeedback.selectionClick();
                  setState(() => _scope = opt);
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 12),

          // 3. Material Finish Selector
          const Text('3. Material & Finish Tier', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
          const SizedBox(height: 6),
          Row(
            children: ['Essential (Laminate)', 'Premium (Acrylic/PU)', 'Luxury (Veneer/Glass)'].map((opt) {
              final isSel = _finish == opt;
              final shortName = opt.split(' ')[0];
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: InkWell(
                    onTap: () {
                      HapticFeedback.selectionClick();
                      setState(() => _finish = opt);
                    },
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 7),
                      decoration: BoxDecoration(
                        color: isSel ? const Color(0xFF0EA5E9) : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: isSel ? const Color(0xFF0EA5E9) : const Color(0xFFE2E8F0)),
                      ),
                      child: Center(
                        child: Text(
                          shortName,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: isSel ? Colors.white : const Color(0xFF334155),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // Estimated Price Card & CTA
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFBBF7D0)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Estimated Budget', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF166534))),
                    Text(
                      _estimatedRange,
                      style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: Color(0xFF15803D)),
                    ),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (_) => BookFlatConsultationSheet(
                        bhk: _bhk,
                        scope: _scope,
                        finish: _finish,
                        estimatedPrice: _estimatedRange,
                      ),
                    );
                  },
                  icon: const Icon(Icons.architecture_rounded, size: 16, color: Colors.white),
                  label: const Text('Get 3D Plan', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E3A8A),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
