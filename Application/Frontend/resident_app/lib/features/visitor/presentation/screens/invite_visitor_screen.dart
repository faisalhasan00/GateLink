import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../providers/visitor_providers.dart';
import '../widgets/visitor_pass_bottom_sheet.dart';
import '../widgets/pass_type_selector.dart';
import '../widgets/purpose_category_selector.dart';
import '../widgets/delivery_brand_selector.dart';
import '../widgets/visitor_form_card.dart';
import '../widgets/delivery_instruction_chips.dart';
import '../widgets/visitor_schedule_picker.dart';

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

  String _passType = 'one_time';
  String _selectedPurpose = 'Guest / Friend';
  String? _selectedInstruction;

  DateTime _singleDate = DateTime.now();
  TimeOfDay? _singleTime;

  DateTime _multiFromDate = DateTime.now();
  DateTime _multiUntilDate = DateTime.now().add(const Duration(days: 3));

  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _mobileController.dispose();
    super.dispose();
  }

  Future<void> _pickSingleDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _singleDate,
      firstDate: now,
      lastDate: now.add(const Duration(days: 30)),
    );
    if (picked != null) setState(() => _singleDate = picked);
  }

  Future<void> _pickSingleTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null) setState(() => _singleTime = picked);
  }

  Future<void> _pickDateRange() async {
    final now = DateTime.now();
    final picked = await showDateRangePicker(
      context: context,
      firstDate: now,
      lastDate: now.add(const Duration(days: 90)),
      initialDateRange: DateTimeRange(
        start: _multiFromDate,
        end: _multiUntilDate,
      ),
    );
    if (picked != null) {
      setState(() {
        _multiFromDate = picked.start;
        _multiUntilDate = picked.end;
      });
    }
  }

  void _selectDeliveryBrand(Map<String, dynamic> brand) {
    setState(() {
      _passType = 'one_time';
      _selectedPurpose = brand['purpose'] as String;
      _nameController.text = brand['defaultName'] as String;
      if (_mobileController.text.isEmpty) {
        _mobileController.text = '9999999999';
      }
    });
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

      final fullHostFlat = profile?.displayFlatNumber ?? 'Unknown Flat';
      final dateFormat = DateFormat('dd/MM/yyyy');
      final isSingle = _passType == 'one_time';

      final expectedDateStr = isSingle
          ? dateFormat.format(_singleDate)
          : dateFormat.format(_multiFromDate);

      final expectedTimeStr = isSingle
          ? (_singleTime != null ? _singleTime!.format(context) : 'Anytime')
          : 'All Day (Multi-Entry)';

      final validFromStr = isSingle
          ? DateFormat('yyyy-MM-dd').format(_singleDate)
          : DateFormat('yyyy-MM-dd').format(_multiFromDate);

      final validUntilStr = isSingle
          ? DateFormat('yyyy-MM-dd').format(_singleDate)
          : DateFormat('yyyy-MM-dd').format(_multiUntilDate);

      final inviteResult = await controller.inviteVisitor(
        name: _nameController.text.trim(),
        phone: _mobileController.text.trim(),
        purpose: _selectedPurpose,
        hostFlat: fullHostFlat,
        invitedBy: user.uid,
        expectedDate: expectedDateStr,
        expectedTime: expectedTimeStr,
        passType: _passType,
        validFrom: validFromStr,
        validUntil: validUntilStr,
      );

      if (!mounted) return;
      setState(() => _isLoading = false);

      if (inviteResult != null) {
        _showQrDialog(
          visitorId: inviteResult.visitorId,
          passCode: inviteResult.passCode,
          hostFlat: fullHostFlat,
          expectedDate: expectedDateStr,
          expectedTime: expectedTimeStr,
          validFrom: isSingle ? null : DateFormat('dd MMM yyyy').format(_multiFromDate),
          validUntil: isSingle ? null : DateFormat('dd MMM yyyy').format(_multiUntilDate),
        );
      } else {
        final errorMsg = ref.read(visitorControllerProvider).errorMessage ??
            'Failed to create visitor pass.';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errorMsg), backgroundColor: AppColors.error),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  void _showQrDialog({
    required String visitorId,
    required String passCode,
    required String hostFlat,
    required String expectedDate,
    required String expectedTime,
    String? validFrom,
    String? validUntil,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => VisitorPassBottomSheet(
        visitorId: visitorId,
        passCode: passCode,
        visitorName: _nameController.text.trim(),
        expectedDate: expectedDate,
        expectedTime: expectedTime,
        hostFlat: hostFlat,
        passType: _passType,
        validFrom: validFrom,
        validUntil: validUntil,
        instructions: _selectedInstruction,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isSingle = _passType == 'one_time';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.dashboard);
            }
          },
        ),
        title: const Text(
          'Invite Visitor / Pass',
          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: const Color(0xFFE2E8F0), height: 1),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Pass Type Selector
              PassTypeSelector(
                passType: _passType,
                onPassTypeChanged: (type) => setState(() => _passType = type),
              ),
              const SizedBox(height: AppSpacing.lg),

              // 2. Purpose Category Selector
              PurposeCategorySelector(
                isSingle: isSingle,
                selectedPurpose: _selectedPurpose,
                onPurposeSelected: (purpose) {
                  setState(() {
                    _selectedPurpose = purpose;
                    if (purpose == 'Guest / Friend') {
                      _nameController.clear();
                      _mobileController.clear();
                    } else if (purpose == 'Delivery' && _nameController.text.isEmpty) {
                      _nameController.text = 'Delivery Partner';
                    } else if (purpose == 'Cab / Taxi') {
                      _nameController.text = 'Cab Driver';
                    } else if (purpose == 'Maintenance Work') {
                      _nameController.text = 'Service Technician';
                    }
                  });
                },
                onPresetDaysSelected: (days) {
                  setState(() {
                    _multiUntilDate = _multiFromDate.add(Duration(days: days));
                  });
                },
              ),
              const SizedBox(height: AppSpacing.md),

              // 3. Quick Delivery Brands (Only when Delivery purpose chosen)
              if (isSingle && _selectedPurpose == 'Delivery') ...[
                DeliveryBrandSelector(
                  selectedName: _nameController.text,
                  onSelectBrand: _selectDeliveryBrand,
                ),
                const SizedBox(height: AppSpacing.md),
              ],

              // 4. Visitor Details Form
              VisitorFormCard(
                nameController: _nameController,
                mobileController: _mobileController,
                isSingle: isSingle,
              ),
              const SizedBox(height: AppSpacing.lg),

              // 5. Delivery Instructions
              if (isSingle) ...[
                DeliveryInstructionChips(
                  selectedInstruction: _selectedInstruction,
                  onInstructionChanged: (inst) => setState(() => _selectedInstruction = inst),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],

              // 6. Schedule & Timings
              VisitorSchedulePicker(
                isSingle: isSingle,
                singleDate: _singleDate,
                singleTime: _singleTime,
                multiFromDate: _multiFromDate,
                multiUntilDate: _multiUntilDate,
                onPickSingleDate: _pickSingleDate,
                onPickSingleTime: _pickSingleTime,
                onPickDateRange: _pickDateRange,
              ),
              const SizedBox(height: AppSpacing.xl),

              // 7. Submit Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isSingle ? const Color(0xFF1E3A8A) : const Color(0xFF0EA5E9),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 2,
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(isSingle ? Icons.qr_code_rounded : Icons.check_circle_rounded, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              isSingle ? 'Generate One-Time Pass' : 'Generate Multi-Day Pass',
                              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                            ),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
            ],
          ),
        ),
      ),
    );
  }
}
