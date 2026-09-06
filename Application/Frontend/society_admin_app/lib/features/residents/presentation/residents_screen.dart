import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../../core/widgets/state_views.dart';
import '../../../core/providers/admin_providers.dart';
import '../../../core/models/resident_model.dart';

class ResidentsScreen extends ConsumerStatefulWidget {
  const ResidentsScreen({super.key});

  @override
  ConsumerState<ResidentsScreen> createState() => _ResidentsScreenState();
}

class _ResidentsScreenState extends ConsumerState<ResidentsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  String _generateSecurePassword() {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#\$';
    final random = Random.secure();
    return List.generate(8, (_) => chars[random.nextInt(chars.length)]).join();
  }

  void _showAddResidentModal(BuildContext context, String societyId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _AddResidentBottomSheet(
        societyId: societyId,
        generatePassword: _generateSecurePassword,
      ),
    );
  }

  void _showResidentDetailsModal(BuildContext context, ResidentModel resident, String societyId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _ResidentDetailsBottomSheet(
        resident: resident,
        societyId: societyId,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final society = ref.watch(activeSocietyProvider);
    final residentsAsync = ref.watch(residentsStreamProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Residents Management'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primaryNavy,
          labelColor: AppColors.primaryNavy,
          unselectedLabelColor: AppColors.textSecondary,
          labelStyle: const TextStyle(fontWeight: FontWeight.w700),
          tabs: [
            Tab(
              child: residentsAsync.maybeWhen(
                data: (list) {
                  final pendingCount = list.where((r) => r.status == 'pending').length;
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Approvals'),
                      if (pendingCount > 0) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.accentAmber,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            pendingCount.toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  );
                },
                orElse: () => const Text('Approvals'),
              ),
            ),
            const Tab(text: 'Directory'),
          ],
        ),
      ),
      floatingActionButton: society != null
          ? FloatingActionButton.extended(
              onPressed: () => _showAddResidentModal(context, society.id),
              backgroundColor: AppColors.primaryNavy,
              icon: const Icon(Icons.person_add_alt_1, color: Colors.white),
              label: const Text(
                'Add Resident',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
              ),
            )
          : null,
      body: residentsAsync.when(
        loading: () => const LoadingStateWidget(message: 'Loading residents...'),
        error: (err, _) => ErrorStateWidget(
          message: 'Failed to load residents: ${err.toString()}',
          onRetry: () => ref.invalidate(residentsStreamProvider),
        ),
        data: (residents) {
          final pendingResidents = residents.where((r) => r.status == 'pending').toList();
          final approvedResidents = residents.where((r) => r.status != 'pending').toList();

          final filteredDirectory = approvedResidents.where((r) {
            final q = _searchQuery.toLowerCase();
            return r.name.toLowerCase().contains(q) ||
                r.flatNo.toLowerCase().contains(q) ||
                r.phone.contains(q) ||
                r.wing.toLowerCase().contains(q);
          }).toList();

          return TabBarView(
            controller: _tabController,
            children: [
              // TAB 1: PENDING APPROVALS
              pendingResidents.isEmpty
                  ? const EmptyStateWidget(
                      title: 'No Pending Approvals',
                      description: 'All resident onboarding requests have been reviewed.',
                      icon: Icons.check_circle_outline,
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                      itemCount: pendingResidents.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final resident = pendingResidents[index];
                        return _PendingResidentCard(
                          resident: resident,
                          onApprove: () async {
                            if (society != null) {
                              await ref.read(firestoreServiceProvider).updateResidentStatus(
                                    society.id,
                                    resident.id,
                                    'approved',
                                  );
                            }
                          },
                          onReject: () async {
                            if (society != null) {
                              await ref.read(firestoreServiceProvider).updateResidentStatus(
                                    society.id,
                                    resident.id,
                                    'rejected',
                                  );
                            }
                          },
                        );
                      },
                    ),

              // TAB 2: ACTIVE RESIDENTS DIRECTORY
              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: AppTextField(
                      controller: _searchController,
                      hintText: 'Search by name, flat (e.g. A-402), or phone...',
                      prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                      onChanged: (val) => setState(() => _searchQuery = val),
                    ),
                  ),
                  Expanded(
                    child: filteredDirectory.isEmpty
                        ? const EmptyStateWidget(
                            title: 'No Residents Found',
                            description: 'No resident records match your search criteria.',
                            icon: Icons.person_search_outlined,
                          )
                        : ListView.separated(
                            padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
                            itemCount: filteredDirectory.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 10),
                            itemBuilder: (context, index) {
                              final resident = filteredDirectory[index];
                              return GestureDetector(
                                onTap: () {
                                  if (society != null) {
                                    _showResidentDetailsModal(context, resident, society.id);
                                  }
                                },
                                child: _ResidentDirectoryItem(resident: resident),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );
  }
}

class _AddResidentBottomSheet extends ConsumerStatefulWidget {
  final String societyId;
  final String Function() generatePassword;

  const _AddResidentBottomSheet({
    required this.societyId,
    required this.generatePassword,
  });

  @override
  ConsumerState<_AddResidentBottomSheet> createState() => _AddResidentBottomSheetState();
}

class _AddResidentBottomSheetState extends ConsumerState<_AddResidentBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _flatController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();

  String _userType = 'owner';
  bool _showPassword = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _passwordController.text = widget.generatePassword();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _flatController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final name = _nameController.text.trim();
      final flat = _flatController.text.trim().toUpperCase();
      final email = _emailController.text.trim();
      final phone = _phoneController.text.trim();
      final password = _passwordController.text.trim();

      // Extract wing if format like A-101 or A101
      String wing = '';
      if (flat.contains('-')) {
        wing = flat.split('-').first.trim();
      } else if (flat.isNotEmpty && RegExp(r'^[A-Za-z]').hasMatch(flat)) {
        wing = flat.substring(0, 1);
      }

      await ref.read(firestoreServiceProvider).addResident(
        widget.societyId,
        {
          'name': name,
          'fullName': name,
          'flatNumber': flat,
          'flatNo': flat,
          'wing': wing,
          'email': email,
          'phone': phone,
          'mobileNumber': phone,
          'userType': _userType,
          'ownershipType': _userType == 'owner' ? 'Owner' : 'Tenant',
          'role': 'resident',
          'password': password,
        },
      );

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Resident "$name" added successfully!'),
            backgroundColor: AppColors.successEmerald,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to add resident: ${e.toString()}'),
            backgroundColor: AppColors.dangerCrimson,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
        top: 20,
        left: 20,
        right: 20,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Add Resident Manually',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.primaryNavy,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              AppTextField(
                controller: _nameController,
                label: 'Full Name *',
                hintText: 'e.g. Arjun Kumar',
                validator: (val) => val == null || val.trim().isEmpty ? 'Name is required' : null,
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: AppTextField(
                      controller: _flatController,
                      label: 'Flat / Unit *',
                      hintText: 'e.g. A-101',
                      validator: (val) => val == null || val.trim().isEmpty ? 'Flat is required' : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Type',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            border: Border.all(color: AppColors.cardBorder),
                            borderRadius: BorderRadius.circular(10),
                            color: AppColors.surface,
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _userType,
                              isExpanded: true,
                              items: const [
                                DropdownMenuItem(value: 'owner', child: Text('Owner')),
                                DropdownMenuItem(value: 'tenant', child: Text('Tenant')),
                              ],
                              onChanged: (val) {
                                if (val != null) setState(() => _userType = val);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              AppTextField(
                controller: _emailController,
                label: 'Email Address *',
                hintText: 'resident@email.com',
                keyboardType: TextInputType.emailAddress,
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Email is required';
                  if (!val.contains('@')) return 'Invalid email address';
                  return null;
                },
              ),
              const SizedBox(height: 14),
              AppTextField(
                controller: _phoneController,
                label: 'Mobile Number *',
                hintText: '+91 98765 43210',
                keyboardType: TextInputType.phone,
                validator: (val) => val == null || val.trim().isEmpty ? 'Phone is required' : null,
              ),
              const SizedBox(height: 16),
              // Login Password Box
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.cardBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Resident Login Password *',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        InkWell(
                          onTap: () {
                            setState(() {
                              _passwordController.text = widget.generatePassword();
                            });
                          },
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.refresh, size: 14, color: AppColors.primaryNavy),
                              SizedBox(width: 4),
                              Text(
                                'Auto-Generate',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.primaryNavy,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _passwordController,
                            obscureText: !_showPassword,
                            decoration: InputDecoration(
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                              suffixIcon: IconButton(
                                icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility, size: 18),
                                onPressed: () => setState(() => _showPassword = !_showPassword),
                              ),
                            ),
                            validator: (val) => val == null || val.isEmpty ? 'Password required' : null,
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filledTonal(
                          icon: const Icon(Icons.copy, size: 18),
                          tooltip: 'Copy Password',
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: _passwordController.text));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Password copied to clipboard!'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      label: 'Cancel',
                      onPressed: () => Navigator.pop(context),
                      variant: ButtonVariant.outline,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppButton(
                      label: 'Save Resident',
                      isLoading: _isSubmitting,
                      onPressed: _submit,
                      variant: ButtonVariant.primary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ResidentDetailsBottomSheet extends ConsumerWidget {
  final ResidentModel resident;
  final String societyId;

  const _ResidentDetailsBottomSheet({
    required this.resident,
    required this.societyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isSuspended = resident.status == 'suspended';

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 26,
                backgroundColor: AppColors.skyLight,
                child: Text(
                  resident.name.isNotEmpty ? resident.name[0].toUpperCase() : 'R',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: AppColors.primaryNavy,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      resident.name,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Flat: ${resident.wing.isNotEmpty ? '${resident.wing}-' : ''}${resident.flatNo} • ${resident.userType.toUpperCase()}',
                      style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              AppBadge(
                label: resident.status.toUpperCase(),
                variant: isSuspended
                    ? BadgeVariant.danger
                    : resident.status == 'approved' || resident.status == 'active'
                        ? BadgeVariant.success
                        : BadgeVariant.warning,
              ),
            ],
          ),
          const Divider(height: 32),
          _detailRow(Icons.phone_outlined, 'Phone', resident.phone),
          const SizedBox(height: 10),
          _detailRow(Icons.email_outlined, 'Email', resident.email.isNotEmpty ? resident.email : 'N/A'),
          const SizedBox(height: 10),
          _detailRow(Icons.apartment_outlined, 'Unit / Wing', '${resident.wing.isNotEmpty ? '${resident.wing}-' : ''}${resident.flatNo}'),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: AppButton(
                  label: isSuspended ? 'Activate Access' : 'Suspend Access',
                  variant: ButtonVariant.outline,
                  onPressed: () async {
                    final newStatus = isSuspended ? 'active' : 'suspended';
                    await ref.read(firestoreServiceProvider).updateResidentStatus(
                          societyId,
                          resident.id,
                          newStatus,
                        );
                    if (context.mounted) Navigator.pop(context);
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  label: 'Delete',
                  variant: ButtonVariant.danger,
                  onPressed: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (dCtx) => AlertDialog(
                        title: const Text('Delete Resident?'),
                        content: Text('Are you sure you want to delete "${resident.name}"? This removes their login permissions.'),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(dCtx, false), child: const Text('Cancel')),
                          TextButton(
                            onPressed: () => Navigator.pop(dCtx, true),
                            style: TextButton.styleFrom(foregroundColor: AppColors.dangerCrimson),
                            child: const Text('Delete'),
                          ),
                        ],
                      ),
                    );

                    if (confirm == true) {
                      await ref.read(firestoreServiceProvider).deleteResident(
                            societyId,
                            resident.id,
                          );
                      if (context.mounted) Navigator.pop(context);
                    }
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _detailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.textMuted),
        const SizedBox(width: 10),
        Text(
          '$label: ',
          style: const TextStyle(fontSize: 13, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(fontSize: 13, color: AppColors.textPrimary, fontWeight: FontWeight.w700),
          ),
        ),
      ],
    );
  }
}

class _PendingResidentCard extends StatelessWidget {
  final ResidentModel resident;
  final VoidCallback onApprove;
  final VoidCallback onReject;

  const _PendingResidentCard({
    required this.resident,
    required this.onApprove,
    required this.onReject,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const CircleAvatar(
                radius: 22,
                backgroundColor: AppColors.amberLight,
                child: Icon(Icons.person_outline, color: AppColors.accentAmber, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      resident.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Flat: ${resident.wing.isNotEmpty ? '${resident.wing}-' : ''}${resident.flatNo} • ${resident.userType.toUpperCase()}',
                      style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              const AppBadge(label: 'Pending', variant: BadgeVariant.warning),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'Phone: ${resident.phone}  •  Email: ${resident.email.isNotEmpty ? resident.email : 'N/A'}',
            style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: AppButton(
                  label: 'Reject',
                  onPressed: onReject,
                  variant: ButtonVariant.outline,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  label: 'Approve',
                  onPressed: onApprove,
                  variant: ButtonVariant.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ResidentDirectoryItem extends StatelessWidget {
  final ResidentModel resident;

  const _ResidentDirectoryItem({required this.resident});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.skyLight,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              '${resident.wing.isNotEmpty ? '${resident.wing}-' : ''}${resident.flatNo}',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                color: AppColors.primaryNavy,
                fontSize: 13,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  resident.name,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  resident.phone,
                  style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          AppBadge(
            label: resident.userType.toUpperCase(),
            variant: resident.userType == 'owner' ? BadgeVariant.primary : BadgeVariant.neutral,
            fontSize: 10,
          ),
        ],
      ),
    );
  }
}
