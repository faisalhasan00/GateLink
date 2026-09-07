import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class OnboardSocietyFormFields extends StatelessWidget {
  final TextEditingController societyNameController;
  final TextEditingController addressController;
  final TextEditingController cityController;
  final TextEditingController flatsController;
  final TextEditingController adminNameController;
  final TextEditingController adminPhoneController;
  final TextEditingController adminEmailController;

  const OnboardSocietyFormFields({
    super.key,
    required this.societyNameController,
    required this.addressController,
    required this.cityController,
    required this.flatsController,
    required this.adminNameController,
    required this.adminPhoneController,
    required this.adminEmailController,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '1. Society Details',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
        ),
        const SizedBox(height: 10),
        TextFormField(
          controller: societyNameController,
          decoration: InputDecoration(
            labelText: 'Society / Apartment Name *',
            hintText: 'e.g. Sunshine Heights Co-op Housing',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
            prefixIcon: const Icon(Icons.domain_rounded, color: AppColors.primary),
          ),
          validator: (val) => val == null || val.trim().isEmpty ? 'Enter society name' : null,
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: cityController,
                decoration: InputDecoration(
                  labelText: 'City *',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.location_city_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter city' : null,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: TextFormField(
                controller: flatsController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Total Flats *',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.apartment_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter flats' : null,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: addressController,
          decoration: InputDecoration(
            labelText: 'Full Address *',
            hintText: 'e.g. Road No 12, Banjara Hills',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
            prefixIcon: const Icon(Icons.map_rounded, color: AppColors.primary),
          ),
          validator: (val) => val == null || val.trim().isEmpty ? 'Enter address' : null,
        ),
        const SizedBox(height: 20),
        const Text(
          '2. RWA Secretary / Admin Details',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
        ),
        const SizedBox(height: 10),
        TextFormField(
          controller: adminNameController,
          decoration: InputDecoration(
            labelText: 'Secretary / Admin Name *',
            hintText: 'e.g. Subhash Chandra',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
            prefixIcon: const Icon(Icons.person_rounded, color: AppColors.primary),
          ),
          validator: (val) => val == null || val.trim().isEmpty ? 'Enter admin name' : null,
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: adminPhoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: 'Admin Mobile *',
                  prefixText: '+91 ',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.phone_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || val.trim().length < 10 ? 'Enter phone' : null,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: TextFormField(
                controller: adminEmailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Admin Email *',
                  hintText: 'admin@society.in',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                  prefixIcon: const Icon(Icons.email_rounded, color: AppColors.primary),
                ),
                validator: (val) => val == null || !val.contains('@') ? 'Enter email' : null,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
