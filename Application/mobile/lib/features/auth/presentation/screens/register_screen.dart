import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/services/society_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

final societyServiceProvider = Provider<SocietyService>((ref) => SocietyService());

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  int _currentLayer = 1;
  bool _isLoading = false;
  bool _isFetchingDb = false;
  final _picker = ImagePicker();
  File? _documentFile;

  // ── Layer 1: Account Info ──
  final _formKeyLayer1 = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;

  // ── Layer 2: Location & Dynamic Database Society Selection ──
  final _formKeyLayer2 = GlobalKey<FormState>();
  String _selectedCountry = 'India';
  String _selectedCity = 'Hyderabad';
  
  List<SocietyModel> _dbSocieties = [];
  SocietyModel? _selectedSocietyModel;
  
  String _selectedBuilding = 'A';
  String _selectedFlatNo = '001';
  List<String> _dynamicFlats = [];
  final _flatSearchController = TextEditingController();

  final List<String> _countries = ['India', 'UAE'];
  final Map<String, List<String>> _cityMap = {
    'India': ['Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Chennai', 'Pune'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  };

  // ── Layer 3: Residency, Occupancy & Proof ──
  String _selectedYouAre = 'Flat Owner'; // 'Flat Owner', 'Renting with family', 'Renting with other flatmates'
  String _selectedOccupancy = 'Currently residing'; // 'Currently residing', 'Flat is let out', 'Flat is empty'
  String _documentType = 'Rent Agreement / Electricity Bill';

  @override
  void initState() {
    super.initState();
    _loadDatabaseSocieties();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _flatSearchController.dispose();
    super.dispose();
  }

  /// Query real societies dynamically from Firestore database
  Future<void> _loadDatabaseSocieties() async {
    setState(() => _isFetchingDb = true);
    try {
      final service = ref.read(societyServiceProvider);
      final societies = await service.fetchSocietiesByLocation(_selectedCountry, _selectedCity);

      if (mounted) {
        setState(() {
          _dbSocieties = societies;
          if (societies.isNotEmpty) {
            _selectedSocietyModel = societies.first;
            _updateBuildingAndFlats(_selectedSocietyModel!);
          } else {
            _selectedSocietyModel = null;
            _dynamicFlats = [];
          }
        });
      }
    } catch (e) {
      // Fallback handling
    } finally {
      if (mounted) setState(() => _isFetchingDb = false);
    }
  }

  void _updateBuildingAndFlats(SocietyModel society) {
    final service = ref.read(societyServiceProvider);
    final blocks = society.blocks;
    final building = blocks.isNotEmpty ? blocks.first : 'A';
    final flats = service.generateFlatsForSociety(society, building);

    setState(() {
      _selectedBuilding = building;
      _dynamicFlats = flats;
      _selectedFlatNo = flats.isNotEmpty ? flats.first : '001';
    });
  }

  Future<void> _pickDocument() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 75);
    if (picked != null) {
      setState(() {
        _documentFile = File(picked.path);
      });
    }
  }

  void _showError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: AppColors.error),
    );
  }

  Future<void> _submitRegistration() async {
    if (_selectedSocietyModel == null) {
      _showError('Please select a valid society from the database list');
      return;
    }

    setState(() => _isLoading = true);
    try {
      await ref.read(authServiceProvider).registerWithEmail(
        email: _emailController.text,
        password: _passwordController.text,
        name: _nameController.text,
        phone: _phoneController.text,
        country: _selectedCountry,
        city: _selectedCity,
        societyCode: _selectedSocietyModel!.code,
        buildingBlock: _selectedBuilding,
        flatNumber: _selectedFlatNo,
        role: 'resident',
        residentRoleType: _selectedYouAre,
        occupancyStatus: _selectedOccupancy,
        documentProofUrl: _documentFile?.path,
        documentType: _documentType,
      );

      if (mounted) {
        context.go('/pending-approval');
      }
    } catch (e) {
      _showError(e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(_currentLayer == 1 ? 'Add Home' : _currentLayer == 2 ? 'Select Home' : 'Residency Proof'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () {
            if (_currentLayer > 1) {
              setState(() => _currentLayer--);
            } else {
              context.pop();
            }
          },
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            _buildLayerProgressHeader(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppSpacing.pagePadding),
                child: _currentLayer == 1
                    ? _buildLayer1AccountInfo()
                    : _currentLayer == 2
                        ? _buildLayer2LocationSociety()
                        : _buildLayer3ResidencyProof(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Layer Progress Header Bar ──
  Widget _buildLayerProgressHeader() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Step $_currentLayer of 3', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.primary)),
              Text(_currentLayer == 1 ? 'Personal Info' : _currentLayer == 2 ? 'Location & Flat' : 'Verification Proof', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: List.generate(3, (index) {
              final stepNum = index + 1;
              return Expanded(
                child: Container(
                  height: 4,
                  margin: EdgeInsets.only(right: index < 2 ? 6 : 0),
                  decoration: BoxDecoration(
                    color: stepNum <= _currentLayer ? AppColors.primary : AppColors.gray200,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  // ── Layer 1: Personal Info & Contact ──
  Widget _buildLayer1AccountInfo() {
    return Form(
      key: _formKeyLayer1,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Create Account', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
          const SizedBox(height: 4),
          const Text('Enter your details to get started with SocietySphere', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
          const SizedBox(height: AppSpacing.xl),

          // Full Name
          _buildTextField(
            label: 'Full Name',
            controller: _nameController,
            hint: 'e.g. Faisal Hasan',
            icon: Icons.person_outline_rounded,
            validator: (v) => v == null || v.isEmpty ? 'Full name is required' : null,
          ),
          const SizedBox(height: AppSpacing.md),

          // Email
          _buildTextField(
            label: 'Email Address',
            controller: _emailController,
            hint: 'name@example.com',
            keyboardType: TextInputType.emailAddress,
            icon: Icons.email_outlined,
            validator: (v) {
              if (v == null || v.isEmpty) return 'Email is required';
              if (!v.contains('@')) return 'Enter a valid email address';
              return null;
            },
          ),
          const SizedBox(height: AppSpacing.md),

          // Phone Number
          _buildTextField(
            label: 'Mobile Number',
            controller: _phoneController,
            hint: '+91 99999 99999',
            keyboardType: TextInputType.phone,
            icon: Icons.phone_outlined,
            validator: (v) => v == null || v.isEmpty ? 'Phone number is required' : null,
          ),
          const SizedBox(height: AppSpacing.md),

          // Password
          _buildPasswordField('Password', _passwordController, _obscurePassword, () {
            setState(() => _obscurePassword = !_obscurePassword);
          }),
          const SizedBox(height: AppSpacing.md),

          // Confirm Password
          _buildPasswordField('Confirm Password', _confirmPasswordController, _obscurePassword, () {
            setState(() => _obscurePassword = !_obscurePassword);
          }, validator: (v) {
            if (v != _passwordController.text) return 'Passwords do not match';
            return null;
          }),

          const SizedBox(height: AppSpacing.xxl),

          // Next Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                if (_formKeyLayer1.currentState!.validate()) {
                  setState(() => _currentLayer = 2);
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
              ),
              child: const Text('Next: Select Location & Society ➔', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }

  // ── Layer 2: Dynamic Database Location, Society, Building & Flat Selection ──
  Widget _buildLayer2LocationSociety() {
    final availableCities = _cityMap[_selectedCountry] ?? ['Hyderabad'];
    final filteredFlats = _dynamicFlats.where((f) {
      if (_flatSearchController.text.isEmpty) return true;
      return f.contains(_flatSearchController.text);
    }).toList();

    return Form(
      key: _formKeyLayer2,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Select Your Home', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              if (_isFetchingDb)
                const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary)),
            ],
          ),
          const SizedBox(height: 4),
          const Text('Data fetched directly from live Firestore database records', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          const SizedBox(height: AppSpacing.xl),

          // Country Dropdown
          _buildDropdownLabel('Country'),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.gray300),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedCountry,
                isExpanded: true,
                items: _countries.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (val) {
                  if (val != null) {
                    setState(() {
                      _selectedCountry = val;
                      _selectedCity = _cityMap[val]!.first;
                    });
                    _loadDatabaseSocieties();
                  }
                },
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // City Dropdown
          _buildDropdownLabel('City'),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.gray300),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: availableCities.contains(_selectedCity) ? _selectedCity : availableCities.first,
                isExpanded: true,
                items: availableCities.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (val) {
                  if (val != null) {
                    setState(() => _selectedCity = val);
                    _loadDatabaseSocieties();
                  }
                },
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Society Dynamic Database Dropdown / Empty state
          _buildDropdownLabel('Society (Fetched from Database)'),
          _dbSocieties.isEmpty
              ? Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.warningSurface,
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    border: Border.all(color: AppColors.warning),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.info_outline_rounded, color: AppColors.warning),
                      SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'No societies onboarded in database yet. Onboard your society via Super Admin panel!',
                          style: TextStyle(fontSize: 13, color: AppColors.textPrimary, fontWeight: FontWeight.w500),
                        ),
                      ),
                    ],
                  ),
                )
              : Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    border: Border.all(color: AppColors.gray300),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<SocietyModel>(
                      value: _selectedSocietyModel,
                      isExpanded: true,
                      hint: const Text('Select Society from Database'),
                      items: _dbSocieties.map((soc) => DropdownMenuItem(
                        value: soc,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(soc.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(soc.code, style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                      )).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setState(() {
                            _selectedSocietyModel = val;
                            _updateBuildingAndFlats(val);
                          });
                        }
                      },
                    ),
                  ),
                ),
          const SizedBox(height: AppSpacing.md),

          // Building Block Dynamic Selector
          _buildDropdownLabel('SELECT BUILDING / BLOCK'),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.gray300),
            ),
            child: Column(
              children: (_selectedSocietyModel?.blocks ?? ['A', 'B', 'C', 'D']).map((b) {
                final isSelected = _selectedBuilding == b;
                return ListTile(
                  dense: true,
                  leading: Icon(Icons.apartment_rounded, color: isSelected ? AppColors.primary : AppColors.textSecondary),
                  title: Text(b, style: TextStyle(fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500, color: isSelected ? AppColors.primary : AppColors.textPrimary)),
                  trailing: Icon(isSelected ? Icons.check_circle_rounded : Icons.chevron_right_rounded, color: isSelected ? AppColors.primary : AppColors.gray400),
                  onTap: () {
                    setState(() {
                      _selectedBuilding = b;
                      if (_selectedSocietyModel != null) {
                        _dynamicFlats = ref.read(societyServiceProvider).generateFlatsForSociety(_selectedSocietyModel!, b);
                        if (_dynamicFlats.isNotEmpty) _selectedFlatNo = _dynamicFlats.first;
                      }
                    });
                  },
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Flat Search & Dynamic Selection
          _buildDropdownLabel('Flat No.'),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.gray300),
            ),
            padding: const EdgeInsets.all(8),
            child: Column(
              children: [
                TextFormField(
                  controller: _flatSearchController,
                  decoration: const InputDecoration(
                    hintText: 'Enter Flat to Search (e.g. 001, 101)',
                    prefixIcon: Icon(Icons.search_rounded),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
                const Divider(),
                SizedBox(
                  height: 180,
                  child: ListView.builder(
                    itemCount: filteredFlats.length,
                    itemBuilder: (ctx, i) {
                      final f = filteredFlats[i];
                      final isSelected = _selectedFlatNo == f;
                      return ListTile(
                        dense: true,
                        leading: Icon(Icons.home_outlined, color: isSelected ? AppColors.primary : AppColors.textSecondary),
                        title: Text(f, style: TextStyle(fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500, color: isSelected ? AppColors.primary : AppColors.textPrimary)),
                        trailing: Icon(isSelected ? Icons.check_circle_rounded : Icons.chevron_right_rounded, color: isSelected ? AppColors.primary : AppColors.gray400),
                        onTap: () => setState(() => _selectedFlatNo = f),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xxl),

          // Next Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                if (_selectedSocietyModel == null) {
                  _showError('Please select a society from the database list');
                  return;
                }
                setState(() => _currentLayer = 3);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
              ),
              child: const Text('Next: Residency & Proof ➔', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }

  // ── Layer 3: Occupancy Status, Resident Type & Document Verification Proof ──
  Widget _buildLayer3ResidencyProof() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Residency & Verification', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
        const SizedBox(height: 4),
        const Text('Specify occupancy status and upload document proof for RWA review', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
        const SizedBox(height: AppSpacing.xl),

        // Selected Flat Summary Box
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              const Icon(Icons.home_work_rounded, color: AppColors.primary, size: 36),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${_selectedSocietyModel?.name ?? "Housing Society"} (${_selectedBuilding}-$_selectedFlatNo)', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppColors.textPrimary)),
                    Text('Code: ${_selectedSocietyModel?.code ?? "SOC-001"} | $_selectedCity, $_selectedCountry', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xl),

        // You Are (Ownership & Family Status)
        _buildDropdownLabel('You are'),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: AppColors.gray300),
          ),
          child: Column(
            children: [
              _buildRadioOption('Flat Owner', _selectedYouAre, (val) => setState(() => _selectedYouAre = val)),
              const Divider(height: 1),
              _buildRadioOption('Renting with family', _selectedYouAre, (val) => setState(() => _selectedYouAre = val)),
              const Divider(height: 1),
              _buildRadioOption('Renting with other flatmates', _selectedYouAre, (val) => setState(() => _selectedYouAre = val)),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xl),

        // Occupancy Status
        _buildDropdownLabel('Occupancy Status'),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: AppColors.gray300),
          ),
          child: Column(
            children: [
              _buildRadioOption('Currently residing', _selectedOccupancy, (val) => setState(() => _selectedOccupancy = val)),
              const Divider(height: 1),
              _buildRadioOption('Flat is let out', _selectedOccupancy, (val) => setState(() => _selectedOccupancy = val)),
              const Divider(height: 1),
              _buildRadioOption('Flat is empty', _selectedOccupancy, (val) => setState(() => _selectedOccupancy = val)),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xl),

        // Document Upload Box
        _buildDropdownLabel('Upload Document Proof for RWA Review'),
        GestureDetector(
          onTap: _pickDocument,
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: _documentFile != null ? AppColors.success : AppColors.gray300, width: 1.5),
            ),
            child: Row(
              children: [
                Icon(
                  _documentFile != null ? Icons.check_circle_rounded : Icons.cloud_upload_outlined,
                  color: _documentFile != null ? AppColors.success : AppColors.primary,
                  size: 32,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _documentFile != null ? 'Document Selected' : 'Upload Proof (Rent Agreement / Utility Bill)',
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: _documentFile != null ? AppColors.success : AppColors.textPrimary),
                      ),
                      Text(
                        _documentFile != null ? _documentFile!.path.split('/').last : 'Tap to attach address proof for RWA Admin review',
                        style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.add_photo_alternate_outlined, color: AppColors.primary),
              ],
            ),
          ),
        ),

        const SizedBox(height: AppSpacing.xxl),

        // Final Submit Button
        SizedBox(
          width: double.infinity,
          height: 54,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _submitRegistration,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
            ),
            child: _isLoading
                ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white))
                : const Text('Add Flat/Villa & Submit ➔', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
          ),
        ),
      ],
    );
  }

  // ── Helper UI Widgets ──
  Widget _buildDropdownLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
    );
  }

  Widget _buildRadioOption(String value, String groupValue, ValueChanged<String> onChanged) {
    final isSelected = value == groupValue;
    return InkWell(
      onTap: () => onChanged(value),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
              color: isSelected ? AppColors.primary : AppColors.gray400,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(value, style: TextStyle(fontSize: 15, fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400, color: AppColors.textPrimary)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, color: AppColors.textSecondary),
            fillColor: Colors.white,
            filled: true,
          ),
          validator: validator,
        ),
      ],
    );
  }

  Widget _buildPasswordField(
    String label,
    TextEditingController controller,
    bool obscure,
    VoidCallback onToggle, {
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          obscureText: obscure,
          decoration: InputDecoration(
            hintText: 'Enter password',
            prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppColors.textSecondary),
            fillColor: Colors.white,
            filled: true,
            suffixIcon: IconButton(
              icon: Icon(obscure ? Icons.visibility_off_rounded : Icons.visibility_rounded),
              onPressed: onToggle,
            ),
          ),
          validator: validator ?? (v) {
            if (v == null || v.isEmpty) return 'Password is required';
            if (v.length < 6) return 'Password must be at least 6 characters';
            return null;
          },
        ),
      ],
    );
  }
}
