import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/providers/firebase_providers.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/services/storage_service.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class RaiseComplaintScreen extends ConsumerStatefulWidget {
  const RaiseComplaintScreen({super.key});

  @override
  ConsumerState<RaiseComplaintScreen> createState() => _RaiseComplaintScreenState();
}

class _RaiseComplaintScreenState extends ConsumerState<RaiseComplaintScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String? _selectedCategory;
  String _selectedPriority = 'medium';
  bool _isLoading = false;
  File? _imageFile;
  final _picker = ImagePicker();
  final _blockController = TextEditingController();
  final _floorController = TextEditingController();

  final List<String> _categories = [
    'Plumbing', 'Electrical', 'Housekeeping', 'Security', 'Lift / Elevator',
    'Parking', 'Water Supply', 'Internet / Cable', 'Common Area', 'Pest Control', 'Other',
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
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 70);
    if (pickedFile != null) {
      setState(() => _imageFile = File(pickedFile.path));
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a category')));
      return;
    }

    final user = ref.read(currentUserProvider);
    final userProfile = ref.read(userProfileProvider).value;
    final firestore = ref.read(firestoreServiceProvider);

    if (user == null || firestore == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error: Not authenticated or service unavailable.')));
      return;
    }

    setState(() => _isLoading = true);

    try {
      String? photoUrl;
      if (_imageFile != null) {
        final societyId = userProfile?['societyId'] as String? ?? 'SOC-001';
        final storage = ref.read(storageServiceProvider);
        final uniqueId = DateTime.now().millisecondsSinceEpoch.toString();
        photoUrl = await storage.uploadComplaintImage(_imageFile!, societyId, uniqueId);
        if (photoUrl.isEmpty) photoUrl = null;
      }

      final resName = (userProfile?['name'] as String? ?? user.displayName ?? 'Resident').trim();
      final flatNo = (userProfile?['flatNumber'] as String? ?? '').trim();

      await firestore.raiseComplaint(
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        category: _selectedCategory!,
        uid: user.uid,
        block: _blockController.text.trim(),
        floor: _floorController.text.trim(),
        priority: _selectedPriority,
        photoUrl: photoUrl,
        residentName: resName,
        flatNumber: flatNo,
      );
      
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Complaint raised successfully!'),
          backgroundColor: AppColors.success,
        ),
      );
      context.go(AppRoutes.complaints);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to raise complaint: $e'),
          backgroundColor: AppColors.error,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(userProfileProvider).value;
    final resName = profile?['name'] ?? 'Resident';
    final flatNum = profile?['flatNumber'] ?? 'A-101';
    final block = profile?['block'] ?? profile?['tower'] ?? 'Tower A';
    final floor = profile?['floor'] ?? '1st Floor';
    final societyId = profile?['societyId'] ?? 'SOC-001';

    // Auto-fill controllers if not touched yet
    if (_blockController.text.isEmpty && block.isNotEmpty) {
      _blockController.text = block;
    }
    if (_floorController.text.isEmpty && floor.isNotEmpty) {
      _floorController.text = floor;
    }

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
              // Auto-linked Resident Information Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.primarySurface,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundColor: AppColors.primary.withValues(alpha: 0.2),
                      child: const Icon(Icons.person_rounded, color: AppColors.primary, size: 22),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(resName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary)),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(4)),
                                child: const Text('AUTO-LINKED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.white)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text('Flat $flatNum  •  $block ($floor)', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          Text('Society Code: $societyId', style: const TextStyle(fontSize: 11, color: AppColors.textDisabled)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Category
              const _FieldLabel(label: 'Category'),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(hintText: 'Select complaint category'),
                items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (v) => setState(() => _selectedCategory = v),
              ),
              const SizedBox(height: AppSpacing.md),

              // Title
              const _FieldLabel(label: 'Complaint Title'),
              const SizedBox(height: 6),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(hintText: 'Brief title of the issue'),
                validator: (v) => (v == null || v.isEmpty) ? 'Title is required' : null,
              ),
              const SizedBox(height: AppSpacing.md),

              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const _FieldLabel(label: 'Block Name'),
                        const SizedBox(height: 6),
                        TextFormField(
                          controller: _blockController,
                          decoration: const InputDecoration(hintText: 'e.g. A, B'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const _FieldLabel(label: 'Floor'),
                        const SizedBox(height: 6),
                        TextFormField(
                          controller: _floorController,
                          decoration: const InputDecoration(hintText: 'e.g. 1st, 2nd'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // Description
              const _FieldLabel(label: 'Description'),
              const SizedBox(height: 6),
              TextFormField(
                controller: _descController,
                maxLines: 4,
                decoration: const InputDecoration(
                  hintText: 'Describe the issue in detail...',
                  alignLabelWithHint: true,
                ),
                validator: (v) => (v == null || v.length < 10) ? 'Please describe the issue (min 10 characters)' : null,
              ),
              const SizedBox(height: AppSpacing.md),

              // Priority
              const _FieldLabel(label: 'Priority'),
              const SizedBox(height: 10),
              Row(
                children: [
                  _PriorityChip(label: 'Low', value: 'low', color: AppColors.success,
                      selected: _selectedPriority == 'low', onTap: () => setState(() => _selectedPriority = 'low')),
                  const SizedBox(width: AppSpacing.sm),
                  _PriorityChip(label: 'Medium', value: 'medium', color: AppColors.warning,
                      selected: _selectedPriority == 'medium', onTap: () => setState(() => _selectedPriority = 'medium')),
                  const SizedBox(width: AppSpacing.sm),
                  _PriorityChip(label: 'High', value: 'high', color: AppColors.error,
                      selected: _selectedPriority == 'high', onTap: () => setState(() => _selectedPriority = 'high')),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // Photo attachment
              const _FieldLabel(label: 'Attach Photos (Optional)'),
              const SizedBox(height: 6),
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  height: 120,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.border, style: BorderStyle.solid),
                    image: _imageFile != null
                        ? DecorationImage(
                            image: FileImage(_imageFile!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: _imageFile == null
                      ? const Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                          Icon(Icons.camera_alt_rounded, color: AppColors.textSecondary, size: 28),
                          SizedBox(height: 6),
                          Text('Tap to attach a photo', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                        ])
                      : Align(
                          alignment: Alignment.topRight,
                          child: IconButton(
                            icon: const Icon(Icons.cancel, color: Colors.white, shadows: [Shadow(color: Colors.black54, blurRadius: 4)]),
                            onPressed: () => setState(() => _imageFile = null),
                          ),
                        ),
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
              ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                child: _isLoading
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Text('Submit Complaint'),
              ),
              const SizedBox(height: AppSpacing.lg),
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
  Widget build(BuildContext context) => Text(label,
    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textSecondary));
}

class _PriorityChip extends StatelessWidget {
  final String label, value;
  final Color color;
  final bool selected;
  final VoidCallback onTap;
  const _PriorityChip({required this.label, required this.value, required this.color, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: selected ? color.withOpacity(0.12) : Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: selected ? color : AppColors.border, width: selected ? 1.5 : 1),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 6),
        Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500,
            color: selected ? color : AppColors.textSecondary)),
      ]),
    ),
  );
}
