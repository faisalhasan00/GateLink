import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../core/providers/auth_providers.dart';

class ReferralScreen extends ConsumerStatefulWidget {
  const ReferralScreen({super.key});

  @override
  ConsumerState<ReferralScreen> createState() => _ReferralScreenState();
}

class _ReferralScreenState extends ConsumerState<ReferralScreen> {
  final _formKey = GlobalKey<FormState>();
  final _societyNameController = TextEditingController();
  final _cityController = TextEditingController();
  final _contactPersonController = TextEditingController();
  final _contactPhoneController = TextEditingController();

  bool _isSubmitting = false;

  @override
  void dispose() {
    _societyNameController.dispose();
    _cityController.dispose();
    _contactPersonController.dispose();
    _contactPhoneController.dispose();
    super.dispose();
  }

  void _shareViaWhatsApp(String refCode) async {
    final message = Uri.encodeComponent(
      'Hello! I am using GateLink Society OS for my housing society security & automated maintenance billing.\n\n'
      'Check out GateLink to upgrade your gated community:\n'
      '🔗 https://gatelink.in/partners?ref=$refCode\n\n'
      'Introduce your society and earn up to 10% Month 1 Bonus + 2% Lifetime Monthly Recurring cash payouts!'
    );
    final whatsappUrl = Uri.parse('https://wa.me/?text=$message');

    if (await canLaunchUrl(whatsappUrl)) {
      await launchUrl(whatsappUrl, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not launch WhatsApp.')),
        );
      }
    }
  }

  void _copyLinkToClipboard(String refCode) {
    final link = 'https://gatelink.in/partners?ref=$refCode';
    Clipboard.setData(ClipboardData(text: link));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✓ Referral Link copied to clipboard!'),
        backgroundColor: Color(0xFF059669),
      ),
    );
  }

  void _openSubmitLeadSheet(String residentName, String residentPhone, String residentUpi) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: const EdgeInsets.all(24),
          child: StatefulBuilder(
            builder: (context, setSheetState) {
              return Form(
                key: _formKey,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          decoration: BoxDecoration(
                            color: Colors.grey.shade300,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Submit a Housing Society Lead',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF1E3A8A),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Introduce a neighboring society. GateLink handles the demo & sends cash to your UPI upon billing.',
                        style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                      ),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _societyNameController,
                        decoration: InputDecoration(
                          labelText: 'Society / Building Name *',
                          hintText: 'e.g. Palm Meadows Gated Community',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          prefixIcon: const Icon(Icons.apartment, color: Color(0xFF1E3A8A)),
                        ),
                        validator: (val) => val == null || val.trim().isEmpty ? 'Enter society name' : null,
                      ),
                      const SizedBox(height: 14),

                      TextFormField(
                        controller: _cityController,
                        decoration: InputDecoration(
                          labelText: 'City *',
                          hintText: 'e.g. Hyderabad / Mumbai / Pune',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          prefixIcon: const Icon(Icons.location_city, color: Color(0xFF1E3A8A)),
                        ),
                        validator: (val) => val == null || val.trim().isEmpty ? 'Enter city' : null,
                      ),
                      const SizedBox(height: 14),

                      TextFormField(
                        controller: _contactPersonController,
                        decoration: InputDecoration(
                          labelText: 'RWA Secretary / Contact Person *',
                          hintText: 'e.g. Mr. K. Rao (Secretary)',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          prefixIcon: const Icon(Icons.person, color: Color(0xFF1E3A8A)),
                        ),
                        validator: (val) => val == null || val.trim().isEmpty ? 'Enter contact person' : null,
                      ),
                      const SizedBox(height: 14),

                      TextFormField(
                        controller: _contactPhoneController,
                        keyboardType: TextInputType.phone,
                        decoration: InputDecoration(
                          labelText: 'Secretary Mobile / WhatsApp *',
                          hintText: 'e.g. 9845011223',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          prefixIcon: const Icon(Icons.phone, color: Color(0xFF1E3A8A)),
                        ),
                        validator: (val) => val == null || val.trim().length < 10 ? 'Enter valid 10-digit mobile' : null,
                      ),
                      const SizedBox(height: 24),

                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          onPressed: _isSubmitting ? null : () async {
                            if (!_formKey.currentState!.validate()) return;
                            setSheetState(() => _isSubmitting = true);

                            try {
                              final generatedRef = 'LEAD-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

                              await FirebaseFirestore.instance.collection('partner_leads').add({
                                'referenceId': generatedRef,
                                'partnerName': residentName,
                                'partnerPhone': residentPhone,
                                'partnerUpi': residentUpi,
                                'targetSocietyName': _societyNameController.text.trim(),
                                'targetCity': _cityController.text.trim(),
                                'contactPerson': _contactPersonController.text.trim(),
                                'contactPhone': _contactPhoneController.text.trim(),
                                'contactRole': 'RWA Secretary',
                                'status': 'new',
                                'assignedTier': 'referral',
                                'source': 'resident_flutter_mobile_app',
                                'createdAt': FieldValue.serverTimestamp(),
                              });

                              if (context.mounted) {
                                Navigator.pop(context);
                                _societyNameController.clear();
                                _cityController.clear();
                                _contactPersonController.clear();
                                _contactPhoneController.clear();

                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('✓ Lead Submitted! Reference: $generatedRef'),
                                    backgroundColor: const Color(0xFF059669),
                                  ),
                                );
                              }
                            } catch (err) {
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Submission failed: $err')),
                                );
                              }
                            } finally {
                              setSheetState(() => _isSubmitting = false);
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF1E3A8A),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          child: _isSubmitting
                              ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : const Text('Submit Lead & Track Status', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final userProfileAsync = ref.watch(userProfileProvider);
    final user = FirebaseAuth.instance.currentUser;
    final phone = userProfileAsync.value?.phone ?? user?.phoneNumber ?? '';
    final name = userProfileAsync.value?.name ?? 'Resident Partner';
    final refCode = phone.length >= 6 ? 'REF-${phone.substring(phone.length - 6)}' : 'REF-RESIDENT';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Share & Earn', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Banner Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E3A8A), Color(0xFF0EA5E9)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, 4))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'GATELINK RESIDENT PARTNER PROGRAM',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 0.5),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Earn Cash Bonuses &\nLifetime Monthly Income',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white, height: 1.2),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Introduce a housing society or gated community. Earn 5%-10% Month 1 Bonus + 2% Lifetime Monthly Share sent straight to your UPI!',
                    style: TextStyle(fontSize: 13, color: Colors.white70, height: 1.4),
                  ),
                  const SizedBox(height: 20),

                  // Action Buttons Inside Card
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _shareViaWhatsApp(refCode),
                          icon: const Icon(Icons.share, size: 18),
                          label: const Text('Share on WhatsApp', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF25D366),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      IconButton(
                        onPressed: () => _copyLinkToClipboard(refCode),
                        icon: const Icon(Icons.copy, color: Colors.white),
                        tooltip: 'Copy Link',
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.white.withValues(alpha: 0.2),
                          padding: const EdgeInsets.all(12),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Submit Lead Quick Trigger Card (Clean Responsive Layout)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: const Color(0xFFE0F2FE),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.add_business, color: Color(0xFF0284C7), size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Know a Housing Society?',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Submit their Secretary info in 30 seconds.',
                              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    height: 46,
                    child: ElevatedButton.icon(
                      onPressed: () => _openSubmitLeadSheet(name, phone, ''),
                      icon: const Icon(Icons.send_rounded, size: 18),
                      label: const Text('Submit Society Lead', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E3A8A),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),

            // Live Tracked Referrals Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'My Submitted Referrals',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF1E3A8A)),
                ),
                Text(
                  'Ref Code: $refCode',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Firestore Live Stream Builder for User's Leads
            StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('partner_leads')
                  .where('partnerPhone', isEqualTo: phone.trim())
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator()));
                }

                if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                  return Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      children: [
                        Icon(Icons.handshake_outlined, size: 40, color: Colors.grey.shade400),
                        const SizedBox(height: 10),
                        const Text(
                          'No Referrals Submitted Yet',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.black87),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tap "Submit Lead" above to refer your first society and start earning passive income.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                  );
                }

                final docs = snapshot.data!.docs;

                return ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: docs.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final data = docs[index].data() as Map<String, dynamic>;
                    final societyName = data['targetSocietyName'] ?? 'Society Lead';
                    final refId = data['referenceId'] ?? 'LEAD';
                    final status = data['status'] ?? 'new';
                    final payoutStatus = data['payoutStatus'] ?? 'pending';
                    final approxFlats = data['approxFlats'] ?? '100';

                    Color badgeColor;
                    String statusText;
                    if (status == 'won') {
                      badgeColor = const Color(0xFF059669);
                      statusText = 'Won / Active';
                    } else if (status == 'demo_scheduled') {
                      badgeColor = const Color(0xFF0284C7);
                      statusText = 'Demo Scheduled';
                    } else if (status == 'contacted') {
                      badgeColor = const Color(0xFFD97706);
                      statusText = 'Contacted';
                    } else {
                      badgeColor = const Color(0xFF6B7280);
                      statusText = 'Submitted';
                    }

                    return Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.grey.shade200),
                        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 3, offset: Offset(0, 1))],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                refId,
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF1E3A8A)),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: badgeColor.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  statusText,
                                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: badgeColor),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            societyName,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '$approxFlats Flats • Secretary: ${data['contactPerson'] ?? 'RWA'}',
                            style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                          ),
                          const Divider(height: 20),

                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Payout Status:',
                                style: TextStyle(fontSize: 12, color: Colors.grey),
                              ),
                              Text(
                                payoutStatus == 'paid' ? '✓ ₹${data['payoutTotal'] ?? 500} Paid' : '⏳ Pending Activation Billing',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: payoutStatus == 'paid' ? const Color(0xFF059669) : Colors.orange.shade800,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
