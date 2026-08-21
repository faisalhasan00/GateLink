import 'package:flutter/material.dart';
import '../../../../core/services/society_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class SocietyLocationStep extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final String selectedCountry;
  final String selectedCity;
  final List<String> countries;
  final Map<String, List<String>> cityMap;
  final List<SocietyModel> dbSocieties;
  final SocietyModel? selectedSocietyModel;
  final bool isFetchingDb;
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

  const SocietyLocationStep({
    super.key,
    required this.formKey,
    required this.selectedCountry,
    required this.selectedCity,
    required this.countries,
    required this.cityMap,
    required this.dbSocieties,
    required this.selectedSocietyModel,
    required this.isFetchingDb,
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
    final availableCities = cityMap[selectedCountry] ?? ['Hyderabad'];

    return Form(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Select Your Home', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              if (isFetchingDb)
                const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary)),
            ],
          ),
          const SizedBox(height: 4),
          const Text('Data fetched directly from live Firestore database records', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          const SizedBox(height: AppSpacing.xl),

          // Country Dropdown
          const Text('Country', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary)),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.gray300),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: selectedCountry,
                isExpanded: true,
                items: countries.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (val) {
                  if (val != null) onCountryChanged(val);
                },
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // City Dropdown
          const Text('City', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary)),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.gray300),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: availableCities.contains(selectedCity) ? selectedCity : availableCities.first,
                isExpanded: true,
                items: availableCities.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (val) {
                  if (val != null) onCityChanged(val);
                },
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Society Dropdown
          const Text('Society (Fetched from Database)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary)),
          const SizedBox(height: 6),
          dbSocieties.isEmpty
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
                      value: selectedSocietyModel,
                      isExpanded: true,
                      hint: const Text('Select Society from Database'),
                      items: dbSocieties.map((soc) => DropdownMenuItem(
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
                      onChanged: onSocietyChanged,
                    ),
                  ),
                ),
          const SizedBox(height: AppSpacing.xxl),

          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                if (selectedSocietyModel != null) {
                  onNext();
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.lg)),
              ),
              child: const Text('Next: Residency Proof ➔', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }
}
