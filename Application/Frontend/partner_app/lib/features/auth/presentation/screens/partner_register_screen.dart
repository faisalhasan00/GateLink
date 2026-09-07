import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';
import '../../../../core/widgets/partner_logo.dart';
import '../../../home/presentation/screens/partner_dashboard_screen.dart';
import '../widgets/partner_register_form.dart';
import '../widgets/partner_register_header.dart';
import '../widgets/partner_signin_link.dart';
import 'partner_login_screen.dart';

class PartnerRegisterScreen extends ConsumerStatefulWidget {
  const PartnerRegisterScreen({super.key});

  @override
  ConsumerState<PartnerRegisterScreen> createState() =>
      _PartnerRegisterScreenState();
}

class _PartnerRegisterScreenState
    extends ConsumerState<PartnerRegisterScreen> {
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
      final phone =
          _phoneController.text.trim().replaceAll(RegExp(r'[^0-9]'), '');
      final password = _passwordController.text.trim();
      final email = _emailController.text.trim();
      final upi = _upiController.text.trim();
      final city = _cityController.text.trim();

      // Check if partner already exists
      final existingDoc = await FirebaseFirestore.instance
          .collection('partners')
          .doc(phone)
          .get();
      if (existingDoc.exists) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                  'An account already exists with this mobile number. Please Sign In.'),
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
      await FirebaseFirestore.instance
          .collection('partner_registration_logs')
          .doc(phone)
          .set({
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
            content: Text(
                '✓ Welcome to GateLink Partner Network! Registration successful.'),
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const PartnerRegisterHeader(),
            const SizedBox(height: 20),
            PartnerRegisterForm(
              formKey: _formKey,
              nameController: _nameController,
              phoneController: _phoneController,
              passwordController: _passwordController,
              confirmPasswordController: _confirmPasswordController,
              emailController: _emailController,
              upiController: _upiController,
              cityController: _cityController,
              obscurePassword: _obscurePassword,
              obscureConfirmPassword: _obscureConfirmPassword,
              selectedCategory: _selectedCategory,
              categories: _categories,
              acceptedTerms: _acceptedTerms,
              isLoading: _isLoading,
              onToggleObscurePassword: () =>
                  setState(() => _obscurePassword = !_obscurePassword),
              onToggleObscureConfirmPassword: () => setState(
                  () => _obscureConfirmPassword = !_obscureConfirmPassword),
              onCategoryChanged: (cat) =>
                  setState(() => _selectedCategory = cat),
              onTermsChanged: (terms) =>
                  setState(() => _acceptedTerms = terms),
              onSubmit: _handleRegister,
            ),
            const SizedBox(height: 24),
            const PartnerSigninLink(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
