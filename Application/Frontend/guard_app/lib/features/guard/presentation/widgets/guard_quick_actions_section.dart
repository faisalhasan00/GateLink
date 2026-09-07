import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/router/app_router.dart';
import 'patrol_incident_modal.dart';
import 'quick_action_button.dart';

class GuardQuickActionsSection extends StatelessWidget {
  final AppStrings tr;

  const GuardQuickActionsSection({super.key, required this.tr});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              tr.get('fast_gate_actions'),
              style: const TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
            ),
            Text(
              tr.get('one_tap_triggers'),
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: Color(0xFF059669),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: QuickActionButton(
                icon: Icons.delivery_dining_rounded,
                label: tr.get('action_delivery'),
                subtitle: tr.get('action_delivery_sub'),
                color: const Color(0xFFF97316),
                onTap: () => context.push(AppRoutes.guardQuickEntry),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: QuickActionButton(
                icon: Icons.person_add_alt_1_rounded,
                label: tr.get('action_guest'),
                subtitle: tr.get('action_guest_sub'),
                color: const Color(0xFF1E3A8A),
                onTap: () => context.push(AppRoutes.guardQuickEntry),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: QuickActionButton(
                icon: Icons.local_taxi_rounded,
                label: tr.get('action_cab'),
                subtitle: tr.get('action_cab_sub'),
                color: const Color(0xFFEAB308),
                onTap: () => context.push(AppRoutes.guardVehicles),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: QuickActionButton(
                icon: Icons.warning_rounded,
                label: tr.get('action_sos'),
                subtitle: tr.get('action_sos_sub'),
                color: const Color(0xFFDC2626),
                onTap: () => PatrolIncidentModal.show(context),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
