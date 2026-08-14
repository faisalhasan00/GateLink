import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../providers/complaint_providers.dart';
import '../controllers/complaint_controller.dart';

class RaiseComplaintScreen extends ConsumerStatefulWidget {
  const RaiseComplaintScreen({super.key});

  @override
  ConsumerState<RaiseComplaintScreen> createState() =>
      _RaiseComplaintScreenState();
}

class _RaiseComplaintScreenState extends ConsumerState<RaiseComplaintScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String? _selectedCategory;
  String _selectedPriority = 'medium';
  File? _imageFile;
  final _picker = ImagePicker();
  final _blockController = TextEditingController();
  final _floorController = TextEditingController();

  final List<String> _categories = [
    'Plumbing',
    'Electrical',
    'Housekeeping',
    'Security',
    'Lift / Elevator',
    'Parking',
    'Water Supply',
    'Internet / Cable',
    'Common Area',
    'Pest Control',
    'Other',
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _blockController.dispose();
    _floorController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final pickedFile =
        await _picker.pickImage(source: ImageSource.gallery, imageQuality: 70);
    if (pickedFile != null) {
      setState(() => _imageFile = File(pickedFile.path));
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a category')),
      );
      return;
    }

    final user = ref.read(currentUserProvider);
    final userProfile = ref.read(userProfileProvider).value;

    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Error: Not authenticated. Please login again.')),
      );
      return;
    }

    try {
      String? photoUrl;
      if (_imageFile != null) {
        final societyId = userProfile?.societyId ?? 'SOC-001';
        final storage = ref.read(storageServiceProvider);
        final uniqueId = DateTime.now().millisecondsSinceEpoch.toString();
        photoUrl = await storage.uploadComplaintImage(
            _imageFile!, societyId, uniqueId);
        if (photoUrl.isEmpty) photoUrl = null;
      }

      final resName = userProfile?.name.isNotEmpty == true
          ? userProfile!.name
          : (user.displayName ?? 'Resident');
      final flatNo = userProfile?.flatNumber ?? '';
      final societyId = userProfile?.societyId ?? 'SOC-001';

      final success =
          await ref.read(complaintControllerProvider.notifier).raiseComplaint(
                societyId: societyId,
                residentUid: user.uid,
                residentName: resName,
                flatNumber: flatNo,
                title: _titleController.text,
                description: _descController.text,
                category: _selectedCategory!,
                block: _blockController.text,
                floor: _floorController.text,
                priority: _selectedPriority,
                photoUrl: photoUrl,
              );

      if (!mounted) return;

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Complaint raised successfully!'),
            backgroundColor: AppColors.success,
          ),
        );
        context.go(AppRoutes.complaints);
      } else {
        final errorMsg = ref.read(complaintControllerProvider).errorMessage ??
            'Failed to raise complaint.';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMsg),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to raise complaint: $e'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(userProfileProvider).value;
    final resName =
        profile?.name.isNotEmpty == true ? profile!.name : 'Resident';
    final flatNum =
        profile?.flatNumber.isNotEmpty == true ? profile!.flatNumber : 'A-101';
    final block =
        profile?.tower.isNotEmpty == true ? profile!.tower : 'Tower A';
    const floor = '1st Floor';

    if (_blockController.text.isEmpty && block.isNotEmpty) {
      _blockController.text = block;
    }
    if (_floorController.text.isEmpty && floor.isNotEmpty) {
      _floorController.text = floor;
    }

    final controllerState = ref.watch(complaintControllerProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Raise Complaint')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.primarySurface,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(
                      color: AppColors.primary.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: AppColors.primary,
                      child: Text(
                        resName.substring(0, 1).toUpperCase(),
                        style: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(resName,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 15)),
                          const SizedBox(height: 2),
                          Text('Flat: $flatNum • $block, $floor',
                              style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              const _FieldLabel(label: 'Category *'),
              const SizedBox(height: AppSpacing.xs),
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                hint: const Text('Select category'),
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
                items: _categories
                    .map(
                        (cat) => DropdownMenuItem(value: cat, child: Text(cat)))
                    .toList(),
                onChanged: (val) => setState(() => _selectedCategory = val),
              ),
              const SizedBox(height: AppSpacing.md),
              const _FieldLabel(label: 'Complaint Title *'),
              const SizedBox(height: AppSpacing.xs),
              TextFormField(
                controller: _titleController,
                decoration: InputDecoration(
                  hintText: 'Brief summary of the issue',
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
                validator: (v) =>
                    v == null || v.trim().isEmpty ? 'Title is required' : null,
              ),
              const SizedBox(height: AppSpacing.md),
              const _FieldLabel(label: 'Detailed Description *'),
              const SizedBox(height: AppSpacing.xs),
              TextFormField(
                controller: _descController,
                maxLines: 4,
                decoration: InputDecoration(
                  hintText:
                      'Provide exact details (location, timing, problem)...',
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Description is required'
                    : null,
              ),
              const SizedBox(height: AppSpacing.md),
              const _FieldLabel(label: 'Priority Level'),
              const SizedBox(height: AppSpacing.xs),
              Row(
                children: [
                  _PriorityChip(
                    label: 'Low',
                    selected: _selectedPriority == 'low',
                    color: AppColors.info,
                    onTap: () => setState(() => _selectedPriority = 'low'),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  _PriorityChip(
                    label: 'Medium',
                    selected: _selectedPriority == 'medium',
                    color: AppColors.warning,
                    onTap: () => setState(() => _selectedPriority = 'medium'),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  _PriorityChip(
                    label: 'Urgent',
                    selected: _selectedPriority == 'high',
                    color: AppColors.error,
                    onTap: () => setState(() => _selectedPriority = 'high'),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),
              const _FieldLabel(label: 'Attach Photo (Optional)'),
              const SizedBox(height: AppSpacing.xs),
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  width: double.infinity,
                  height: 120,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: _imageFile != null
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(AppRadius.md),
                          child: Image.file(_imageFile!, fit: BoxFit.cover),
                        )
                      : const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.add_a_photo_outlined,
                                color: AppColors.textSecondary, size: 32),
                            SizedBox(height: 6),
                            Text('Tap to take or pick photo',
                                style: TextStyle(
                                    color: AppColors.textSecondary,
                                    fontSize: 12)),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: controllerState.isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.lg)),
                  ),
                  child: controllerState.isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                              color: Colors.white, strokeWidth: 2.5),
                        )
                      : const Text(
                          'Submit Complaint',
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white),
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

class _FieldLabel extends StatelessWidget {
  final String label;
  const _FieldLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(label,
        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold));
  }
}

class _PriorityChip extends StatelessWidget {
  final String label;
  final bool selected;
  final Color color;
  final VoidCallback onTap;

  const _PriorityChip({
    required this.label,
    required this.selected,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: selected ? color.withValues(alpha: 0.15) : Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: selected ? color : AppColors.border),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                color: selected ? color : AppColors.textSecondary,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
