import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  String? _selectedSociety;
  String? _selectedTower;
  String? _selectedFlat;
  String _selectedResidentType = 'owner';
  bool _isLoading = false;

  // Mock data — will come from API
  final List<String> _societies = ['Green Valley Society', 'Sunrise Heights', 'Blue Bell Apartments'];
  final List<String> _towers = ['Tower A', 'Tower B', 'Tower C'];
  final List<String> _flats = ['101', '102', '103', '201', '202', '301'];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _submitRegistration() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedSociety == null || _selectedTower == null || _selectedFlat == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select your society, tower, and flat')),
      );
      return;
    }
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _isLoading = false);
    if (!mounted) return;
    context.go(AppRoutes.pendingApproval);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Complete Registration'),
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _SectionHeader(title: 'Personal Information'),
                const SizedBox(height: AppSpacing.md),
                _LabeledField(
                  label: 'Full Name',
                  child: TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(hintText: 'Enter your full name'),
                    validator: (v) => v == null || v.isEmpty ? 'Name is required' : null,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                _LabeledField(
                  label: 'Email (Optional)',
                  child: TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(hintText: 'your@email.com'),
                    validator: (v) {
                      if (v == null || v.isEmpty) return null;
                      if (!v.contains('@')) return 'Enter a valid email';
                      return null;
                    },
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                _LabeledField(
                  label: 'Resident Type',
                  child: Row(
                    children: [
                      _ResidentTypeChip(
                        label: 'Owner',
                        icon: Icons.home_rounded,
                        isSelected: _selectedResidentType == 'owner',
                        onTap: () => setState(() => _selectedResidentType = 'owner'),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      _ResidentTypeChip(
                        label: 'Tenant',
                        icon: Icons.person_rounded,
                        isSelected: _selectedResidentType == 'tenant',
                        onTap: () => setState(() => _selectedResidentType = 'tenant'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),
                const _SectionHeader(title: 'Society & Flat Details'),
                const SizedBox(height: AppSpacing.md),
                _LabeledField(
                  label: 'Society',
                  child: DropdownButtonFormField<String>(
                    value: _selectedSociety,
                    decoration: const InputDecoration(hintText: 'Select your society'),
                    items: _societies.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                    onChanged: (v) => setState(() { _selectedSociety = v; _selectedTower = null; _selectedFlat = null; }),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                _LabeledField(
                  label: 'Tower / Block',
                  child: DropdownButtonFormField<String>(
                    value: _selectedTower,
                    decoration: const InputDecoration(hintText: 'Select your tower'),
                    items: _towers.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                    onChanged: (v) => setState(() { _selectedTower = v; _selectedFlat = null; }),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                _LabeledField(
                  label: 'Flat Number',
                  child: DropdownButtonFormField<String>(
                    value: _selectedFlat,
                    decoration: const InputDecoration(hintText: 'Select your flat'),
                    items: _flats.map((s) => DropdownMenuItem(value: s, child: Text('Flat $s'))).toList(),
                    onChanged: (v) => setState(() => _selectedFlat = v),
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.infoSurface,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    border: Border.all(color: AppColors.info.withOpacity(0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.info_outline_rounded, color: AppColors.info, size: 18),
                      SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: Text(
                          'Your registration will be reviewed by the society admin. You\'ll be notified once approved.',
                          style: TextStyle(fontSize: 13, color: AppColors.info, height: 1.5),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),
                ElevatedButton(
                  onPressed: _isLoading ? null : _submitRegistration,
                  child: _isLoading
                      ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('Submit Registration'),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),
    );
  }
}

class _LabeledField extends StatelessWidget {
  final String label;
  final Widget child;
  const _LabeledField({required this.label, required this.child});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textSecondary)),
        const SizedBox(height: 6),
        child,
      ],
    );
  }
}

class _ResidentTypeChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _ResidentTypeChip({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primarySurface : AppColors.gray100,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, size: 16, color: isSelected ? AppColors.primary : AppColors.textSecondary),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
