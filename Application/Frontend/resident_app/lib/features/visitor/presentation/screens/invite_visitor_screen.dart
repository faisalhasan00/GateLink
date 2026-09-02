import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../providers/visitor_providers.dart';
import '../widgets/visitor_pass_bottom_sheet.dart';

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

  // Mode: 'one_time' or 'multi_day'
  String _passType = 'one_time';
  String _selectedPurpose = 'Guest / Friend';
  String? _selectedInstruction;

  // One-time pass dates
  DateTime _singleDate = DateTime.now();
  TimeOfDay? _singleTime;

  // Multi-day pass date range
  DateTime _multiFromDate = DateTime.now();
  DateTime _multiUntilDate = DateTime.now().add(const Duration(days: 3));

  bool _isLoading = false;

  final List<Map<String, dynamic>> _deliveryBrands = [
    {
      'name': 'Swiggy',
      'icon': Icons.delivery_dining_rounded,
      'color': const Color(0xFFFC8019),
      'defaultName': 'Swiggy Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Zomato',
      'icon': Icons.restaurant_rounded,
      'color': const Color(0xFFCB202D),
      'defaultName': 'Zomato Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Blinkit',
      'icon': Icons.shopping_bag_rounded,
      'color': const Color(0xFFEAB308),
      'defaultName': 'Blinkit Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Amazon',
      'icon': Icons.local_shipping_rounded,
      'color': const Color(0xFF0F172A),
      'defaultName': 'Amazon Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Zepto',
      'icon': Icons.flash_on_rounded,
      'color': const Color(0xFF7C3AED),
      'defaultName': 'Zepto Delivery',
      'purpose': 'Delivery',
    },
    {
      'name': 'Uber / Cab',
      'icon': Icons.local_taxi_rounded,
      'color': const Color(0xFF0284C7),
      'defaultName': 'Cab Driver',
      'purpose': 'Cab / Taxi',
    },
  ];

  final List<Map<String, dynamic>> _instructionOptions = [
    {'label': 'Leave at Door', 'icon': Icons.door_front_door_outlined},
    {'label': 'Leave at Gate', 'icon': Icons.shield_outlined},
    {'label': 'Collect OTP at Door', 'icon': Icons.pin_outlined},
    {'label': 'Don\'t Ring Bell', 'icon': Icons.notifications_off_outlined},
    {'label': 'Call on Arrival', 'icon': Icons.call_outlined},
  ];

  final List<Map<String, dynamic>> _multiDayPresets = [
    {'label': '👨‍👩‍👧 Family Stay', 'purpose': 'Guest Stay', 'days': 7},
    {'label': '🏠 Relative Visit', 'purpose': 'Guest Stay', 'days': 3},
    {'label': '📚 Regular Tutor', 'purpose': 'House Help', 'days': 30},
    {'label': '🔨 Renovation Contractor', 'purpose': 'Maintenance Work', 'days': 14},
  ];

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
    HapticFeedback.selectionClick();
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

  Widget _buildCategoryTab({
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF1E3A8A) : Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? const Color(0xFF1E3A8A) : const Color(0xFFCBD5E1),
              width: isSelected ? 1.5 : 1.0,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: const Color(0xFF1E3A8A).withValues(alpha: 0.25),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? Colors.white : const Color(0xFF475569),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                  color: isSelected ? Colors.white : const Color(0xFF334155),
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
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
              // ── 1. PASS TYPE SELECTOR ──────────────────────────────────────
              const Text(
                'SELECT PASS TYPE',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.8,
                  color: Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _passType = 'one_time'),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: isSingle ? Colors.white : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: isSingle
                                ? [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.08),
                                      blurRadius: 6,
                                      offset: const Offset(0, 2),
                                    )
                                  ]
                                : null,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.timer_outlined,
                                size: 18,
                                color: isSingle
                                    ? const Color(0xFF1E3A8A)
                                    : const Color(0xFF64748B),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'One-Time Pass',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: isSingle
                                      ? FontWeight.w800
                                      : FontWeight.w600,
                                  color: isSingle
                                      ? const Color(0xFF1E3A8A)
                                      : const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _passType = 'multi_day'),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: !isSingle ? Colors.white : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: !isSingle
                                ? [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.08),
                                      blurRadius: 6,
                                      offset: const Offset(0, 2),
                                    )
                                  ]
                                : null,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.date_range_rounded,
                                size: 18,
                                color: !isSingle
                                    ? const Color(0xFF0EA5E9)
                                    : const Color(0xFF64748B),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Multi-Day Stay',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: !isSingle
                                      ? FontWeight.w800
                                      : FontWeight.w600,
                                  color: !isSingle
                                      ? const Color(0xFF0EA5E9)
                                      : const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Policy Info Banner
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: isSingle ? const Color(0xFFEFF6FF) : const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: isSingle ? const Color(0xFFBFDBFE) : const Color(0xFFFDE68A),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      isSingle ? Icons.info_outline_rounded : Icons.verified_user_outlined,
                      size: 18,
                      color: isSingle ? const Color(0xFF1D4ED8) : const Color(0xFFB45309),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        isSingle
                            ? 'Single-Use: Generates a 6-digit OTP that auto-expires once entry is recorded at the gate.'
                            : 'Multi-Entry: Allows authorized check-in & check-out across the selected date range.',
                        style: TextStyle(
                          fontSize: 12,
                          color: isSingle ? const Color(0xFF1E40AF) : const Color(0xFF92400E),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // ── 2. VISITOR CATEGORY SELECTOR ────────────────────────────
              if (isSingle) ...[
                const Text(
                  'VISITING PURPOSE',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.8,
                    color: Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Row(
                  children: [
                    _buildCategoryTab(
                      label: 'Guest / Friend',
                      icon: Icons.people_alt_outlined,
                      isSelected: _selectedPurpose == 'Guest / Friend' || _selectedPurpose == 'Personal Visit',
                      onTap: () {
                        HapticFeedback.selectionClick();
                        setState(() {
                          _selectedPurpose = 'Guest / Friend';
                          _nameController.clear();
                          _mobileController.clear();
                        });
                      },
                    ),
                    const SizedBox(width: 8),
                    _buildCategoryTab(
                      label: 'Delivery',
                      icon: Icons.delivery_dining_outlined,
                      isSelected: _selectedPurpose == 'Delivery',
                      onTap: () {
                        HapticFeedback.selectionClick();
                        setState(() {
                          _selectedPurpose = 'Delivery';
                          if (_nameController.text.isEmpty) {
                            _nameController.text = 'Delivery Partner';
                          }
                        });
                      },
                    ),
                    const SizedBox(width: 8),
                    _buildCategoryTab(
                      label: 'Cab / Taxi',
                      icon: Icons.local_taxi_outlined,
                      isSelected: _selectedPurpose == 'Cab / Taxi',
                      onTap: () {
                        HapticFeedback.selectionClick();
                        setState(() {
                          _selectedPurpose = 'Cab / Taxi';
                          _nameController.text = 'Cab Driver';
                        });
                      },
                    ),
                    const SizedBox(width: 8),
                    _buildCategoryTab(
                      label: 'Service',
                      icon: Icons.build_outlined,
                      isSelected: _selectedPurpose == 'Maintenance Work',
                      onTap: () {
                        HapticFeedback.selectionClick();
                        setState(() {
                          _selectedPurpose = 'Maintenance Work';
                          _nameController.text = 'Service Technician';
                        });
                      },
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                // If Delivery is chosen, show quick brand pills
                if (_selectedPurpose == 'Delivery') ...[
                  const Row(
                    children: [
                      Text(
                        'QUICK DELIVERY BRANDS',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                          color: Color(0xFF64748B),
                        ),
                      ),
                      SizedBox(width: 6),
                      Text(
                        '• 1-Tap Autofill',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF0EA5E9),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 38,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _deliveryBrands.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final brand = _deliveryBrands[index];
                        final isSelected = _nameController.text == brand['defaultName'];
                        final brandColor = brand['color'] as Color;

                        return InkWell(
                          onTap: () => _selectDeliveryBrand(brand),
                          borderRadius: BorderRadius.circular(10),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 180),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: isSelected ? brandColor : Colors.white,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: isSelected ? brandColor : const Color(0xFFE2E8F0),
                                width: isSelected ? 1.5 : 1.0,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: isSelected
                                      ? brandColor.withValues(alpha: 0.25)
                                      : Colors.black.withValues(alpha: 0.03),
                                  blurRadius: isSelected ? 6 : 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  brand['icon'] as IconData,
                                  size: 15,
                                  color: isSelected ? Colors.white : brandColor,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  brand['name'] as String,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    color: isSelected ? Colors.white : const Color(0xFF0F172A),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],
              ],

              // ── 3. MULTI-DAY PURPOSE PRESETS ────────────────────────────
              if (!isSingle) ...[
                const Text(
                  'STAY PURPOSE',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.8,
                    color: Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _multiDayPresets.map((preset) {
                    final label = preset['label'] as String;
                    final isSelected = _selectedPurpose == preset['purpose'];
                    return ChoiceChip(
                      label: Text(label),
                      selected: isSelected,
                      onSelected: (selected) {
                        if (selected) {
                          HapticFeedback.selectionClick();
                          setState(() {
                            _selectedPurpose = preset['purpose'] as String;
                            if (preset['days'] != null) {
                              final days = preset['days'] as int;
                              _multiUntilDate = _multiFromDate.add(Duration(days: days));
                            }
                          });
                        }
                      },
                      selectedColor: const Color(0xFF0EA5E9),
                      labelStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? Colors.white : const Color(0xFF334155),
                      ),
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                        side: BorderSide(
                          color: isSelected
                              ? Colors.transparent
                              : const Color(0xFFCBD5E1),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],

              // ── 4. VISITOR DETAILS FORM ────────────────────────────────────
              const Text(
                'VISITOR DETAILS',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.8,
                  color: Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              Card(
                elevation: 0,
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                  side: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _nameController,
                        decoration: InputDecoration(
                          labelText: 'Visitor / Delivery Partner Name *',
                          hintText: isSingle ? 'e.g. Rahul / Swiggy Delivery' : 'e.g. Rakesh Sharma',
                          prefixIcon: const Icon(Icons.person_outline_rounded, color: Color(0xFF64748B)),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        ),
                        validator: (val) {
                          if (val == null || val.trim().isEmpty) {
                            return 'Please enter visitor name';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppSpacing.md),
                      TextFormField(
                        controller: _mobileController,
                        keyboardType: TextInputType.phone,
                        decoration: InputDecoration(
                          labelText: 'Mobile Number *',
                          hintText: '10-digit mobile number',
                          prefixIcon: const Icon(Icons.phone_outlined, color: Color(0xFF64748B)),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        ),
                        validator: (val) {
                          if (val == null || val.trim().isEmpty) {
                            return 'Please enter phone number';
                          }
                          if (val.trim().length < 10) {
                            return 'Enter a valid 10-digit number';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // ── 5. DELIVERY INSTRUCTIONS ──────────────────────────────────
              if (isSingle) ...[
                const Text(
                  'DELIVERY & GATE INSTRUCTIONS',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.8,
                    color: Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _instructionOptions.map((opt) {
                    final label = opt['label'] as String;
                    final icon = opt['icon'] as IconData;
                    final isSelected = _selectedInstruction == label;

                    return FilterChip(
                      avatar: Icon(
                        icon,
                        size: 14,
                        color: isSelected ? Colors.white : const Color(0xFF1E3A8A),
                      ),
                      label: Text(label),
                      selected: isSelected,
                      onSelected: (selected) {
                        HapticFeedback.selectionClick();
                        setState(() {
                          _selectedInstruction = selected ? label : null;
                        });
                      },
                      selectedColor: const Color(0xFF1E3A8A),
                      labelStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? Colors.white : const Color(0xFF334155),
                      ),
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                        side: BorderSide(
                          color: isSelected ? Colors.transparent : const Color(0xFFCBD5E1),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],

              // ── 4. SCHEDULE & TIMINGS ──────────────────────────────────────
              Text(
                isSingle ? 'EXPECTED ENTRY TIME' : 'VALIDITY DATE RANGE',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.8,
                  color: Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              if (isSingle)
                Row(
                  children: [
                    Expanded(
                      child: InkWell(
                        onTap: _pickSingleDate,
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFCBD5E1)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Date', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                              const SizedBox(height: 2),
                              Row(
                                children: [
                                  const Icon(Icons.calendar_today_rounded, size: 14, color: Color(0xFF1E3A8A)),
                                  const SizedBox(width: 6),
                                  Text(
                                    DateFormat('dd MMM yyyy').format(_singleDate),
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: InkWell(
                        onTap: _pickSingleTime,
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFCBD5E1)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Time Window', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                              const SizedBox(height: 2),
                              Row(
                                children: [
                                  const Icon(Icons.access_time_rounded, size: 14, color: Color(0xFF1E3A8A)),
                                  const SizedBox(width: 6),
                                  Text(
                                    _singleTime != null ? _singleTime!.format(context) : 'Anytime Today',
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                )
              else
                InkWell(
                  onTap: _pickDateRange,
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFCBD5E1)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.date_range_rounded, color: Color(0xFF0EA5E9)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Valid Stay Period', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                              const SizedBox(height: 2),
                              Text(
                                '${DateFormat('dd MMM yyyy').format(_multiFromDate)}  ➔  ${DateFormat('dd MMM yyyy').format(_multiUntilDate)}',
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE0F2FE),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '${_multiUntilDate.difference(_multiFromDate).inDays + 1} Days',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF0369A1)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: AppSpacing.xl),

              // ── 5. SUBMIT / GENERATE BUTTON ────────────────────────────────
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
