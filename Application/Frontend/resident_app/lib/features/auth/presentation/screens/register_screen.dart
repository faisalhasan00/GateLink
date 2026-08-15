
import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_storage/firebase_storage.dart';
import '../../../../core/providers/auth_providers.dart';
import '../../../../core/services/society_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../widgets/register_progress_header.dart';
import '../widgets/register_account_step.dart';
import '../widgets/register_society_step.dart';
import '../widgets/register_verification_step.dart';

final societyServiceProvider =
    Provider<SocietyService>((ref) => SocietyService());

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  int _currentLayer = 1;
  bool _isLoading = false;
  bool _isFetchingDb = false;
  File? _documentFile;

  // Step 1: Account Info
  final _formKeyLayer1 = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  // Step 2: Location & Live Database Society Selection
  final _formKeyLayer2 = GlobalKey<FormState>();
  List<SocietyModel> _allDbSocieties = [];
  List<String> _dynamicCountries = ['India'];
  List<String> _dynamicCities = [];
  String _selectedCountry = 'India';
  String _selectedCity = '';
  List<SocietyModel> _dbSocieties = [];
  SocietyModel? _selectedSocietyModel;
  String _selectedBuilding = 'A';
  String _selectedFlatNo = '101';
  List<String> _dynamicFlats = [];
  final _flatSearchController = TextEditingController();

  // Step 3: Residency, Occupancy & Proof
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
      final societies = await service.fetchAllSocieties();

      if (mounted) {
        setState(() {
          _allDbSocieties = societies;

          // Extract unique dynamic countries
          final countries = societies
              .map((s) => s.country.trim())
              .where((c) => c.isNotEmpty)
              .toSet()
              .toList();
          if (countries.isNotEmpty) {
            _dynamicCountries = countries;
            if (!_dynamicCountries.contains(_selectedCountry)) {
              _selectedCountry = _dynamicCountries.first;
            }
          }

          _refreshCitiesAndSocieties();
        });
      }
    } catch (_) {
    } finally {
      if (mounted) setState(() => _isFetchingDb = false);
    }
  }

  void _refreshCitiesAndSocieties() {
    // Filter societies by selected country
    final inCountry = _allDbSocieties.where((s) =>
        s.country.toLowerCase() == _selectedCountry.toLowerCase()).toList();

    // Extract unique cities
    final cities = inCountry
        .map((s) => s.city.trim())
        .where((c) => c.isNotEmpty)
        .toSet()
        .toList();

    _dynamicCities = cities.isNotEmpty ? cities : ['All Cities'];
    if (!_dynamicCities.contains(_selectedCity)) {
      _selectedCity = _dynamicCities.first;
    }

    // Filter societies by selected city
    final inCity = inCountry.where((s) {
      if (_selectedCity == 'All Cities') return true;
      return s.city.toLowerCase() == _selectedCity.toLowerCase();
    }).toList();

    _dbSocieties = inCity.isNotEmpty ? inCity : inCountry;

    if (_dbSocieties.isNotEmpty) {
      _selectedSocietyModel = _dbSocieties.first;
      _updateBuildingAndFlats(_selectedSocietyModel!);
    } else {
      _selectedSocietyModel = null;
      _dynamicFlats = [];
    }
  }

  Future<void> _updateBuildingAndFlats(SocietyModel society, [String? buildingBlock]) async {
    final service = ref.read(societyServiceProvider);
    final blocks = society.blocks;
    final building = buildingBlock ?? (blocks.isNotEmpty ? blocks.first : 'A');
    
    final occupied = await service.fetchOccupiedFlats(society.id, building);
    final flats = service.generateFlatsForSociety(society, building, occupiedFlats: occupied);

    if (mounted) {
      setState(() {
        _selectedBuilding = building;
        _dynamicFlats = flats;
        _selectedFlatNo = flats.isNotEmpty ? flats.first : '';
      });
    }
  }

  void _showError(String msg) {
    if (!mounted) return;
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
      // 1. Live Occupied Flat Pre-validation
      final occupied = await ref
          .read(societyServiceProvider)
          .fetchOccupiedFlats(_selectedSocietyModel!.id, _selectedBuilding);
      
      if (occupied.contains(_selectedFlatNo) ||
          occupied.contains('$_selectedBuilding-$_selectedFlatNo') ||
          occupied.contains('${_selectedBuilding.replaceAll('Block ', '')}-$_selectedFlatNo')) {
        _showError('Flat $_selectedFlatNo in $_selectedBuilding is already registered by another resident. Please choose an available flat.');
        setState(() => _isLoading = false);
        return;
      }

      String? documentUrl;
      if (_documentFile != null && await _documentFile!.exists()) {
        try {
          final ext = _documentFile!.path.split('.').last.toLowerCase();
          final fileName =
              'proof_${DateTime.now().millisecondsSinceEpoch}.$ext';
          final storageRef = FirebaseStorage.instance
              .ref()
              .child('verification_documents')
              .child(fileName);
          final uploadTask = await storageRef.putFile(_documentFile!);
          documentUrl = await uploadTask.ref.getDownloadURL();
        } catch (storageErr) {
          debugPrint("Firebase Storage upload fallback: $storageErr");
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
        title: Text(
          _currentLayer == 1
              ? 'Add Home'
              : _currentLayer == 2
                  ? 'Select Home'
                  : 'Residency Proof',
        ),
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
            RegisterProgressHeader(currentStep: _currentLayer),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppSpacing.pagePadding),
                child: _currentLayer == 1
                    ? RegisterAccountStep(
                        formKey: _formKeyLayer1,
                        nameController: _nameController,
                        emailController: _emailController,
                        phoneController: _phoneController,
                        passwordController: _passwordController,
                        confirmPasswordController:
                            _confirmPasswordController,
                        onNext: () => setState(() => _currentLayer = 2),
                      )
                    : _currentLayer == 2
                        ? RegisterSocietyStep(
                            formKey: _formKeyLayer2,
                            isFetchingDb: _isFetchingDb,
                            selectedCountry: _selectedCountry,
                            selectedCity: _selectedCity,
                            countries: _dynamicCountries,
                            availableCities: _dynamicCities,
                            dbSocieties: _dbSocieties,
                            selectedSocietyModel: _selectedSocietyModel,
                            selectedBuilding: _selectedBuilding,
                            selectedFlatNo: _selectedFlatNo,
                            dynamicFlats: _dynamicFlats,
                            flatSearchController: _flatSearchController,
                            onCountryChanged: (c) {
                              setState(() {
                                _selectedCountry = c;
                                _refreshCitiesAndSocieties();
                              });
                            },
                            onCityChanged: (city) {
                              setState(() {
                                _selectedCity = city;
                                _refreshCitiesAndSocieties();
                              });
                            },
                            onSocietyChanged: (soc) {
                              if (soc != null) {
                                setState(() {
                                  _selectedSocietyModel = soc;
                                  _updateBuildingAndFlats(soc);
                                });
                              }
                            },
                            onBuildingChanged: (b) {
                              if (_selectedSocietyModel != null) {
                                _updateBuildingAndFlats(_selectedSocietyModel!, b);
                              } else {
                                setState(() => _selectedBuilding = b);
                              }
                            },
                            onFlatChanged: (f) =>
                                setState(() => _selectedFlatNo = f),
                            onNext: () {
                              if (_selectedSocietyModel == null) {
                                _showError(
                                    'Please select a society from the list');
                                return;
                              }
                              setState(() => _currentLayer = 3);
                            },
                          )
                        : RegisterVerificationStep(
                            selectedYouAre: _selectedYouAre,
                            selectedOccupancy: _selectedOccupancy,
                            documentType: _documentType,
                            documentFile: _documentFile,
                            isLoading: _isLoading,
                            onYouAreChanged: (v) =>
                                setState(() => _selectedYouAre = v),
                            onOccupancyChanged: (v) =>
                                setState(() => _selectedOccupancy = v),
                            onDocumentPicked: (file, docType) {
                              setState(() {
                                _documentFile = file;
                                _documentType = docType;
                              });
                            },
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
