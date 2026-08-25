import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:io';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/services/firestore_service.dart';
import '../../../../core/services/storage_service.dart';
import '../../models/gate_entry_model.dart';
import '../widgets/guard_header_banner.dart';
import '../widgets/entry_type_selector.dart';

class QuickEntryScreen extends ConsumerStatefulWidget {
  const QuickEntryScreen({super.key});

  @override
  ConsumerState<QuickEntryScreen> createState() => _QuickEntryScreenState();
}

class _QuickEntryScreenState extends ConsumerState<QuickEntryScreen> {
  bool _isSubmitting = false;
  EntryType _selectedType = EntryType.guest;
  final _formKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _flatController = TextEditingController();
  final _vehicleController = TextEditingController();
  final _companyController = TextEditingController();
  final _notesController = TextEditingController();

  String _selectedGender = 'Male';
  String _selectedVehicleType = '4-Wheeler';
  String _selectedTower = 'All Blocks / Direct';
  File? _photoFile;
  final _picker = ImagePicker();

  bool _isValidatingFlat = false;
  FlatValidationResult? _flatValidationResult;

  final List<String> _towers = [
    'All Blocks / Direct',
    'Block A',
    'Block B',
    'Block C',
    'Block D',
    'Tower 1',
    'Tower 2'
  ];
  final List<String> _genders = ['Male', 'Female', 'Other'];
  final List<String> _vehicleTypes = [
    '2-Wheeler',
    '4-Wheeler',
    'Auto/Rickshaw',
    'None'
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _flatController.dispose();
    _vehicleController.dispose();
    _companyController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  String _getFormattedFlatNumber(String input) {
    final clean = input.trim();
    if (clean.isEmpty) return '';
    if (_selectedTower == 'All Blocks / Direct' || clean.contains('-')) {
      return clean;
    }
    return '$_selectedTower-$clean';
  }

  Future<void> _pickPhoto() async {
    final picked = await _picker.pickImage(source: ImageSource.camera, imageQuality: 70);
    if (picked != null) {
      setState(() => _photoFile = File(picked.path));
    }
  }

  Future<void> _validateFlatNow(String val) async {
    final formattedFlat = _getFormattedFlatNumber(val);
    if (formattedFlat.isEmpty) {
      setState(() => _flatValidationResult = null);
      return;
    }

    setState(() => _isValidatingFlat = true);
    final profile = ref.read(userProfileProvider).value;
    final societyId = profile?['societyId'] ?? 'SOC-001';
    final firestoreService = ref.read(firestoreServiceProvider) ?? FirestoreService(societyId: societyId);
    final res = await firestoreService.validateFlat(formattedFlat);
    if (mounted) {
      setState(() {
        _flatValidationResult = res;
        _isValidatingFlat = false;
      });
    }
  }

  Future<void> _submitEntry() async {
    if (!_formKey.currentState!.validate()) return;
    if (_isSubmitting) return;

    final targetFlat = _getFormattedFlatNumber(_flatController.text);
    final profile = ref.read(userProfileProvider).value;
    final societyId = profile?['societyId'] ?? 'SOC-001';
    final firestoreService = ref.read(firestoreServiceProvider) ?? FirestoreService(societyId: societyId);

    final validation = await firestoreService.validateFlat(targetFlat);
    if (!validation.isValid) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(children: [
              const Icon(Icons.error_outline, color: Colors.white),
              const SizedBox(width: 8),
              Expanded(child: Text('❌ ${validation.error}')),
            ]),
            backgroundColor: AppColors.error,
            duration: const Duration(seconds: 4),
          ),
        );
      }
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      String? photoUrl;
      if (_photoFile != null) {
        final storage = ref.read(storageServiceProvider);
        final uniqueId = DateTime.now().millisecondsSinceEpoch.toString();
        photoUrl = await storage.uploadComplaintImage(_photoFile!, societyId, 'visitor_$uniqueId');
        if (photoUrl.isEmpty) photoUrl = null;
      }

      final visitorType = _selectedType == EntryType.guest
          ? 'Guest'
          : _selectedType == EntryType.delivery
              ? 'Delivery'
              : _selectedType == EntryType.cab
                  ? 'Cab'
                  : 'Daily Help';

      final user = FirebaseAuth.instance.currentUser;
      final profile = ref.read(userProfileProvider).value;

      await firestoreService.logVisitorEntry(
        name: _nameController.text.trim(),
        type: visitorType,
        hostFlat: targetFlat,
        phone: _phoneController.text.trim(),
        vehicleNumber: _vehicleController.text.trim(),
        vehicleType: _selectedVehicleType,
        company: _companyController.text.trim(),
        gender: _selectedGender,
        photoUrl: photoUrl,
        notes: _notesController.text.trim(),
        guardUid: user?.uid,
        gateName: profile?['gateName'] ?? 'Gate 1 — Main Entry',
      );

      if (mounted) {
        _clearForm();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✅ Visitor request logged & sent to ${validation.residentName} ($targetFlat)!'),
            backgroundColor: AppColors.secondary,
            duration: const Duration(seconds: 4),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        final errText = e.toString().replaceAll('Exception: ', '');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ $errText'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _clearForm() {
    _nameController.clear();
    _phoneController.clear();
    _flatController.clear();
    _vehicleController.clear();
    _companyController.clear();
    _notesController.clear();
    setState(() {
      _photoFile = null;
      _flatValidationResult = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(userProfileProvider).value;
    final user = FirebaseAuth.instance.currentUser;
    final societyName = profile?['societyName'] ?? 'Housing Society';
    final gateName = profile?['gateName'] ?? 'Gate 1 — Main Entry';
    final guardName = profile?['name'] ?? user?.displayName ?? 'Security Guard';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.secondary,
        foregroundColor: Colors.white,
        title: const Text('Log New Visitor Entry'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Banner Widget
              GuardHeaderBanner(
                societyName: societyName,
                gateName: gateName,
                guardName: guardName,
              ),
              const SizedBox(height: AppSpacing.lg),

              // Entry Type Selector Tabs Widget
              EntryTypeSelector(
                selectedType: _selectedType,
                onTypeSelected: (type) => setState(() => _selectedType = type),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Target Flat & Tower Picker
              Row(
                children: [
                  Expanded(
                    flex: 4,
                    child: DropdownButtonFormField<String>(
                      value: _selectedTower,
                      decoration: const InputDecoration(
                        labelText: 'Building Block',
                        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 12),
                      ),
                      items: _towers.map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(fontSize: 12)))).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setState(() => _selectedTower = val);
                          if (_flatController.text.isNotEmpty) _validateFlatNow(_flatController.text);
                        }
                      },
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    flex: 5,
                    child: TextFormField(
                      controller: _flatController,
                      keyboardType: TextInputType.text,
                      decoration: InputDecoration(
                        labelText: 'Flat Number',
                        hintText: 'e.g. 104',
                        suffixIcon: _isValidatingFlat
                            ? const Padding(
                                padding: EdgeInsets.all(12),
                                child: SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2)),
                              )
                            : null,
                      ),
                      onChanged: _validateFlatNow,
                      validator: (v) => v == null || v.trim().isEmpty ? 'Flat is required' : null,
                    ),
                  ),
                ],
              ),

              // Flat Validation Feedback Badge
              if (_flatValidationResult != null) ...[
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: _flatValidationResult!.isValid ? AppColors.successSurface : AppColors.errorSurface,
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    border: Border.all(color: _flatValidationResult!.isValid ? AppColors.success : AppColors.error),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _flatValidationResult!.isValid ? Icons.check_circle_rounded : Icons.error_outline_rounded,
                        color: _flatValidationResult!.isValid ? AppColors.success : AppColors.error,
                        size: 16,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _flatValidationResult!.isValid
                              ? 'Verified Resident: ${_flatValidationResult!.residentName}'
                              : _flatValidationResult!.error ?? 'Flat not found in society database',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _flatValidationResult!.isValid ? AppColors.success : AppColors.error,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: AppSpacing.md),

              // Visitor Name & Phone
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Visitor Full Name',
                  hintText: 'e.g. Ramesh Kumar',
                  prefixIcon: Icon(Icons.person_outline_rounded),
                ),
                validator: (v) => v == null || v.trim().isEmpty ? 'Visitor name is required' : null,
              ),
              const SizedBox(height: AppSpacing.md),

              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Visitor Mobile Number',
                  hintText: 'e.g. 9876543210',
                  prefixIcon: Icon(Icons.phone_outlined),
                ),
                validator: (v) => v == null || v.trim().length < 10 ? 'Enter valid 10-digit phone' : null,
              ),
              const SizedBox(height: AppSpacing.md),

              // Vehicle Details
              Row(
                children: [
                  Expanded(
                    flex: 4,
                    child: DropdownButtonFormField<String>(
                      value: _selectedVehicleType,
                      decoration: const InputDecoration(labelText: 'Vehicle Type'),
                      items: _vehicleTypes.map((v) => DropdownMenuItem(value: v, child: Text(v, style: const TextStyle(fontSize: 12)))).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedVehicleType = val);
                      },
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    flex: 5,
                    child: TextFormField(
                      controller: _vehicleController,
                      decoration: const InputDecoration(
                        labelText: 'Vehicle Number',
                        hintText: 'e.g. TS09AB1234',
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: AppSpacing.xl),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _isSubmitting ? null : _submitEntry,
                  icon: _isSubmitting
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Icon(Icons.send_rounded, color: Colors.white),
                  label: Text(
                    _isSubmitting ? 'Logging Entry...' : 'Submit Entry & Alert Resident ➔',
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.secondary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
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
