import 'package:flutter/material.dart';
import 'package:societysphere/core/theme/app_colors.dart';
import 'maids_directory_section.dart';
import 'salon_beautician_section.dart';

class MaidsSalonDashboardView extends StatefulWidget {
  const MaidsSalonDashboardView({super.key});

  @override
  State<MaidsSalonDashboardView> createState() => _MaidsSalonDashboardViewState();
}

class _MaidsSalonDashboardViewState extends State<MaidsSalonDashboardView> {
  int _tabIndex = 0; // 0 = Maids & Daily Help, 1 = Doorstep Salon

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Sub-segmented toggle: Daily Helpers vs Doorstep Salon
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () => setState(() => _tabIndex = 0),
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: _tabIndex == 0 ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: _tabIndex == 0
                          ? [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 4, offset: const Offset(0, 2))]
                          : null,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.cleaning_services_rounded,
                          size: 16,
                          color: _tabIndex == 0 ? const Color(0xFF1E3A8A) : const Color(0xFF64748B),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Daily Helpers & Maids',
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: _tabIndex == 0 ? FontWeight.w800 : FontWeight.w600,
                            color: _tabIndex == 0 ? const Color(0xFF1E3A8A) : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: InkWell(
                  onTap: () => setState(() => _tabIndex = 1),
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: _tabIndex == 1 ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: _tabIndex == 1
                          ? [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 4, offset: const Offset(0, 2))]
                          : null,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.spa_rounded,
                          size: 16,
                          color: _tabIndex == 1 ? const Color(0xFF0EA5E9) : const Color(0xFF64748B),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Salon & Beautician',
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: _tabIndex == 1 ? FontWeight.w800 : FontWeight.w600,
                            color: _tabIndex == 1 ? const Color(0xFF0EA5E9) : const Color(0xFF64748B),
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
        const SizedBox(height: 16),

        // Display Active Sub Tab
        if (_tabIndex == 0)
          const MaidsDirectorySection()
        else
          const SalonBeauticianSection(),

        const SizedBox(height: 24),
      ],
    );
  }
}
