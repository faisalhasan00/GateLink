import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class FlatSearchPicker extends StatelessWidget {
  final List<String> dynamicFlats;
  final String selectedFlatNo;
  final TextEditingController flatSearchController;
  final ValueChanged<String> onFlatChanged;

  const FlatSearchPicker({
    super.key,
    required this.dynamicFlats,
    required this.selectedFlatNo,
    required this.flatSearchController,
    required this.onFlatChanged,
  });

  @override
  Widget build(BuildContext context) {
    final filteredFlats = dynamicFlats.where((f) {
      if (flatSearchController.text.isEmpty) return true;
      return f.contains(flatSearchController.text);
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(bottom: 6),
          child: Text(
            'Flat Number',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ),
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
                controller: flatSearchController,
                decoration: const InputDecoration(
                  hintText: 'Search flat (e.g. 101, 204)',
                  prefixIcon: Icon(Icons.search_rounded),
                  border: InputBorder.none,
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                ),
              ),
              const Divider(),
              SizedBox(
                height: 160,
                child: filteredFlats.isEmpty
                    ? const Center(
                        child: Text(
                          'No flats available for selection',
                          style: TextStyle(color: AppColors.textSecondary),
                        ),
                      )
                    : ListView.builder(
                        itemCount: filteredFlats.length,
                        itemBuilder: (ctx, i) {
                          final f = filteredFlats[i];
                          final isSelected = selectedFlatNo == f;
                          return ListTile(
                            dense: true,
                            leading: Icon(
                              Icons.home_outlined,
                              color: isSelected
                                  ? AppColors.primary
                                  : AppColors.textSecondary,
                            ),
                            title: Text(
                              f,
                              style: TextStyle(
                                fontWeight: isSelected
                                    ? FontWeight.w700
                                    : FontWeight.w500,
                                color: isSelected
                                    ? AppColors.primary
                                    : AppColors.textPrimary,
                              ),
                            ),
                            trailing: Icon(
                              isSelected
                                  ? Icons.check_circle_rounded
                                  : Icons.chevron_right_rounded,
                              color: isSelected
                                  ? AppColors.primary
                                  : AppColors.gray400,
                            ),
                            onTap: () => onFlatChanged(f),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
