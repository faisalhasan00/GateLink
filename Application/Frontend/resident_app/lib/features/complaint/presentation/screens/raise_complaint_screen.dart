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
import '../widgets/category_selector_grid.dart';
import '../widgets/priority_selector_row.dart';
import '../widgets/complaint_image_picker_card.dart';

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
    final resName = profile?.name.isNotEmpty == true
        ? profile!.name
        : (ref.watch(currentUserProvider)?.displayName ?? 'Resident');
    final flatNo = profile?.flatNumber ?? 'N/A';
    final state = ref.watch(complaintControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Raise Complaint'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Resident info banner
              Container(
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(10),
                  border: BorderSide(color: AppColors.primary.withOpacity(0.2)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.apartment, color: AppColors.primary, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '$resName • Flat $flatNo',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              // Category Selector
              const Text(
                'Select Category *',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
              ),
              const SizedBox(height: 8),
              CategorySelectorGrid(
                categories: _categories,
                selectedCategory: _selectedCategory,
                onCategorySelected: (cat) => setState(() => _selectedCategory = cat),
              ),
              const SizedBox(height: AppSpacing.md),

              // Title
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Complaint Title *',
                  hintText: 'e.g., Water leakage in bathroom',
                  prefixIcon: Icon(Icons.title),
                ),
                validator: (val) =>
                    val == null || val.trim().isEmpty ? 'Title is required' : null,
              ),
              const SizedBox(height: AppSpacing.md),

              // Description
              TextFormField(
                controller: _descController,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Description *',
                  hintText: 'Describe the issue with specific details...',
                  prefixIcon: Icon(Icons.description_outlined),
                ),
                validator: (val) => val == null || val.trim().isEmpty
                    ? 'Description is required'
                    : null,
              ),
              const SizedBox(height: AppSpacing.md),

              // Priority Selector
              const Text(
                'Priority Level',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
              ),
              const SizedBox(height: 8),
              PrioritySelectorRow(
                selectedPriority: _selectedPriority,
                onPriorityChanged: (p) => setState(() => _selectedPriority = p),
              ),
              const SizedBox(height: AppSpacing.md),

              // Photo Attachment Picker
              ComplaintImagePickerCard(
                imageFile: _imageFile,
                onPickImage: _pickImage,
                onRemoveImage: () => setState(() => _imageFile = null),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: state.isLoading ? null : _submit,
                  child: state.isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text(
                          'Submit Ticket',
                          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                        ),
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
            ],
          ),
        ),
      ),
    );
  }
}
