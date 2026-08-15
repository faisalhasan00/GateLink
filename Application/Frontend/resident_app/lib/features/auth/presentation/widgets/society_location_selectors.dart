import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class SocietyLocationSelectors extends StatelessWidget {
  final String selectedCountry;
  final String selectedCity;
  final List<String> countries;
  final List<String> availableCities;
  final ValueChanged<String> onCountryChanged;
  final ValueChanged<String> onCityChanged;

  const SocietyLocationSelectors({
    super.key,
    required this.selectedCountry,
    required this.selectedCity,
    required this.countries,
    required this.availableCities,
    required this.onCountryChanged,
    required this.onCityChanged,
  });

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Country Dropdown
        _buildLabel('Country'),
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
              items: countries
                  .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                  .toList(),
              onChanged: (val) {
                if (val != null) onCountryChanged(val);
              },
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.md),

        // City Dropdown
        _buildLabel('City'),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: AppColors.gray300),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: availableCities.contains(selectedCity)
                  ? selectedCity
                  : (availableCities.isNotEmpty
                      ? availableCities.first
                      : 'All Cities'),
              isExpanded: true,
              items: availableCities
                  .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                  .toList(),
              onChanged: (val) {
                if (val != null) onCityChanged(val);
              },
            ),
          ),
        ),
      ],
    );
  }
}
