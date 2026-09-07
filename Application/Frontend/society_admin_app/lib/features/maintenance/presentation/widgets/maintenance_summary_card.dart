import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_card.dart';

class MaintenanceSummaryCard extends StatelessWidget {
  final double totalPending;
  final double totalCollected;
  final double totalBilled;

  const MaintenanceSummaryCard({
    super.key,
    required this.totalPending,
    required this.totalCollected,
    required this.totalBilled,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFmt =
        NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    return AppCard(
      padding: const EdgeInsets.all(18),
      backgroundColor: AppColors.primaryNavy,
      child: Column(
        children: [
          const Text(
            'Total Maintenance Outstanding',
            style: TextStyle(color: Colors.white70, fontSize: 13),
          ),
          const SizedBox(height: 6),
          Text(
            currencyFmt.format(totalPending),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white24, height: 1),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Collected',
                      style: TextStyle(color: Colors.white70, fontSize: 11)),
                  const SizedBox(height: 2),
                  Text(
                    currencyFmt.format(totalCollected),
                    style: const TextStyle(
                        color: AppColors.successEmerald,
                        fontWeight: FontWeight.w700,
                        fontSize: 15),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text('Total Invoiced',
                      style: TextStyle(color: Colors.white70, fontSize: 11)),
                  const SizedBox(height: 2),
                  Text(
                    currencyFmt.format(totalBilled),
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 15),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
