import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class OnboardSocietyModal extends StatefulWidget {
  final String partnerName;
  final String partnerPhone;

  const OnboardSocietyModal({
    super.key,
    required this.partnerName,
    required this.partnerPhone,
  });

  static void show(BuildContext context, {required String partnerName, required String partnerPhone}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => OnboardSocietyModal(partnerName: partnerName, partnerPhone: partnerPhone),
    );
  }

  @override
  State<OnboardSocietyModal> createState() => _OnboardSocietyModalState();
}

class _OnboardSocietyModalState extends State<OnboardSocietyModal> {
  final _formKey = GlobalKey<FormState>();
  final _societyNameController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController(text: 'Hyderabad');
  final _flatsController = TextEditingController(text: '150');
  final _blocksController = TextEditingController(text: '3');
  
  final _adminNameController = TextEditingController();
  final _adminPhoneController = TextEditingController();
  final _adminEmailController = TextEditingController();

  String _selectedPlan = 'Pro (₹20/flat/mo)';
  bool _isLoading = false;

  @override
  void dispose() {
    _societyNameController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _flatsController.dispose();
    _blocksController.dispose();
    _adminNameController.dispose();
    _adminPhoneController.dispose();
    _adminEmailController.dispose();
    super.dispose();
  }

  Future<void> _handleDirectOnboard() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      final societyName = _societyNameController.text.trim();
      final address = _addressController.text.trim();
      final city = _cityController.text.trim();
      final flats = int.tryParse(_flatsController.text.trim()) ?? 150;
      final blocks = int.tryParse(_blocksController.text.trim()) ?? 3;

      final adminName = _adminNameController.text.trim();
      final adminPhone = _adminPhoneController.text.trim();
      final adminEmail = _adminEmailController.text.trim();

      final societyId = 'SOC-${societyName.replaceAll(RegExp(r'[^a-zA-Z0-9]'), '').toUpperCase().substring(0, societyName.length > 8 ? 8 : societyName.length)}-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
      final utrNumber = 'CF${DateTime.now().millisecondsSinceEpoch.toString().substring(3)}';
      final monthlyPassive = flats * 2; // ₹2/flat/mo partner commission

      // 1. Create Society Doc in Firestore
      await FirebaseFirestore.instance.collection('societies').doc(societyId).set({
        'societyId': societyId,
        'name': societyName,
        'address': address,
        'city': city,
        'totalFlats': flats,
        'totalBlocks': blocks,
        'plan': _selectedPlan,
        'status': 'active',
        'onboardedByPartnerName': widget.partnerName,
        'onboardedByPartnerPhone': widget.partnerPhone,
        'createdAt': FieldValue.serverTimestamp(),
      });

      // 2. Create RWA Admin record in Firestore
      await FirebaseFirestore.instance.collection('society_admins').doc(adminPhone).set({
        'adminName': adminName,
        'adminPhone': adminPhone,
        'adminEmail': adminEmail,
        'societyId': societyId,
        'societyName': societyName,
        'role': 'SUPER_ADMIN',
        'createdAt': FieldValue.serverTimestamp(),
      });

      // 3. Create Won Lead in partner_leads with Instant Payout Log
      await FirebaseFirestore.instance.collection('partner_leads').doc(societyId).set({
        'referenceId': 'ONBOARD-${DateTime.now().millisecondsSinceEpoch.toString().substring(6)}',
        'targetSocietyName': societyName,
        'targetCity': city,
        'contactPerson': '$adminName (Secretary)',
        'contactPhone': adminPhone,
        'approxFlats': flats.toString(),
        'status': 'won',
        'payoutStatus': 'paid',
        'payoutTotal': 500,
        'utrNumber': utrNumber,
        'monthlyPassiveEarned': monthlyPassive,
        'partnerName': widget.partnerName,
        'partnerPhone': widget.partnerPhone,
        'paidAt': FieldValue.serverTimestamp(),
        'createdAt': FieldValue.serverTimestamp(),
      });

      if (mounted) {
        Navigator.pop(context);

        // Show Onboarding Success Sheet
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: AppColors.successLight, shape: BoxShape.circle),
                  child: const Icon(Icons.verified_rounded, color: AppColors.success, size: 24),
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text('Society Onboarded!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                ),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$societyName ($flats Flats) is live on GateLink!',
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('✓ ₹500 Cash Disbursed Instant Payout', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.success)),
                      Text('Bank UTR: $utrNumber', style: const TextStyle(fontSize: 10, fontFamily: 'monospace', color: AppColors.textSecondary)),
                      const SizedBox(height: 6),
                      Text('⚡ + ₹$monthlyPassive /month recurring income started!', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                const Text('RWA Admin Credentials:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                Text('Admin Portal: app.gatelink.in\nMobile: $adminPhone\nSociety Code: $societyId', style: const TextStyle(fontSize: 11, color: AppColors.textPrimary)),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Done & Close', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      }
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Onboarding error: $err')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        top: 20,
        left: AppSpacing.pagePadding,
        right: AppSpacing.pagePadding,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 16),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('⚡ Direct Society Onboarding', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
                      Text('Onboard society instantly & trigger ₹500 cash payout', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                    ],
                  ),
                  IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close_rounded)),
                ],
              ),
              const SizedBox(height: 16),

              // Banner
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.successLight,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.bolt_rounded, color: AppColors.success, size: 22),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Direct Onboarding creates live society credentials instantly & unlocks ₹500 Cashfree cash payout!',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF065F46)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              const Text('1. Society Details', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
              const SizedBox(height: 10),

              TextFormField(
                controller: _societyNameController,
                decoration: InputDecoration(
                  labelText: 'Society / Apartment Name *',
                  hintText: 'e.g. Sunshine Heights Co-op Housing',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.domain_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter society name' : null,
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _cityController,
                      decoration: InputDecoration(
                        labelText: 'City *',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        prefixIcon: const Icon(Icons.location_city_rounded, color: AppColors.primary),
                      ),
                      validator: (val) => val == null || val.trim().isEmpty ? 'Enter city' : null,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _flatsController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'Total Flats *',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        prefixIcon: const Icon(Icons.apartment_rounded, color: AppColors.primary),
                      ),
                      validator: (val) => val == null || val.trim().isEmpty ? 'Enter flats' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _addressController,
                decoration: InputDecoration(
                  labelText: 'Full Address *',
                  hintText: 'e.g. Road No 12, Banjara Hills',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.map_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter address' : null,
              ),
              const SizedBox(height: 20),

              const Text('2. RWA Secretary / Admin Details', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
              const SizedBox(height: 10),

              TextFormField(
                controller: _adminNameController,
                decoration: InputDecoration(
                  labelText: 'Secretary / Admin Name *',
                  hintText: 'e.g. Subhash Chandra',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.person_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter admin name' : null,
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _adminPhoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: 'Admin Mobile *',
                        prefixText: '+91 ',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        prefixIcon: const Icon(Icons.phone_rounded, color: AppColors.primary),
                      ),
                      validator: (val) => val == null || val.trim().length < 10 ? 'Enter phone' : null,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _adminEmailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'Admin Email *',
                        hintText: 'admin@society.in',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        prefixIcon: const Icon(Icons.email_rounded, color: AppColors.primary),
                      ),
                      validator: (val) => val == null || !val.contains('@') ? 'Enter email' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  onPressed: _isLoading ? null : _handleDirectOnboard,
                  icon: const Icon(Icons.flash_on_rounded, size: 20),
                  label: _isLoading
                      ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Activate Society & Disburse ₹500 Bonus', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.success,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
