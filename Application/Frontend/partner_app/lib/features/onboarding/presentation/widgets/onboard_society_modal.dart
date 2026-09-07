import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import 'onboard_society_success_dialog.dart';
import 'onboard_society_form_fields.dart';

class OnboardSocietyModal extends StatefulWidget {
  final String partnerName;
  final String partnerPhone;
  final String? partnerEmail;
  final String? partnerUpi;

  const OnboardSocietyModal({
    super.key,
    required this.partnerName,
    required this.partnerPhone,
    this.partnerEmail,
    this.partnerUpi,
  });

  static void show(
    BuildContext context, {
    required String partnerName,
    required String partnerPhone,
    String? partnerEmail,
    String? partnerUpi,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => OnboardSocietyModal(
        partnerName: partnerName,
        partnerPhone: partnerPhone,
        partnerEmail: partnerEmail,
        partnerUpi: partnerUpi,
      ),
    );
  }

  @override
  State<OnboardSocietyModal> createState() => _OnboardSocietyModalState();
}

class _OnboardSocietyModalState extends State<OnboardSocietyModal> {
  final _formKey = GlobalKey<FormState>();
  final _societyNameController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _flatsController = TextEditingController();
  
  final _adminNameController = TextEditingController();
  final _adminPhoneController = TextEditingController();
  final _adminEmailController = TextEditingController();

  final String _selectedPlan = 'Pro (₹20/flat/mo)';
  bool _isLoading = false;

  @override
  void dispose() {
    _societyNameController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _flatsController.dispose();
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
      const blocks = 3;

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
        'partnerEmail': widget.partnerEmail ?? '',
        'partnerUpi': widget.partnerUpi ?? '',
        'paidAt': FieldValue.serverTimestamp(),
        'createdAt': FieldValue.serverTimestamp(),
      });

      if (mounted) {
        Navigator.pop(context);

        // Show Onboarding Success Sheet
        OnboardSocietySuccessDialog.show(
          context,
          societyName: societyName,
          flats: flats,
          utrNumber: utrNumber,
          monthlyPassive: monthlyPassive,
          adminPhone: adminPhone,
          societyId: societyId,
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

              OnboardSocietyFormFields(
                societyNameController: _societyNameController,
                addressController: _addressController,
                cityController: _cityController,
                flatsController: _flatsController,
                adminNameController: _adminNameController,
                adminPhoneController: _adminPhoneController,
                adminEmailController: _adminEmailController,
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
