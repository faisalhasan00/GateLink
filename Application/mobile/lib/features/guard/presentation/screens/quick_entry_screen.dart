import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/services/firestore_service.dart';
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

  String _selectedTower = 'Tower A';
  final List<String> _towers = ['Tower A', 'Tower B', 'Tower C', 'Tower D'];

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _flatController.dispose();
    _vehicleController.dispose();
    _companyController.dispose();
    super.dispose();
  }

  Future<void> _submitEntry() async {
    if (!_formKey.currentState!.validate()) return;
    if (_isSubmitting) return;

    setState(() => _isSubmitting = true);

    try {
      final firestoreService = ref.read(firestoreServiceProvider) ?? FirestoreService(societyId: 'SOC-001');

      final visitorType = _selectedType == EntryType.guest
          ? 'Guest'
          : _selectedType == EntryType.delivery
              ? 'Delivery'
              : _selectedType == EntryType.cab
                  ? 'Cab'
                  : 'Daily Help';

      await firestoreService.logVisitorEntry(
        name: _nameController.text.trim(),
        type: visitorType,
        hostFlat: '$_selectedTower-${_flatController.text.trim()}',
        phone: _phoneController.text.trim(),
        vehicleNumber: _vehicleController.text.trim(),
        company: _companyController.text.trim(),
      );

      if (mounted) {
        _clearForm();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Visitor logged to Firestore!'),
            backgroundColor: AppColors.secondary,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
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
  }

  @override
  Widget build(BuildContext context) {
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
              // Entry Type Selection Selector
              const Text('Select Entry Category', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
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
                    type: type,
                    status: EntryStatus.inside,
                    entryTime: DateTime.now(),
                  );

                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedType = type),
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? model.typeColor : Colors.white,
                          borderRadius: BorderRadius.circular(AppRadius.lg),
                          border: Border.all(
                            color: isSelected ? model.typeColor : AppColors.border,
                          ),
                        ),
                        child: Column(
                          children: [
                            Icon(
                              model.typeIcon,
                              color: isSelected ? Colors.white : model.typeColor,
                              size: 20,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              model.typeLabel,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: isSelected ? Colors.white : AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Company Name if Cab or Delivery
              if (_selectedType == EntryType.delivery || _selectedType == EntryType.cab) ...[
                TextFormField(
                  controller: _companyController,
                  decoration: InputDecoration(
                    labelText: _selectedType == EntryType.delivery ? 'Company Name (e.g. Swiggy, Zomato, Amazon)' : 'Cab Service (e.g. Uber, Ola)',
                    prefixIcon: const Icon(Icons.store_rounded),
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
              ],

              // Visitor Name
              TextFormField(
                controller: _nameController,
                validator: (val) => val == null || val.isEmpty ? 'Please enter visitor name' : null,
                decoration: InputDecoration(
                  labelText: 'Visitor Full Name *',
                  prefixIcon: const Icon(Icons.person_outline_rounded),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              // Phone Number
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                validator: (val) => val == null || val.isEmpty ? 'Please enter phone number' : null,
                decoration: InputDecoration(
                  labelText: 'Phone Number *',
                  prefixIcon: const Icon(Icons.phone_outlined),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              // Destination: Tower & Flat Number
              Row(
                children: [
                  Expanded(
                    flex: 4,
                    child: DropdownButtonFormField<String>(
                      initialValue: _selectedTower,
                      items: _towers
                          .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                          .toList(),
                      onChanged: (val) => setState(() => _selectedTower = val!),
                      decoration: InputDecoration(
                        labelText: 'Tower',
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                      ),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    flex: 4,
                    child: TextFormField(
                      controller: _flatController,
                      keyboardType: TextInputType.number,
                      validator: (val) => val == null || val.isEmpty ? 'Enter Flat' : null,
                      decoration: InputDecoration(
                        labelText: 'Flat No. *',
                        prefixIcon: const Icon(Icons.door_front_door_outlined),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // Vehicle Number
              TextFormField(
                controller: _vehicleController,
                textCapitalization: TextCapitalization.characters,
                decoration: InputDecoration(
                  labelText: 'Vehicle Number (Optional)',
                  prefixIcon: const Icon(Icons.directions_car_outlined),
                  hintText: 'e.g. MH 12 AB 1234',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
                ),
              ),
              const SizedBox(height: AppSpacing.xl),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _submitEntry,
                  icon: const Icon(Icons.send_rounded),
                  label: const Text('SUBMIT & NOTIFY RESIDENT', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xl)),
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
