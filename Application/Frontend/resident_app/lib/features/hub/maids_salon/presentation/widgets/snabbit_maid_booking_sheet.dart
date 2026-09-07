import 'package:flutter/material.dart';

class SnabbitMaidBookingSheet extends StatefulWidget {
  final Map<String, dynamic> service;

  const SnabbitMaidBookingSheet({super.key, required this.service});

  static Future<void> show(BuildContext context, Map<String, dynamic> service) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => SnabbitMaidBookingSheet(service: service),
    );
  }

  @override
  State<SnabbitMaidBookingSheet> createState() => _SnabbitMaidBookingSheetState();
}

class _SnabbitMaidBookingSheetState extends State<SnabbitMaidBookingSheet> {
  String _bhk = '2 BHK';
  String _planType = 'One-Time Chore'; // 'One-Time Chore' or 'Monthly Subscription'
  String _selectedSlot = 'Morning (8:00 AM - 10:00 AM)';
  final _instructionsController = TextEditingController();
  bool _isAllocating = false;

  final List<String> _bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK+'];

  final List<String> _timeSlots = [
    '⚡ Immediate (Within 30 mins)',
    'Morning (7:00 AM - 9:00 AM)',
    'Morning (9:00 AM - 11:30 AM)',
    'Afternoon (1:00 PM - 3:30 PM)',
    'Evening (5:00 PM - 7:30 PM)',
  ];

  @override
  void dispose() {
    _instructionsController.dispose();
    super.dispose();
  }

  int _calculateTotal() {
    final basePrice = (widget.service['basePriceNum'] as int?) ?? 149;
    int multiplier = 1;
    if (_bhk == '2 BHK') multiplier = 1;
    if (_bhk == '3 BHK') multiplier = 1;
    if (_bhk == '4 BHK+') multiplier = 2;

    if (_planType == 'Monthly Subscription') {
      return (basePrice * 22) - 400; // Monthly discount
    }
    return basePrice * multiplier;
  }

  Future<void> _handleBookAndAllocate() async {
    setState(() => _isAllocating = true);
    await Future.delayed(const Duration(milliseconds: 1200));
    if (!mounted) return;
    setState(() => _isAllocating = false);
    Navigator.pop(context);

    // Show confirmation dialog with allocated helper details
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        contentPadding: const EdgeInsets.all(20),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: const BoxDecoration(
                color: Color(0xFFDCFCE7),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.verified_user_rounded, color: Color(0xFF15803D), size: 36),
            ),
            const SizedBox(height: 14),
            const Text(
              'Helper Auto-Allocated!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 6),
            Text(
              'GateLink has assigned a verified helper for your ${_bhk} on ${_selectedSlot.replaceAll('⚡ ', '')}.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12.5, color: Color(0xFF475569)),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 20,
                    backgroundColor: Color(0xFF1E3A8A),
                    child: Icon(Icons.person, color: Colors.white, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Sunita Devi (Assigned)', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF0F172A))),
                        Text('⭐ 4.9 (42 jobs) • Active in your Tower', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 44,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('View Booking in Activity', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    final total = _calculateTotal();

    return Container(
      margin: EdgeInsets.only(top: 50, bottom: bottomInset),
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2)),
              ),
            ),
            const SizedBox(height: 14),

            // Service Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(widget.service['icon'] as IconData? ?? Icons.cleaning_services_rounded, color: const Color(0xFFD97706), size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(widget.service['title'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                      Text(widget.service['duration'] as String? ?? '30-45 mins typical duration', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: 24),

            // Plan Frequency Toggle (One-Time Chore vs Monthly Plan)
            const Text('Booking Frequency', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _FrequencyPill(
                    title: 'One-Time Chore',
                    subtitle: 'Pay per task',
                    isSelected: _planType == 'One-Time Chore',
                    onTap: () => setState(() => _planType = 'One-Time Chore'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _FrequencyPill(
                    title: 'Monthly Daily Plan',
                    subtitle: 'Save up to 30%',
                    isSelected: _planType == 'Monthly Subscription',
                    onTap: () => setState(() => _planType = 'Monthly Subscription'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Flat Size
            const Text('Select Flat Size', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: _bhkOptions.map((bhk) {
                final isSelected = _bhk == bhk;
                return GestureDetector(
                  onTap: () => setState(() => _bhk = bhk),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: isSelected ? const Color(0xFF1E3A8A) : Colors.transparent),
                    ),
                    child: Text(
                      bhk,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? Colors.white : const Color(0xFF334155),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            // Preferred Time Slot
            const Text('Select Time Slot', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                border: Border.all(color: const Color(0xFFE2E8F0)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedSlot,
                  isExpanded: true,
                  items: _timeSlots
                      .map((slot) => DropdownMenuItem(
                            value: slot,
                            child: Text(slot, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                          ))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedSlot = val);
                  },
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Smart Allocation Guarantee Box
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFBBF7D0)),
              ),
              child: Row(
                children: const [
                  Icon(Icons.bolt_rounded, color: Color(0xFF16A34A), size: 20),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Smart Allocation: GateLink automatically pairs you with the highest-rated verified helper active in your society.',
                      style: TextStyle(fontSize: 11, color: Color(0xFF15803D), fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Special Instructions
            TextFormField(
              controller: _instructionsController,
              decoration: InputDecoration(
                labelText: 'Special Instructions (Optional)',
                hintText: 'e.g. Focus on kitchen sink, key with guard...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                contentPadding: const EdgeInsets.all(12),
              ),
            ),
            const SizedBox(height: 20),

            // Bottom Pricing & CTA
            Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Total Estimate', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    Text(
                      '₹$total${_planType == 'Monthly Subscription' ? '/mo' : ''}',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                    ),
                  ],
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: SizedBox(
                    height: 48,
                    child: ElevatedButton(
                      onPressed: _isAllocating ? null : _handleBookAndAllocate,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E3A8A),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isAllocating
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : const Text('Book & Auto-Allocate Helper', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13.5)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _FrequencyPill extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool isSelected;
  final VoidCallback onTap;

  const _FrequencyPill({
    required this.title,
    required this.subtitle,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFE0F2FE) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFF0284C7) : const Color(0xFFE2E8F0),
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: isSelected ? const Color(0xFF0369A1) : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 10,
                color: isSelected ? const Color(0xFF0284C7) : const Color(0xFF64748B),
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
