import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../providers/visitor_providers.dart';
import '../../../../core/services/qr_share_service.dart';

class InviteVisitorScreen extends ConsumerStatefulWidget {
  const InviteVisitorScreen({super.key});

  @override
  ConsumerState<InviteVisitorScreen> createState() =>
      _InviteVisitorScreenState();
}

class _InviteVisitorScreenState extends ConsumerState<InviteVisitorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _mobileController = TextEditingController();
  String _selectedPurpose = 'Personal Visit';
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  bool _isLoading = false;

  final List<String> _purposes = [
    'Personal Visit',
    'Delivery',
    'House Help',
    'Maintenance Work',
    'Medical Visit',
    'Guest Stay',
    'Cab / Taxi',
    'Other',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _mobileController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: now,
      lastDate: now.add(const Duration(days: 30)),
    );
    if (picked != null) setState(() => _selectedDate = picked);
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null) setState(() => _selectedTime = picked);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      final controller = ref.read(visitorControllerProvider.notifier);
      final user = ref.read(currentUserProvider);
      final profile = ref.read(userProfileProvider).value;

      if (user == null) {
        throw Exception('Not logged in');
      }

      final fullHostFlat = profile?.displayFlatNumber ?? 'Unknown';

      final inviteResult = await controller.inviteVisitor(
        name: _nameController.text.trim(),
        phone: _mobileController.text.trim(),
        purpose: _selectedPurpose,
        hostFlat: fullHostFlat,
        invitedBy: user.uid,
        expectedDate: _selectedDate != null
            ? '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'
            : 'Today',
        expectedTime:
            _selectedTime != null ? _selectedTime!.format(context) : 'Anytime',
      );

      if (!mounted) return;
      setState(() => _isLoading = false);

      if (inviteResult != null) {
        _showQrDialog(inviteResult.visitorId, inviteResult.passCode);
      } else {
        final errorMsg = ref.read(visitorControllerProvider).errorMessage ??
            'Failed to create visitor pass.';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errorMsg), backgroundColor: AppColors.error),
        );
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  void _showQrDialog(String visitorId, String passCode) {
    final qrKey = GlobalKey();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: AppSpacing.lg),
            const Icon(Icons.check_circle_rounded,
                color: AppColors.success, size: 56),
            const SizedBox(height: AppSpacing.md),
            const Text('Visitor Invited!',
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary)),
            const SizedBox(height: AppSpacing.sm),
            Text(
                'A QR code & Gate Pass Code has been generated for ${_nameController.text}.',
                style: const TextStyle(
                    color: AppColors.textSecondary, fontSize: 14),
                textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.md),

            // Display 6-digit numeric Gate Pass Code
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border:
                    Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
              ),
              child: Column(
                children: [
                  const Text('6-DIGIT GATE PASS CODE',
                      style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                          letterSpacing: 1)),
                  const SizedBox(height: 4),
                  SelectableText(
                    passCode,
                    style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 6,
                        color: AppColors.primary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            RepaintBoundary(
              key: qrKey,
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(color: AppColors.border),
                ),
                child: QrImageView(
                  data: passCode,
                  version: QrVersions.auto,
                  size: 160.0,
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton.icon(
              onPressed: () {
                final profile = ref.read(userProfileProvider).value;
                final hostFlat = profile?.displayFlatNumber ?? '';
                final societyId = profile?.societyId ?? '';
                QrShareService.shareQrPass(
                  qrKey: qrKey,
                  visitorName: _nameController.text.trim(),
                  societyId: societyId,
                  flatNumber: hostFlat,
                  visitTime: _selectedDate != null
                      ? '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'
                      : 'Today',
                );
              },
              icon: const Icon(Icons.share_rounded, size: 18),
              label: const Text('Share Pass with Visitor'),
            ),
            const SizedBox(height: AppSpacing.md),
            OutlinedButton(
              onPressed: () {
                Navigator.pop(ctx);
                context.go(AppRoutes.visitors);
              },
              child: const Text('Done'),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Invite Visitor')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _SectionLabel(text: 'Visitor Details'),
              const SizedBox(height: AppSpacing.md),
              _FieldLabel(label: 'Visitor Name'),
              const SizedBox(height: 6),
              TextFormField(
                controller: _nameController,
                decoration:
                    const InputDecoration(hintText: 'Full name of visitor'),
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Name is required' : null,
              ),
              const SizedBox(height: AppSpacing.md),
              _FieldLabel(label: 'Mobile Number (Optional)'),
              const SizedBox(height: 6),
              TextFormField(
                controller: _mobileController,
                keyboardType: TextInputType.phone,
                maxLength: 10,
                decoration: const InputDecoration(
                    hintText: '10-digit mobile number', counterText: ''),
              ),
              const SizedBox(height: AppSpacing.md),
              _FieldLabel(label: 'Purpose of Visit'),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _selectedPurpose,
                items: _purposes
                    .map((p) => DropdownMenuItem(value: p, child: Text(p)))
                    .toList(),
                onChanged: (v) => setState(() => _selectedPurpose = v!),
                decoration: const InputDecoration(hintText: 'Select purpose'),
              ),
              const SizedBox(height: AppSpacing.xl),
              const _SectionLabel(text: 'Expected Visit Time'),
              const SizedBox(height: AppSpacing.md),
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: _pickDate,
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(AppRadius.lg),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(children: [
                          const Icon(Icons.calendar_today_rounded,
                              size: 18, color: AppColors.primary),
                          const SizedBox(width: 8),
                          Text(
                            _selectedDate == null
                                ? 'Select Date'
                                : '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}',
                            style: TextStyle(
                              color: _selectedDate == null
                                  ? AppColors.textSecondary
                                  : AppColors.textPrimary,
                              fontSize: 14,
                            ),
                          ),
                        ]),
                      ),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: GestureDetector(
                      onTap: _pickTime,
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(AppRadius.lg),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(children: [
                          const Icon(Icons.access_time_rounded,
                              size: 18, color: AppColors.primary),
                          const SizedBox(width: 8),
                          Text(
                            _selectedTime == null
                                ? 'Select Time'
                                : _selectedTime!.format(context),
                            style: TextStyle(
                              color: _selectedTime == null
                                  ? AppColors.textSecondary
                                  : AppColors.textPrimary,
                              fontSize: 14,
                            ),
                          ),
                        ]),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.xl),
              ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white))
                    : const Text('Generate Visitor Pass'),
              ),
              const SizedBox(height: AppSpacing.lg),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String text;
  const _SectionLabel({required this.text});

  @override
  Widget build(BuildContext context) => Text(text,
      style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary));
}

class _FieldLabel extends StatelessWidget {
  final String label;
  const _FieldLabel({required this.label});

  @override
  Widget build(BuildContext context) => Text(label,
      style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: AppColors.textSecondary));
}
