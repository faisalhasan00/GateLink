import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';
import '../../../home/presentation/screens/partner_dashboard_screen.dart';
import 'partner_register_screen.dart';

class PartnerLoginScreen extends ConsumerStatefulWidget {
  const PartnerLoginScreen({super.key});

  @override
  ConsumerState<PartnerLoginScreen> createState() => _PartnerLoginScreenState();
}

class _PartnerLoginScreenState extends ConsumerState<PartnerLoginScreen> {
  final _phoneController = TextEditingController(text: '9845011223');
  final _otpController = TextEditingController();
  bool _otpSent = false;
  bool _isLoading = false;
  bool _isGoogleLoading = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _sendOtp() {
    final phone = _phoneController.text.trim();
    if (phone.length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid 10-digit mobile number')),
      );
      return;
    }
    setState(() => _otpSent = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('OTP sent to +91 $phone (Demo OTP: 123456)')),
    );
  }

  Future<void> _verifyOtpAndLogin([String? customPhone, String? customName]) async {
    setState(() => _isLoading = true);

    try {
      final phone = customPhone ?? _phoneController.text.trim();
      final name = customName ?? 'Rajesh Sharma (Partner)';

      String email = 'partner@gatelink.in';
      String upiId = 'rajesh@okicici';
      String category = 'Channel Partner';
      String city = 'Hyderabad';

      try {
        final doc = await FirebaseFirestore.instance.collection('partners').doc(phone).get();
        if (doc.exists && doc.data() != null) {
          final data = doc.data()!;
          email = data['email'] ?? email;
          upiId = data['upiId'] ?? upiId;
          category = data['category'] ?? category;
          city = data['city'] ?? city;
        }
      } catch (_) {}

      await ref.read(partnerAuthProvider.notifier).loginOrRegister(
        name: name,
        phone: phone,
        email: email,
        category: category,
        upiId: upiId,
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
          SnackBar(content: Text('Login error: $err')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleGoogleSignIn() async {
    setState(() => _isGoogleLoading = true);

    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) {
        // User cancelled the sign in
        setState(() => _isGoogleLoading = false);
        return;
      }

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final UserCredential userCredential = await FirebaseAuth.instance.signInWithCredential(credential);
      final user = userCredential.user;

      if (user != null) {
        final googleName = user.displayName ?? googleUser.displayName ?? 'Partner User';
        final googleEmail = user.email ?? googleUser.email;
        final googlePhone = user.phoneNumber ?? '9845011223';

        // Check if partner document exists in Firestore
        final docSnapshot = await FirebaseFirestore.instance.collection('partners').doc(googleEmail).get();

        if (docSnapshot.exists && docSnapshot.data() != null) {
          final data = docSnapshot.data()!;
          await ref.read(partnerAuthProvider.notifier).loginOrRegister(
            name: data['name'] ?? googleName,
            phone: data['phone'] ?? googlePhone,
            email: googleEmail,
            category: data['category'] ?? 'Real Estate Broker',
            upiId: data['upiId'] ?? 'google@okicici',
            city: data['city'] ?? 'Hyderabad',
          );

          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => const PartnerDashboardScreen()),
            );
          }
        } else {
          // New partner: navigate to PartnerRegisterScreen pre-filled with Google details
          if (mounted) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => PartnerRegisterScreen(
                  initialName: googleName,
                  initialEmail: googleEmail,
                ),
              ),
            );
          }
        }
      }
    } catch (err) {
      // Demo fallback if Google Play Services / credentials aren't active in dev
      await ref.read(partnerAuthProvider.notifier).loginOrRegister(
        name: 'Rajesh Sharma (Google)',
        phone: '9845011223',
        email: 'rajesh.google@realty.in',
        category: 'Real Estate Broker',
        upiId: 'rajesh.google@okicici',
        city: 'Hyderabad',
      );

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const PartnerDashboardScreen()),
        );
      }
    } finally {
      if (mounted) setState(() => _isGoogleLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 30),

              // Logo & Brand Header
              Center(
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withValues(alpha: 0.3),
                            blurRadius: 16,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: const Icon(Icons.handshake_rounded, color: Colors.white, size: 40),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'GateLink Partner',
                      style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                    ),
                    const Text(
                      'Channel Partner & Broker Referral App',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),

              // Google Sign-In Main Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton.icon(
                  onPressed: _isGoogleLoading ? null : _handleGoogleSignIn,
                  icon: _isGoogleLoading
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                      : Container(
                          padding: const EdgeInsets.all(4),
                          decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                          child: const Icon(Icons.g_mobiledata_rounded, color: Color(0xFF4285F4), size: 28),
                        ),
                  label: const Text(
                    'Continue with Google',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: AppColors.border, width: 1.5),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              Row(
                children: [
                  Expanded(child: Container(height: 1, color: AppColors.border)),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text('OR LOGIN WITH PHONE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                  ),
                  Expanded(child: Container(height: 1, color: AppColors.border)),
                ],
              ),
              const SizedBox(height: 20),

              // Phone Login Card Container
              Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.border),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Mobile Number OTP Login',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Enter your registered mobile number to receive instant OTP',
                      style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 16),

                    TextFormField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: 'Mobile Number',
                        prefixText: '+91 ',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        prefixIcon: const Icon(Icons.phone_rounded, color: AppColors.primary),
                      ),
                    ),
                    const SizedBox(height: 14),

                    if (_otpSent) ...[
                      TextFormField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        maxLength: 6,
                        decoration: InputDecoration(
                          labelText: 'Enter 6-Digit OTP (Demo: 123456)',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                          prefixIcon: const Icon(Icons.lock_rounded, color: AppColors.secondary),
                        ),
                      ),
                      const SizedBox(height: 14),
                    ],

                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: _isLoading
                            ? null
                            : (_otpSent ? () => _verifyOtpAndLogin() : _sendOtp),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        ),
                        child: _isLoading
                            ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : Text(_otpSent ? 'Verify OTP & Login' : 'Get OTP Code', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Quick Demo Sign In
              const Text(
                'Quick Demo Sign-In (Select Persona)',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 10),

              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _verifyOtpAndLogin('9845011223', 'Rajesh Sharma (Partner)'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                      ),
                      child: const Column(
                        children: [
                          Icon(Icons.person_rounded, size: 20, color: AppColors.primary),
                          SizedBox(height: 4),
                          Text('Rajesh Sharma', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          Text('Channel Partner', style: TextStyle(fontSize: 9, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _verifyOtpAndLogin('9822019922', 'Vikram Rao (Realty Broker)'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                      ),
                      child: const Column(
                        children: [
                          Icon(Icons.real_estate_agent_rounded, size: 20, color: AppColors.secondary),
                          SizedBox(height: 4),
                          Text('Vikram Rao', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          Text('Realty Broker', style: TextStyle(fontSize: 9, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 30),

              // Registration Link Footer
              Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("Don't have a partner account? ", style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                    GestureDetector(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const PartnerRegisterScreen()),
                      ),
                      child: const Text(
                        'Register Now',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppColors.primary),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
