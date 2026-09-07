import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/services/firestore_service.dart';
import '../../models/gate_entry_model.dart';
import '../widgets/guard_header_banner.dart';
import '../widgets/entry_type_selector.dart';
import '../widgets/quick_entry_flat_picker.dart';
import '../widgets/quick_entry_visitor_form.dart';

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

  final String _selectedGender = 'Male';
  String _selectedVehicleType = '4-Wheeler';
  String _selectedTower = 'All Blocks / Direct';

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

  Future<void> _validateFlatNow(String val) async {
    final formattedFlat = _getFormattedFlatNumber(val);
    if (formattedFlat.isEmpty) {
      setState(() => _flatValidationResult = null);
      return;
    }

    setState(() => _isValidatingFlat = true);
    final firestoreService = ref.read(firestoreServiceProvider);
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
    final firestoreService = ref.read(firestoreServiceProvider);

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
      final visitorType = _selectedType == EntryType.guest
          ? 'Guest'
          : _selectedType == EntryType.delivery
              ? 'Delivery'
              : _selectedType == EntryType.cab
                  ? 'Cab'
                  : 'Daily Help';

      final user = FirebaseAuth.instance.currentUser;
      final profileData = ref.read(userProfileProvider).value;

      await firestoreService.logVisitorEntry(
        name: _nameController.text.trim(),
        type: visitorType,
        hostFlat: targetFlat,
        phone: _phoneController.text.trim(),
        vehicleNumber: _vehicleController.text.trim(),
        vehicleType: _selectedVehicleType,
        company: _companyController.text.trim(),
        gender: _selectedGender,
        photoUrl: null,
        notes: _notesController.text.trim(),
        guardUid: user?.uid,
        gateName: profileData?['gateName'] ?? 'Gate 1 — Main Entry',
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
              GuardHeaderBanner(
                societyName: societyName,
                gateName: gateName,
                guardName: guardName,
              ),
              const SizedBox(height: AppSpacing.lg),

              EntryTypeSelector(
                selectedType: _selectedType,
                onTypeSelected: (type) => setState(() => _selectedType = type),
              ),
              const SizedBox(height: AppSpacing.lg),

              QuickEntryFlatPicker(
                selectedTower: _selectedTower,
                towers: _towers,
                flatController: _flatController,
                isValidatingFlat: _isValidatingFlat,
                flatValidationResult: _flatValidationResult,
                onTowerChanged: (val) {
                  if (val != null) {
                    setState(() => _selectedTower = val);
                    if (_flatController.text.isNotEmpty) _validateFlatNow(_flatController.text);
                  }
                },
                onFlatChanged: _validateFlatNow,
              ),

              const SizedBox(height: AppSpacing.md),

              QuickEntryVisitorForm(
                nameController: _nameController,
                phoneController: _phoneController,
                vehicleController: _vehicleController,
                selectedVehicleType: _selectedVehicleType,
                vehicleTypes: _vehicleTypes,
                onVehicleTypeChanged: (val) {
                  if (val != null) setState(() => _selectedVehicleType = val);
                },
              ),

              const SizedBox(height: AppSpacing.xl),

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
