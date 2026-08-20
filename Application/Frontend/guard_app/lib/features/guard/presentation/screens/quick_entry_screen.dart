import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/services/firestore_service.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/widgets/widgets.dart';
import '../../../visitor/domain/models/visitor_model.dart';
import '../../../visitor/presentation/controllers/visitor_controller.dart';
import '../../models/gate_entry_model.dart';
import '../widgets/entry_guard_header.dart';
import '../widgets/entry_category_selector.dart';
import '../widgets/entry_photo_picker.dart';
import '../widgets/entry_visitor_info_form.dart';
import '../widgets/entry_flat_selector.dart';
import '../widgets/entry_vehicle_selector.dart';

class QuickEntryScreen extends ConsumerStatefulWidget {
  const QuickEntryScreen({super.key});

  @override
  ConsumerState<QuickEntryScreen> createState() => _QuickEntryScreenState();
}

class _QuickEntryScreenState extends ConsumerState<QuickEntryScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isSubmitting = false;
  EntryType _selectedType = EntryType.guest;

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
    final picked = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 70,
    );
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
    final societyId = profile?['societyId'] as String?;
    if (societyId == null || societyId.isEmpty) {
      setState(() {
        _flatValidationResult = FlatValidationResult(
          isValid: false,
          error: 'Society ID missing',
        );
        _isValidatingFlat = false;
      });
      return;
    }
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
    final societyId = profile?['societyId'] as String?;
    if (societyId == null || societyId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('❌ Society ID is missing from profile'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final firestoreService = ref.read(firestoreServiceProvider) ??
        FirestoreService(societyId: societyId);

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

      final newVisitor = VisitorModel(
        id: '',
        name: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
        type: visitorType,
        hostFlat: targetFlat,
        hostResidentUid: validation.residentUid,
        hostResidentName: validation.residentName,
        vehicleNumber: _vehicleController.text.trim(),
        vehicleType: _selectedVehicleType,
        company: _companyController.text.trim(),
        gender: _selectedGender,
        photoUrl: photoUrl,
        notes: _notesController.text.trim(),
        status: 'pending',
        createdAt: DateTime.now(),
        guardUid: user?.uid,
        gateName: profile?['gateName'] ?? 'Gate 1 — Main Entry',
      );

      await ref
          .read(visitorControllerProvider.notifier)
          .logVisitorEntry(newVisitor);

      if (mounted) {
        _clearForm();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              '✅ Visitor request logged & sent to ${validation.residentName} ($targetFlat)!',
            ),
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
            content: Text('❌ $errText'),
            backgroundColor: AppColors.error,
          ),
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
    final guardName =
        profile?['name'] ?? user?.displayName ?? 'Security Guard';

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
              // 1. Modular Gate & Guard Header
              EntryGuardHeader(
                societyName: societyName,
                gateName: gateName,
                guardName: guardName,
              ),
              const SizedBox(height: AppSpacing.lg),

              // 2. Modular Category Selector
              EntryCategorySelector(
                selectedType: _selectedType,
                onTypeChanged: (t) => setState(() => _selectedType = t),
              ),
              const SizedBox(height: AppSpacing.lg),

              // 3. Modular Photo Capture
              EntryPhotoPicker(
                photoFile: _photoFile,
                onPickPhoto: _pickPhoto,
              ),
              const SizedBox(height: AppSpacing.lg),

              // 4. Modular Visitor Info Form (Name, Gender, Phone, Company, Notes)
              EntryVisitorInfoForm(
                nameController: _nameController,
                phoneController: _phoneController,
                companyController: _companyController,
                notesController: _notesController,
                selectedGender: _selectedGender,
                genders: _genders,
                selectedType: _selectedType,
                onGenderChanged: (g) => setState(() => _selectedGender = g),
              ),
              const SizedBox(height: AppSpacing.md),

              // 5. Modular Flat Selector & Realtime Verification
              EntryFlatSelector(
                selectedTower: _selectedTower,
                towers: _towers,
                flatController: _flatController,
                isValidating: _isValidatingFlat,
                validationResult: _flatValidationResult,
                onTowerChanged: (t) {
                  setState(() => _selectedTower = t);
                  _validateFlatNow(_flatController.text);
                },
                onFlatChanged: _validateFlatNow,
              ),
              const SizedBox(height: AppSpacing.md),

              // 6. Modular Vehicle Details
              EntryVehicleSelector(
                vehicleController: _vehicleController,
                selectedVehicleType: _selectedVehicleType,
                vehicleTypes: _vehicleTypes,
                onVehicleTypeChanged: (v) =>
                    setState(() => _selectedVehicleType = v),
              ),
              const SizedBox(height: AppSpacing.xl),

              // 7. Reusable AppButton
              AppButton(
                text: _isSubmitting
                    ? 'Logging & Notifying...'
                    : 'Submit Visitor Entry Request',
                onPressed: _submitEntry,
                isLoading: _isSubmitting,
                size: AppButtonSize.lg,
                leadingIcon: Icons.send_rounded,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
