import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class SubmitLeadBottomSheet extends StatefulWidget {
  final String residentName;
  final String residentPhone;
  final String residentUpi;

  const SubmitLeadBottomSheet({
    super.key,
    required this.residentName,
    required this.residentPhone,
    required this.residentUpi,
  });

  static void show(BuildContext context, {required String residentName, required String residentPhone, String residentUpi = ''}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: SubmitLeadBottomSheet(
          residentName: residentName,
          residentPhone: residentPhone,
          residentUpi: residentUpi,
        ),
      ),
    );
  }

  @override
  State<SubmitLeadBottomSheet> createState() => _SubmitLeadBottomSheetState();
}

class _SubmitLeadBottomSheetState extends State<SubmitLeadBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _societyNameController = TextEditingController();
  final _cityController = TextEditingController();
  final _contactPersonController = TextEditingController();
  final _contactPhoneController = TextEditingController();
  final _upiController = TextEditingController();

  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _upiController.text = widget.residentUpi;
  }

  @override
  void dispose() {
    _societyNameController.dispose();
    _cityController.dispose();
    _contactPersonController.dispose();
    _contactPhoneController.dispose();
    _upiController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSubmitting = true);

    try {
      final generatedRef = 'LEAD-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

      await FirebaseFirestore.instance.collection('partner_leads').add({
        'referenceId': generatedRef,
        'partnerName': widget.residentName,
        'partnerPhone': widget.residentPhone,
        'partnerUpi': _upiController.text.trim().isNotEmpty ? _upiController.text.trim() : widget.residentUpi,
        'targetSocietyName': _societyNameController.text.trim(),
        'targetCity': _cityController.text.trim(),
        'contactPerson': _contactPersonController.text.trim(),
        'contactPhone': _contactPhoneController.text.trim(),
        'contactRole': 'RWA Secretary',
        'status': 'new',
        'payoutStatus': 'pending',
        'assignedTier': 'referral',
        'source': 'resident_flutter_mobile_app',
        'createdAt': FieldValue.serverTimestamp(),
      });

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✓ Lead Submitted! Reference: $generatedRef'),
            backgroundColor: const Color(0xFF059669),
          ),
        );
      }
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Submission failed: $err')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      ),
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Form(
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
                'Submit Housing Society Lead',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Introduce a neighboring society. GateLink sales handles the demo & sends cash to your UPI upon billing.',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 20),

              TextFormField(
                controller: _societyNameController,
                decoration: InputDecoration(
                  labelText: 'Society / Building Name *',
                  hintText: 'e.g. Palm Meadows Gated Township',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.apartment_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter society name' : null,
              ),
              const SizedBox(height: 14),

              TextFormField(
                controller: _cityController,
                decoration: InputDecoration(
                  labelText: 'City *',
                  hintText: 'e.g. Hyderabad / Mumbai / Pune',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.location_city_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter city' : null,
              ),
              const SizedBox(height: 14),

              TextFormField(
                controller: _contactPersonController,
                decoration: InputDecoration(
                  labelText: 'Secretary / Contact Person *',
                  hintText: 'e.g. Mr. K. Rao (Secretary)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.person_rounded, color: AppColors.primary),
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
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.phone_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().length < 10 ? 'Enter valid 10-digit mobile' : null,
              ),
              const SizedBox(height: 14),

              TextFormField(
                controller: _upiController,
                decoration: InputDecoration(
                  labelText: 'Your Payout UPI ID (for instant ₹500 + 2%)',
                  hintText: 'e.g. yourname@upi or raj@okicici',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.account_balance_wallet_rounded, color: AppColors.secondary),
                ),
              ),
              const SizedBox(height: 24),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _handleSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  ),
                  child: _isSubmitting
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Submit Lead & Start Tracking', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
