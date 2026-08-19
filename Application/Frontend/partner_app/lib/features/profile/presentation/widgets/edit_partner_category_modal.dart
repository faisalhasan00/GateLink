import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/partner_auth_provider.dart';

class EditPartnerCategoryModal extends ConsumerStatefulWidget {
  const EditPartnerCategoryModal({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const EditPartnerCategoryModal(),
    );
  }

  @override
  ConsumerState<EditPartnerCategoryModal> createState() => _EditPartnerCategoryModalState();
}

class _EditPartnerCategoryModalState extends ConsumerState<EditPartnerCategoryModal> {
  final List<String> _categories = [
    'Real Estate Broker',
    'Channel Partner Agency',
    'Society Management Consultant',
    'Resident / RWA Board Member',
    'Security Guard Vendor',
    'Individual Affiliate Partner',
    'Custom Category',
  ];

  late String _selectedCategory;
  final _customCategoryController = TextEditingController();
  final _nameController = TextEditingController();
  final _upiController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final user = ref.read(partnerAuthProvider);
    _selectedCategory = user?.category ?? 'Real Estate Broker';
    if (!_categories.contains(_selectedCategory)) {
      _customCategoryController.text = _selectedCategory;
      _selectedCategory = 'Custom Category';
    }
    _nameController.text = user?.name ?? '';
    _upiController.text = user?.upiId ?? '';
  }

  @override
  void dispose() {
    _customCategoryController.dispose();
    _nameController.dispose();
    _upiController.dispose();
    super.dispose();
  }

  Future<void> _handleSave() async {
    final finalCategory = _selectedCategory == 'Custom Category'
        ? _customCategoryController.text.trim()
        : _selectedCategory;

    if (finalCategory.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select or specify a category')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final currentUser = ref.read(partnerAuthProvider);
      final phone = currentUser?.phone ?? '9845011223';
      final name = _nameController.text.trim().isNotEmpty ? _nameController.text.trim() : (currentUser?.name ?? 'Partner');
      final upi = _upiController.text.trim().isNotEmpty ? _upiController.text.trim() : (currentUser?.upiId ?? '');

      // Update Firestore
      await FirebaseFirestore.instance.collection('partners').doc(phone).set({
        'category': finalCategory,
        'name': name,
        'upiId': upi,
        'updatedAt': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));

      // Update local state
      await ref.read(partnerAuthProvider.notifier).updateProfile(
        name: name,
        category: finalCategory,
        upiId: upi,
        email: currentUser?.email ?? '',
        city: currentUser?.city ?? '',
      );

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Partner Category updated to "$finalCategory" successfully!')),
        );
      }
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error updating category: $err')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(partnerAuthProvider);

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        top: 20,
        left: AppSpacing.pagePadding,
        right: AppSpacing.pagePadding,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Change Partner Category',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
                    ),
                    Text(
                      'Select or type your partner classification',
                      style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close_rounded),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Profile info summary
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AppColors.primary,
                    child: Text(
                      user?.name.isNotEmpty == true ? user!.name[0].toUpperCase() : 'P',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user?.name ?? 'Partner Name', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        Text('Current: ${user?.category ?? "Real Estate Broker"}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Select New Partner Category *',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 10),

            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _categories.map((cat) {
                final isSelected = _selectedCategory == cat;
                return ChoiceChip(
                  label: Text(cat),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedCategory = cat);
                  },
                  selectedColor: AppColors.primary,
                  labelStyle: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: isSelected ? Colors.white : AppColors.textSecondary,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 14),

            if (_selectedCategory == 'Custom Category') ...[
              TextFormField(
                controller: _customCategoryController,
                decoration: InputDecoration(
                  labelText: 'Enter Custom Partner Category',
                  hintText: 'e.g. Property Security Vendor / Tech Consultant',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.edit_rounded, color: AppColors.primary),
                ),
              ),
              const SizedBox(height: 14),
            ],

            TextFormField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Partner Name',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                prefixIcon: const Icon(Icons.person_rounded, color: AppColors.primary),
              ),
            ),
            const SizedBox(height: 14),

            TextFormField(
              controller: _upiController,
              decoration: InputDecoration(
                labelText: 'Payout UPI ID (for instant ₹500 transfers)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                prefixIcon: const Icon(Icons.account_balance_wallet_rounded, color: AppColors.secondary),
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _handleSave,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                ),
                child: _isLoading
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Update Category & Save', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
