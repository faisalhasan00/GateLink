import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class BookFlatConsultationSheet extends StatefulWidget {
  final String bhk;
  final String scope;
  final String finish;
  final String estimatedPrice;

  const BookFlatConsultationSheet({
    super.key,
    required this.bhk,
    required this.scope,
    required this.finish,
    required this.estimatedPrice,
  });

  @override
  State<BookFlatConsultationSheet> createState() => _BookFlatConsultationSheetState();
}

class _BookFlatConsultationSheetState extends State<BookFlatConsultationSheet> {
  String _selectedDate = 'Tomorrow';
  String _selectedTime = '11:00 AM - 1:00 PM';
  final TextEditingController _flatCtrl = TextEditingController();
  final TextEditingController _phoneCtrl = TextEditingController();
  bool _booked = false;

  @override
  void dispose() {
    _flatCtrl.dispose();
    super.dispose();
  }

  Future<void> _openWhatsApp() async {
    final msg = Uri.encodeComponent(
      'Hi GateLink Living Studio! I would like to book a Free In-Flat 3D Design Visit for my ${widget.bhk} (${widget.scope}). Estimated Budget: ${widget.estimatedPrice}. Flat: ${_flatCtrl.text.isNotEmpty ? _flatCtrl.text : "Palm Meadows"}.',
    );
    final url = Uri.parse('https://wa.me/919876543210?text=$msg');
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      }
    } catch (_) {}
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
      child: _booked
          ? Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 16),
                const Icon(Icons.check_circle_rounded, size: 64, color: Color(0xFF10B981)),
                const SizedBox(height: 12),
                const Text(
                  'Free In-Flat Visit Scheduled!',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Our senior interior architect will visit your flat with 3D design catalogs and material sample boxes.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: _openWhatsApp,
                  icon: const Icon(Icons.chat_rounded, color: Color(0xFF16A34A)),
                  label: const Text('Chat Directly on WhatsApp', style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF16A34A))),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFF16A34A)),
                    padding: const EdgeInsets.symmetric(vertical: 11, horizontal: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Close', style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white)),
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
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Book Free In-Flat Visit', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(6)),
                      child: const Text('100% Free • No Obligation', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Color(0xFF15803D))),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  '${widget.bhk} • ${widget.scope} • ${widget.estimatedPrice}',
                  style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF0284C7)),
                ),
                const SizedBox(height: 14),
                const Text('Preferred Visit Date', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF334155))),
                const SizedBox(height: 8),
                Row(
                  children: ['Today Evening', 'Tomorrow', 'This Weekend'].map((d) {
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
                  value: _selectedTime,
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                  ),
                  items: const [
                    DropdownMenuItem(value: '10:00 AM - 12:00 PM', child: Text('10:00 AM - 12:00 PM (Morning)', style: TextStyle(fontSize: 13))),
                    DropdownMenuItem(value: '11:00 AM - 1:00 PM', child: Text('11:00 AM - 1:00 PM (Noon)', style: TextStyle(fontSize: 13))),
                    DropdownMenuItem(value: '3:00 PM - 5:00 PM', child: Text('3:00 PM - 5:00 PM (Afternoon)', style: TextStyle(fontSize: 13))),
                    DropdownMenuItem(value: '6:00 PM - 8:00 PM', child: Text('6:00 PM - 8:00 PM (Evening)', style: TextStyle(fontSize: 13))),
                  ],
                  onChanged: (v) => setState(() => _selectedTime = v!),
                ),
                const SizedBox(height: 14),
                const Text('Flat & Tower Number', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF334155))),
                const SizedBox(height: 8),
                TextField(
                  controller: _flatCtrl,
                  decoration: InputDecoration(
                    hintText: 'e.g. Tower B, Flat 402',
                    hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => setState(() => _booked = true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Confirm Free Consultation Visit', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: Colors.white)),
                  ),
                ),
              ],
            ),
    );
  }
}
