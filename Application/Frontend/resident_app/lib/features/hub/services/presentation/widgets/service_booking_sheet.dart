import 'package:flutter/material.dart';

class ServiceBookingSheet extends StatefulWidget {
  final Map<String, dynamic> service;

  const ServiceBookingSheet({super.key, required this.service});

  @override
  State<ServiceBookingSheet> createState() => _ServiceBookingSheetState();
}

class _ServiceBookingSheetState extends State<ServiceBookingSheet> {
  String _selectedSlot = 'Morning (9:00 AM - 12:00 PM)';
  String _selectedDate = 'Today';
  final TextEditingController _issueCtrl = TextEditingController();
  bool _confirmed = false;

  @override
  void dispose() {
    _issueCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: _confirmed
          ? Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 16),
                const Icon(Icons.check_circle_rounded, size: 64, color: Color(0xFF10B981)),
                const SizedBox(height: 12),
                const Text(
                  'Technician Assigned!',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                Text(
                  'A verified ${widget.service['title']} has been notified for Flat entry. Gate pre-approval entry pass is automatically created.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Done', style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white)),
                  ),
                ),
              ],
            )
          : Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(999)),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: widget.service['bg'] as Color, borderRadius: BorderRadius.circular(10)),
                      child: Icon(widget.service['icon'] as IconData, size: 20, color: widget.service['color'] as Color),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Book ${widget.service['title']}', style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                        Text(widget.service['pricing'] as String, style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: widget.service['color'] as Color)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text('Select Date', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF334155))),
                const SizedBox(height: 8),
                Row(
                  children: ['Today', 'Tomorrow', 'This Weekend'].map((d) {
                    final isSel = _selectedDate == d;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(d, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: isSel ? Colors.white : const Color(0xFF334155))),
                        selected: isSel,
                        selectedColor: const Color(0xFF1E3A8A),
                        backgroundColor: const Color(0xFFF1F5F9),
                        onSelected: (_) => setState(() => _selectedDate = d),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 14),
                const Text('Preferred Time Slot', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF334155))),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedSlot,
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'Morning (9:00 AM - 12:00 PM)', child: Text('Morning (9:00 AM - 12:00 PM)', style: TextStyle(fontSize: 13))),
                    DropdownMenuItem(value: 'Afternoon (12:00 PM - 4:00 PM)', child: Text('Afternoon (12:00 PM - 4:00 PM)', style: TextStyle(fontSize: 13))),
                    DropdownMenuItem(value: 'Evening (4:00 PM - 8:00 PM)', child: Text('Evening (4:00 PM - 8:00 PM)', style: TextStyle(fontSize: 13))),
                  ],
                  onChanged: (v) => setState(() => _selectedSlot = v!),
                ),
                const SizedBox(height: 14),
                const Text('Describe Problem / Scope', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF334155))),
                const SizedBox(height: 8),
                TextField(
                  controller: _issueCtrl,
                  maxLines: 2,
                  decoration: InputDecoration(
                    hintText: 'e.g. Living room fan wobbling and kitchen switch sparking...',
                    hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                    contentPadding: const EdgeInsets.all(12),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => setState(() => _confirmed = true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Confirm Booking', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
                  ),
                ),
              ],
            ),
    );
  }
}
