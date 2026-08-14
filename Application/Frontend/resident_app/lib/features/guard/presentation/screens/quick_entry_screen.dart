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

  // Real-time Flat Validation State
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
    final picked =
        await _picker.pickImage(source: ImageSource.camera, imageQuality: 70);
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
    final firestoreService = ref.read(firestoreServiceProvider) ??
        FirestoreService(societyId: societyId);
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
    final firestoreService = ref.read(firestoreServiceProvider) ??
        FirestoreService(societyId: societyId);

    // 1. Explicit Flat Validation
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
        photoUrl = await storage.uploadComplaintImage(
            _photoFile!, societyId, 'visitor_$uniqueId');
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
            content: Text(
                '✅ Visitor request logged & sent to ${validation.residentName} ($targetFlat)!'),
            backgroundColor: AppColors.secondary,
            duration: const Duration(seconds: 4),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        final errText = e.toString().replaceAll('Exception: ', '');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('❌ $errText'), backgroundColor: AppColors.error),
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
              // Auto-filled Society & Guard Information Header
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F1923),
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                ),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 20,
                      backgroundColor: AppColors.primary,
                      child: Icon(Icons.security_rounded,
                          color: Colors.white, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(societyName,
                              style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white)),
                          Text('$gateName  •  Logged by: $guardName',
                              style: const TextStyle(
                                  fontSize: 11, color: Colors.white70)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Entry Category Selection
              const Text('Select Entry Category',
                  style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary)),
              const SizedBox(height: AppSpacing.sm),
              Row(
                children: EntryType.values.map((type) {
                  final isSelected = _selectedType == type;
                  final model = GateEntryModel(
                    id: '',
                    visitorName: '',
                    phone: '',
                    flatNumber: '',
                    tower: '',
                    status: EntryStatus.inside,
                    entryTime: DateTime.now(),
                    type: type,
                  );
                  return Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedType = type),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color:
                                isSelected ? AppColors.secondary : Colors.white,
                            borderRadius: BorderRadius.circular(AppRadius.md),
                            border: Border.all(
                              color: isSelected
                                  ? AppColors.secondary
                                  : AppColors.border,
                            ),
                          ),
                          child: Column(
                            children: [
                              Icon(
                                model.typeIcon,
                                color: isSelected
                                    ? Colors.white
                                    : AppColors.textSecondary,
                                size: 22,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                type.name.toUpperCase(),
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: isSelected
                                      ? Colors.white
                                      : AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Photo Attachment (Camera)
              Row(
                children: [
                  GestureDetector(
                    onTap: _pickPhoto,
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        border: Border.all(color: AppColors.border),
                        image: _photoFile != null
                            ? DecorationImage(
                                image: FileImage(_photoFile!),
                                fit: BoxFit.cover)
                            : null,
                      ),
                      child: _photoFile == null
                          ? const Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.camera_alt_rounded,
                                    color: AppColors.textSecondary, size: 24),
                                SizedBox(height: 2),
                                Text('Photo',
                                    style: TextStyle(
                                        fontSize: 10,
                                        color: AppColors.textSecondary)),
                              ],
                            )
                          : null,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Visitor Photo (Optional)',
                            style: TextStyle(
                                fontSize: 13, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 4),
                        Text(
                          _photoFile == null
                              ? 'Tap camera icon to capture visitor photo'
                              : 'Photo captured successfully!',
                          style: TextStyle(
                              fontSize: 12,
                              color: _photoFile == null
                                  ? AppColors.textDisabled
                                  : AppColors.success),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Visitor Name & Mobile
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                          labelText: 'Visitor Name *',
                          prefixIcon: Icon(Icons.person_outline_rounded)),
                      validator: (v) => (v == null || v.trim().isEmpty)
                          ? 'Name is required'
                          : null,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    flex: 2,
                    child: DropdownButtonFormField<String>(
                      value: _selectedGender,
                      decoration: const InputDecoration(labelText: 'Gender'),
                      items: _genders
                          .map(
                              (g) => DropdownMenuItem(value: g, child: Text(g)))
                          .toList(),
                      onChanged: (v) => setState(() => _selectedGender = v!),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                    labelText: 'Mobile Number *',
                    prefixIcon: Icon(Icons.phone_outlined)),
                validator: (v) => (v == null || v.trim().length < 10)
                    ? 'Valid 10-digit mobile number required'
                    : null,
              ),
              const SizedBox(height: AppSpacing.md),

              if (_selectedType == EntryType.delivery ||
                  _selectedType == EntryType.cab) ...[
                TextFormField(
                  controller: _companyController,
                  decoration: InputDecoration(
                    labelText: _selectedType == EntryType.delivery
                        ? 'Company Name (e.g. Zomato, Amazon)'
                        : 'Cab Service (e.g. Uber, Ola)',
                    prefixIcon: const Icon(Icons.local_shipping_outlined),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
              ],

              // Flat & Tower Selection + Real-Time Validation
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 2,
                    child: DropdownButtonFormField<String>(
                      isExpanded: true,
                      value: _selectedTower,
                      decoration:
                          const InputDecoration(labelText: 'Block / Tower'),
                      items: _towers
                          .map((t) => DropdownMenuItem(
                              value: t,
                              child: Text(
                                t,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12),
                              )))
                          .toList(),
                      onChanged: (v) {
                        setState(() => _selectedTower = v!);
                        _validateFlatNow(_flatController.text);
                      },
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    flex: 3,
                    child: TextFormField(
                      controller: _flatController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                          labelText: 'Flat No. * (e.g. 101)',
                          prefixIcon: Icon(Icons.home_outlined)),
                      onChanged: _validateFlatNow,
                      validator: (v) =>
                          (v == null || v.trim().isEmpty) ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),

              // Live Flat Validation Display Banner
              if (_isValidatingFlat)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 4),
                  child: Row(children: [
                    SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2)),
                    SizedBox(width: 8),
                    Text('Validating flat assignment...',
                        style: TextStyle(
                            fontSize: 12, color: AppColors.textSecondary)),
                  ]),
                )
              else if (_flatValidationResult != null)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: _flatValidationResult!.isValid
                        ? AppColors.successSurface.withValues(alpha: 0.2)
                        : AppColors.error.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    border: Border.all(
                      color: _flatValidationResult!.isValid
                          ? AppColors.success
                          : AppColors.error,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _flatValidationResult!.isValid
                            ? Icons.check_circle_rounded
                            : Icons.error_rounded,
                        size: 16,
                        color: _flatValidationResult!.isValid
                            ? AppColors.success
                            : AppColors.error,
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          _flatValidationResult!.isValid
                              ? 'Resident: ${_flatValidationResult!.residentName ?? ""}'
                              : (_flatValidationResult!.error ??
                                  'Invalid Flat'),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: _flatValidationResult!.isValid
                                ? AppColors.success
                                : AppColors.error,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: AppSpacing.md),

              // Vehicle Information
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: TextFormField(
                      controller: _vehicleController,
                      decoration: const InputDecoration(
                          labelText: 'Vehicle Number (Optional)',
                          prefixIcon: Icon(Icons.directions_car_outlined)),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    flex: 2,
                    child: DropdownButtonFormField<String>(
                      value: _selectedVehicleType,
                      decoration: const InputDecoration(labelText: 'Type'),
                      items: _vehicleTypes
                          .map(
                              (v) => DropdownMenuItem(value: v, child: Text(v)))
                          .toList(),
                      onChanged: (v) =>
                          setState(() => _selectedVehicleType = v!),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // Remarks / Additional Notes
              TextFormField(
                controller: _notesController,
                maxLines: 2,
                decoration: const InputDecoration(
                  labelText: 'Remarks / Notes (Optional)',
                  hintText: 'e.g. Carrying heavy package, verified ID card',
                ),
              ),
              const SizedBox(height: AppSpacing.xl),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _isSubmitting ? null : _submitEntry,
                  icon: _isSubmitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                              color: Colors.white, strokeWidth: 2))
                      : const Icon(Icons.send_rounded),
                  label: Text(_isSubmitting
                      ? 'Logging & Notifying...'
                      : 'Submit Visitor Entry Request'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.secondary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.lg)),
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
