import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class SubmitLeadModal extends StatefulWidget {
  final String partnerName;
  final String partnerPhone;
  final String? partnerEmail;
  final String? partnerUpi;

  const SubmitLeadModal({
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
      builder: (context) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: SubmitLeadModal(
          partnerName: partnerName,
          partnerPhone: partnerPhone,
          partnerEmail: partnerEmail,
          partnerUpi: partnerUpi,
        ),
      ),
    );
  }

  @override
  State<SubmitLeadModal> createState() => _SubmitLeadModalState();
}

class _SubmitLeadModalState extends State<SubmitLeadModal> {
  final _formKey = GlobalKey<FormState>();
  final _societyNameController = TextEditingController();
  final _cityController = TextEditingController();
  final _contactPersonController = TextEditingController();
  final _contactPhoneController = TextEditingController();
  final _approxFlatsController = TextEditingController();
  late final TextEditingController _upiController;

  @override
  void initState() {
    super.initState();
    _upiController = TextEditingController(text: widget.partnerUpi ?? '');
  }

  bool _isSubmitting = false;

  @override
  void dispose() {
    _societyNameController.dispose();
    _cityController.dispose();
    _contactPersonController.dispose();
    _contactPhoneController.dispose();
    _approxFlatsController.dispose();
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
        'partnerName': widget.partnerName,
        'partnerPhone': widget.partnerPhone,
        'partnerEmail': widget.partnerEmail ?? '',
        'partnerUpi': _upiController.text.trim(),
        'targetSocietyName': _societyNameController.text.trim(),
        'targetCity': _cityController.text.trim(),
        'contactPerson': _contactPersonController.text.trim(),
        'contactPhone': _contactPhoneController.text.trim(),
        'approxFlats': _approxFlatsController.text.trim(),
        'contactRole': 'RWA Secretary / President',
        'status': 'new',
        'payoutStatus': 'pending',
        'assignedTier': 'channel_partner',
        'source': 'standalone_partner_flutter_app',
        'createdAt': FieldValue.serverTimestamp(),
      });

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✓ Lead Submitted! Reference: $generatedRef'),
            backgroundColor: AppColors.success,
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
                  decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Submit Housing Society Lead',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primary),
              ),
              const SizedBox(height: 4),
              Text(
                'GateLink sales team handles demo & onboarding. Instant ₹500 + 2% recurring sent to your UPI.',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 20),

              TextFormField(
                controller: _societyNameController,
                decoration: InputDecoration(
                  labelText: 'Society / Township Name *',
                  hintText: 'e.g. Royal Palms Gated Residency',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.apartment_rounded, color: AppColors.primary),
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
                        hintText: 'e.g. Hyderabad',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                      ),
                      validator: (val) => val == null || val.trim().isEmpty ? 'Enter city' : null,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _approxFlatsController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'Approx Flats',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _contactPersonController,
                decoration: InputDecoration(
                  labelText: 'RWA Secretary / Contact Person *',
                  hintText: 'e.g. Mr. K. Rao (Secretary)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.person_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter contact person' : null,
              ),
              const SizedBox(height: 12),

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
              const SizedBox(height: 12),

              TextFormField(
                controller: _upiController,
                decoration: InputDecoration(
                  labelText: 'Your Payout UPI ID *',
                  hintText: 'e.g. yourname@upi',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.account_balance_wallet_rounded, color: AppColors.secondary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter UPI ID for payout' : null,
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
                      : const Text('Submit Lead & Track Status', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
