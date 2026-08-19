import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';
import '../../../home/presentation/screens/partner_dashboard_screen.dart';

class PartnerRegisterScreen extends ConsumerStatefulWidget {
  final String? initialName;
  final String? initialEmail;

  const PartnerRegisterScreen({
    super.key,
    this.initialName,
    this.initialEmail,
  });

  @override
  ConsumerState<PartnerRegisterScreen> createState() => _PartnerRegisterScreenState();
}

class _PartnerRegisterScreenState extends ConsumerState<PartnerRegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  final _phoneController = TextEditingController();
  late final TextEditingController _emailController;
  final _upiController = TextEditingController();
  final _cityController = TextEditingController();

  String _selectedCategory = 'Real Estate Broker';
  bool _isLoading = false;

  final List<String> _categories = [
    'Real Estate Broker',
    'Channel Partner Agency',
    'Society Management Consultant',
    'Resident / RWA Member',
  ];

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.initialName ?? '');
    _emailController = TextEditingController(text: widget.initialEmail ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _upiController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      final name = _nameController.text.trim();
      final phone = _phoneController.text.trim();
      final email = _emailController.text.trim();
      final upi = _upiController.text.trim();
      final city = _cityController.text.trim();

      // Save to Firestore 'partners' collection
      await FirebaseFirestore.instance.collection('partners').doc(phone).set({
        'name': name,
        'phone': phone,
        'email': email,
        'category': _selectedCategory,
        'upiId': upi,
        'city': city,
        'status': 'active',
        'createdAt': FieldValue.serverTimestamp(),
      });

      // Save locally
      await ref.read(partnerAuthProvider.notifier).loginOrRegister(
        name: name,
        phone: phone,
        email: email,
        category: _selectedCategory,
        upiId: upi,
        city: city,
      );

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const PartnerDashboardScreen()),
        );
      }
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Registration error: $err')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Partner Registration', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E3A8A), Color(0xFF0284C7)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(AppRadius.pill),
                      ),
                      child: const Text(
                        'GATELINK CHANNEL PARTNER NETWORK',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Join GateLink Partner Program',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Earn instant ₹500 bonus per onboarded society + 2% lifetime monthly recurring revenue.',
                      style: TextStyle(fontSize: 12, color: Colors.white70),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              const Text(
                'Personal & Business Details',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
              ),
              const SizedBox(height: 14),

              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'Full Name *',
                  hintText: 'e.g. Rajesh Sharma',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.person_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter your name' : null,
              ),
              const SizedBox(height: 14),

              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: '10-Digit Mobile / WhatsApp *',
                  hintText: 'e.g. 9845011223',
                  prefixText: '+91 ',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.phone_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().length < 10 ? 'Enter valid mobile number' : null,
              ),
              const SizedBox(height: 14),

              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Email Address *',
                  hintText: 'e.g. rajesh@realtybrokers.in',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.email_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || !val.contains('@') ? 'Enter valid email' : null,
              ),
              const SizedBox(height: 14),

              DropdownButtonFormField<String>(
                initialValue: _selectedCategory,
                decoration: InputDecoration(
                  labelText: 'Partner Category *',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.work_rounded, color: AppColors.primary),
                ),
                items: _categories.map((cat) => DropdownMenuItem(value: cat, child: Text(cat))).toList(),
                onChanged: (val) => setState(() => _selectedCategory = val!),
              ),
              const SizedBox(height: 14),

              TextFormField(
                controller: _upiController,
                decoration: InputDecoration(
                  labelText: 'Payout UPI ID (for instant ₹500 + 2%) *',
                  hintText: 'e.g. rajesh@okicici',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.account_balance_wallet_rounded, color: AppColors.secondary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter UPI ID' : null,
              ),
              const SizedBox(height: 14),

              TextFormField(
                controller: _cityController,
                decoration: InputDecoration(
                  labelText: 'Operating City / Region *',
                  hintText: 'e.g. Hyderabad / Pune / Mumbai',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.location_city_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter operating city' : null,
              ),
              const SizedBox(height: 24),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleRegister,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  ),
                  child: _isLoading
                      ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Complete Registration & Enter Dashboard', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
