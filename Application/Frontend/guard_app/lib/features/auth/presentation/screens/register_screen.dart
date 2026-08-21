import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_storage/firebase_storage.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/services/society_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../widgets/account_info_step.dart';
import '../widgets/society_location_step.dart';
import '../widgets/residency_proof_step.dart';

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

  // Layer 1: Account Info
  final _formKeyLayer1 = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;

  // Layer 2: Location & Society Selection
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

  // Layer 3: Residency, Occupancy & Proof
  String _selectedYouAre = 'Flat Owner';
  String _selectedOccupancy = 'Currently residing';
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
    } catch (_) {
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
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Upload Verification Document', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            const Text('Select document format (Image, PDF, or File)', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.photo_library_rounded, color: AppColors.primary, size: 28),
              title: const Text('Image / Photo', style: TextStyle(fontWeight: FontWeight.w700)),
              subtitle: const Text('PNG, JPG, WEBP from Gallery'),
              onTap: () async {
                Navigator.pop(ctx);
                final picked = await _picker.pickImage(
                  source: ImageSource.gallery,
                  maxWidth: 800,
                  maxHeight: 800,
                  imageQuality: 60,
                );
                if (picked != null) {
                  setState(() {
                    _documentFile = File(picked.path);
                    _documentType = 'Rent Agreement / Image';
                  });
                }
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.picture_as_pdf_rounded, color: Colors.redAccent, size: 28),
              title: const Text('PDF / Document File', style: TextStyle(fontWeight: FontWeight.w700)),
              subtitle: const Text('PDF, DOC, DOCX, or scan document'),
              onTap: () async {
                Navigator.pop(ctx);
                final result = await FilePicker.platform.pickFiles(
                  type: FileType.custom,
                  allowedExtensions: ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'],
                );
                if (result != null && result.files.single.path != null) {
                  setState(() {
                    _documentFile = File(result.files.single.path!);
                    final ext = result.files.single.extension?.toUpperCase() ?? 'PDF';
                    _documentType = '$ext Document';
                  });
                }
              },
            ),
          ],
        ),
      ),
    );
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
      String? documentUrl;
      if (_documentFile != null && await _documentFile!.exists()) {
        try {
          final ext = _documentFile!.path.split('.').last.toLowerCase();
          final fileName = 'proof_${DateTime.now().millisecondsSinceEpoch}.$ext';
          final storageRef = FirebaseStorage.instance.ref().child('verification_documents').child(fileName);
          final uploadTask = await storageRef.putFile(_documentFile!);
          documentUrl = await uploadTask.ref.getDownloadURL();
        } catch (_) {
          final bytes = await _documentFile!.readAsBytes();
          final base64Str = base64Encode(bytes);
          final isPdf = _documentFile!.path.toLowerCase().endsWith('.pdf');
          final mime = isPdf ? 'application/pdf' : 'image/jpeg';
          documentUrl = 'data:$mime;base64,$base64Str';
        }
      }

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
        documentProofUrl: documentUrl ?? _documentFile?.path,
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
            // Layer Progress Header
            Container(
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
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppSpacing.pagePadding),
                child: _currentLayer == 1
                    ? AccountInfoStep(
                        formKey: _formKeyLayer1,
                        nameController: _nameController,
                        emailController: _emailController,
                        phoneController: _phoneController,
                        passwordController: _passwordController,
                        confirmPasswordController: _confirmPasswordController,
                        obscurePassword: _obscurePassword,
                        onToggleObscure: () => setState(() => _obscurePassword = !_obscurePassword),
                        onNext: () => setState(() => _currentLayer = 2),
                      )
                    : _currentLayer == 2
                        ? SocietyLocationStep(
                            formKey: _formKeyLayer2,
                            selectedCountry: _selectedCountry,
                            selectedCity: _selectedCity,
                            countries: _countries,
                            cityMap: _cityMap,
                            dbSocieties: _dbSocieties,
                            selectedSocietyModel: _selectedSocietyModel,
                            isFetchingDb: _isFetchingDb,
                            selectedBuilding: _selectedBuilding,
                            selectedFlatNo: _selectedFlatNo,
                            dynamicFlats: _dynamicFlats,
                            flatSearchController: _flatSearchController,
                            onCountryChanged: (val) {
                              setState(() {
                                _selectedCountry = val;
                                _selectedCity = _cityMap[val]!.first;
                              });
                              _loadDatabaseSocieties();
                            },
                            onCityChanged: (val) {
                              setState(() => _selectedCity = val);
                              _loadDatabaseSocieties();
                            },
                            onSocietyChanged: (val) {
                              if (val != null) {
                                setState(() {
                                  _selectedSocietyModel = val;
                                  _updateBuildingAndFlats(val);
                                });
                              }
                            },
                            onBuildingChanged: (val) {
                              setState(() {
                                _selectedBuilding = val;
                                if (_selectedSocietyModel != null) {
                                  _dynamicFlats = ref.read(societyServiceProvider).generateFlatsForSociety(_selectedSocietyModel!, val);
                                  if (_dynamicFlats.isNotEmpty) _selectedFlatNo = _dynamicFlats.first;
                                }
                              });
                            },
                            onFlatChanged: (val) => setState(() => _selectedFlatNo = val),
                            onNext: () => setState(() => _currentLayer = 3),
                          )
                        : ResidencyProofStep(
                            selectedSocietyModel: _selectedSocietyModel,
                            selectedBuilding: _selectedBuilding,
                            selectedFlatNo: _selectedFlatNo,
                            selectedCity: _selectedCity,
                            selectedCountry: _selectedCountry,
                            selectedYouAre: _selectedYouAre,
                            selectedOccupancy: _selectedOccupancy,
                            documentFile: _documentFile,
                            isLoading: _isLoading,
                            onYouAreChanged: (val) => setState(() => _selectedYouAre = val),
                            onOccupancyChanged: (val) => setState(() => _selectedOccupancy = val),
                            onPickDocument: _pickDocument,
                            onSubmit: _submitRegistration,
                          ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
