import 'package:flutter/material.dart';
import '../../../../core/services/society_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import 'society_location_selectors.dart';
import 'society_dropdown_selector.dart';
import 'building_block_selector.dart';
import 'flat_search_picker.dart';

class RegisterSocietyStep extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final bool isFetchingDb;
  final String selectedCountry;
  final String selectedCity;
  final List<String> countries;
  final List<String> availableCities;
  final List<SocietyModel> dbSocieties;
  final SocietyModel? selectedSocietyModel;
  final String selectedBuilding;
  final String selectedFlatNo;
  final List<String> dynamicFlats;
  final TextEditingController flatSearchController;
  final ValueChanged<String> onCountryChanged;
  final ValueChanged<String> onCityChanged;
  final ValueChanged<SocietyModel?> onSocietyChanged;
  final ValueChanged<String> onBuildingChanged;
  final ValueChanged<String> onFlatChanged;
  final VoidCallback onNext;

  const RegisterSocietyStep({
    super.key,
    required this.formKey,
    required this.isFetchingDb,
    required this.selectedCountry,
    required this.selectedCity,
    required this.countries,
    required this.availableCities,
    required this.dbSocieties,
    required this.selectedSocietyModel,
    required this.selectedBuilding,
    required this.selectedFlatNo,
    required this.dynamicFlats,
    required this.flatSearchController,
    required this.onCountryChanged,
    required this.onCityChanged,
    required this.onSocietyChanged,
    required this.onBuildingChanged,
    required this.onFlatChanged,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Select Your Home',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              if (isFetchingDb)
                const SizedBox(
                  height: 18,
                  width: 18,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.primary,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            'Live society directory fetched from Firestore',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.xl),

          // 1. Modular Country & City Dropdowns
          SocietyLocationSelectors(
            selectedCountry: selectedCountry,
            selectedCity: selectedCity,
            countries: countries,
            availableCities: availableCities,
            onCountryChanged: onCountryChanged,
            onCityChanged: onCityChanged,
          ),
          const SizedBox(height: AppSpacing.md),

          // 2. Modular Society Dropdown
          SocietyDropdownSelector(
            dbSocieties: dbSocieties,
            selectedSocietyModel: selectedSocietyModel,
            onSocietyChanged: onSocietyChanged,
          ),
          const SizedBox(height: AppSpacing.md),

          // 3. Modular Building Block Selector
          BuildingBlockSelector(
            selectedSocietyModel: selectedSocietyModel,
            selectedBuilding: selectedBuilding,
            onBuildingChanged: onBuildingChanged,
          ),
          const SizedBox(height: AppSpacing.md),

          // 4. Modular Flat Search & Selection
          FlatSearchPicker(
            dynamicFlats: dynamicFlats,
            selectedFlatNo: selectedFlatNo,
            flatSearchController: flatSearchController,
            onFlatChanged: onFlatChanged,
          ),
          const SizedBox(height: AppSpacing.xxl),

          // Next Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: onNext,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                ),
              ),
              child: const Text(
                'Next: Residency & Verification ➔',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
