import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';
import '../../../../core/widgets/partner_logo.dart';
import '../../../home/presentation/screens/partner_dashboard_screen.dart';
import 'partner_login_screen.dart';

class PartnerRegisterScreen extends ConsumerStatefulWidget {
  const PartnerRegisterScreen({super.key});

  @override
  ConsumerState<PartnerRegisterScreen> createState() => _PartnerRegisterScreenState();
}

class _PartnerRegisterScreenState extends ConsumerState<PartnerRegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _emailController = TextEditingController();
  final _upiController = TextEditingController();
  final _cityController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  String _selectedCategory = 'Real Estate Broker';
  bool _acceptedTerms = true;
  bool _isLoading = false;

  final List<String> _categories = [
    'Real Estate Broker',
    'Channel Partner Agency',
    'Society Management Consultant',
    'Resident / RWA Board Member',
    'Security Vendor',
    'Individual Affiliate Partner',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _emailController.dispose();
    _upiController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_acceptedTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please accept the Partner Terms & Code of Conduct'),
          backgroundColor: AppColors.warning,
        ),
      );
      return;
    }
    setState(() => _isLoading = true);

    try {
      final name = _nameController.text.trim();
      final phone = _phoneController.text.trim().replaceAll(RegExp(r'[^0-9]'), '');
      final password = _passwordController.text.trim();
      final email = _emailController.text.trim();
      final upi = _upiController.text.trim();
      final city = _cityController.text.trim();

      // Check if partner already exists
      final existingDoc = await FirebaseFirestore.instance.collection('partners').doc(phone).get();
      if (existingDoc.exists) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('An account already exists with this mobile number. Please Sign In.'),
              backgroundColor: AppColors.warning,
            ),
          );
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const PartnerLoginScreen()),
          );
        }
        return;
      }

      final regLogId = 'REG-LOG-${DateTime.now().millisecondsSinceEpoch}';

      // 1. Save to Firestore 'partners' collection
      await FirebaseFirestore.instance.collection('partners').doc(phone).set({
        'name': name,
        'phone': phone,
        'password': password,
        'email': email,
        'category': _selectedCategory,
        'upiId': upi.isNotEmpty ? upi : '',
        'city': city,
        'status': 'active',
        'registrationLogId': regLogId,
        'createdAt': FieldValue.serverTimestamp(),
      });

      // 2. Save structured Partner Registration Audit Log
      await FirebaseFirestore.instance.collection('partner_registration_logs').doc(phone).set({
        'logReference': regLogId,
        'partnerPhone': phone,
        'partnerName': name,
        'partnerEmail': email,
        'category': _selectedCategory,
        'upiId': upi.isNotEmpty ? upi : '',
        'city': city,
        'status': 'verified_active',
        'registeredAt': FieldValue.serverTimestamp(),
      });

      // 3. Save locally & set authenticated session
      await ref.read(partnerAuthProvider.notifier).loginOrRegister(
        name: name,
        phone: phone,
        email: email,
        category: _selectedCategory,
        upiId: upi.isNotEmpty ? upi : '',
        city: city,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Welcome to GateLink Partner Network! Registration successful.'),
            backgroundColor: AppColors.success,
          ),
        );
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const PartnerDashboardScreen()),
        );
      }
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Registration error: $err'),
            backgroundColor: AppColors.error,
          ),
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
        title: const PartnerLogo(
          size: PartnerLogoSize.small,
          showTagline: false,
          isDark: true,
        ),
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
              // Header Card with Brand Gradient
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
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withValues(alpha: 0.2),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
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
                    const SizedBox(height: 12),
                    const PartnerLogo(
                      size: PartnerLogoSize.medium,
                      showTagline: true,
                      isDark: true,
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Earn instant ₹500 bonus per onboarded society + 2% lifetime monthly recurring revenue.',
                      style: TextStyle(fontSize: 12, color: Colors.white70, height: 1.4),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              const Text(
                'Partner Registration',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
              ),
              const SizedBox(height: 4),
              const Text(
                'Create your partner profile to start referring and onboarding societies',
                style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 16),

              // Full Name
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'Full Name *',
                  hintText: 'e.g. Rajesh Sharma',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.person_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Please enter your full name' : null,
              ),
              const SizedBox(height: 14),

              // 10-Digit Mobile Number
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: '10-Digit Mobile Number *',
                  hintText: 'e.g. 9845011223',
                  prefixText: '+91 ',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.phone_rounded, color: AppColors.primary),
                ),
                validator: (val) {
                  final clean = val?.trim().replaceAll(RegExp(r'[^0-9]'), '') ?? '';
                  if (clean.length < 10) return 'Enter a valid 10-digit mobile number';
                  return null;
                },
              ),
              const SizedBox(height: 14),

              // Password
              TextFormField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  labelText: 'Password *',
                  hintText: 'Minimum 6 characters',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.lock_rounded, color: AppColors.primary),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                      color: Colors.grey.shade600,
                    ),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ),
                validator: (val) => val == null || val.trim().length < 6 ? 'Password must be at least 6 characters' : null,
              ),
              const SizedBox(height: 14),

              // Confirm Password
              TextFormField(
                controller: _confirmPasswordController,
                obscureText: _obscureConfirmPassword,
                decoration: InputDecoration(
                  labelText: 'Confirm Password *',
                  hintText: 'Re-enter your password',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppColors.primary),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscureConfirmPassword ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                      color: Colors.grey.shade600,
                    ),
                    onPressed: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
                  ),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Please confirm your password';
                  if (val.trim() != _passwordController.text.trim()) return 'Passwords do not match';
                  return null;
                },
              ),
              const SizedBox(height: 14),

              // Email Address
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Email Address *',
                  hintText: 'e.g. rajesh@realtybrokers.in',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.email_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || !val.contains('@') ? 'Enter a valid email address' : null,
              ),
              const SizedBox(height: 14),

              // Partner Category
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

              // Payout UPI ID
              TextFormField(
                controller: _upiController,
                decoration: InputDecoration(
                  labelText: 'Payout UPI ID (e.g. name@okhdfcbank)',
                  hintText: 'For direct Cashfree bank transfers',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.account_balance_wallet_rounded, color: AppColors.secondary),
                ),
              ),
              const SizedBox(height: 14),

              // Operating City
              TextFormField(
                controller: _cityController,
                decoration: InputDecoration(
                  labelText: 'Operating City / Region *',
                  hintText: 'e.g. Hyderabad / Pune / Bengaluru',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.location_city_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter your operating city' : null,
              ),
              const SizedBox(height: 14),

              // Consent Checkbox
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                value: _acceptedTerms,
                onChanged: (val) => setState(() => _acceptedTerms = val ?? true),
                controlAffinity: ListTileControlAffinity.leading,
                title: const Text(
                  'I agree to GateLink Partner Terms & Code of Conduct for automated Cashfree disbursals.',
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ),
              const SizedBox(height: 16),

              // Register Button
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
                      : const Text('Complete Registration & Start Earning', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 24),

              // Already have an account link
              Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("Already have a partner account? ", style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                    GestureDetector(
                      onTap: () => Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const PartnerLoginScreen()),
                      ),
                      child: const Text(
                        'Sign In',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.primary),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
