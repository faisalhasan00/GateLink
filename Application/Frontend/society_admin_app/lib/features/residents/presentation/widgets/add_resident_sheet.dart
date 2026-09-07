import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/admin_providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import 'resident_form_fields.dart';
import 'resident_password_box.dart';

class AddResidentBottomSheet extends ConsumerStatefulWidget {
  final String societyId;

  const AddResidentBottomSheet({
    super.key,
    required this.societyId,
  });

  static void show(BuildContext context, String societyId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AddResidentBottomSheet(societyId: societyId),
    );
  }

  @override
  ConsumerState<AddResidentBottomSheet> createState() =>
      _AddResidentBottomSheetState();
}

class _AddResidentBottomSheetState
    extends ConsumerState<AddResidentBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _flatController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();

  String _userType = 'owner';
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _passwordController.text = _generateSecurePassword();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _flatController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  String _generateSecurePassword() {
    const chars =
        'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#\$';
    final random = Random.secure();
    return List.generate(8, (_) => chars[random.nextInt(chars.length)]).join();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final name = _nameController.text.trim();
      final flat = _flatController.text.trim().toUpperCase();
      final email = _emailController.text.trim();
      final phone = _phoneController.text.trim();
      final password = _passwordController.text.trim();

      // Extract wing if format like A-101 or A101
      String wing = '';
      if (flat.contains('-')) {
        wing = flat.split('-').first.trim();
      } else if (flat.isNotEmpty && RegExp(r'^[A-Za-z]').hasMatch(flat)) {
        wing = flat.substring(0, 1);
      }

      await ref.read(firestoreServiceProvider).addResident(
        widget.societyId,
        {
          'name': name,
          'fullName': name,
          'flatNumber': flat,
          'flatNo': flat,
          'wing': wing,
          'email': email,
          'phone': phone,
          'mobileNumber': phone,
          'userType': _userType,
          'ownershipType': _userType == 'owner' ? 'Owner' : 'Tenant',
          'role': 'resident',
          'password': password,
        },
      );

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Resident "$name" added successfully!'),
            backgroundColor: AppColors.successEmerald,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to add resident: ${e.toString()}'),
            backgroundColor: AppColors.dangerCrimson,
          ),
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
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
        top: 20,
        left: 20,
        right: 20,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Add Resident Manually',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.primaryNavy,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              ResidentFormFields(
                nameController: _nameController,
                flatController: _flatController,
                emailController: _emailController,
                phoneController: _phoneController,
                userType: _userType,
                onUserTypeChanged: (val) => setState(() => _userType = val),
              ),
              const SizedBox(height: 16),
              ResidentPasswordBox(
                controller: _passwordController,
                onRegenerate: () {
                  setState(() {
                    _passwordController.text = _generateSecurePassword();
                  });
                },
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      label: 'Cancel',
                      onPressed: () => Navigator.pop(context),
                      variant: ButtonVariant.outline,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppButton(
                      label: 'Save Resident',
                      isLoading: _isSubmitting,
                      onPressed: _submit,
                      variant: ButtonVariant.primary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
