import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class BillSummaryCard extends StatelessWidget {
  final String month;
  final double totalAmount;
  final double maintenanceCharge;
  final double waterCharge;
  final double parkingCharge;
  final double sinkingFund;
  final double penaltyFee;

  const BillSummaryCard({
    super.key,
    required this.month,
    required this.totalAmount,
    required this.maintenanceCharge,
    required this.waterCharge,
    required this.parkingCharge,
    required this.sinkingFund,
    required this.penaltyFee,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1D4ED8), Color(0xFF2563EB)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppRadius.xl),
      ),
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Bill Summary',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.white70,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
                child: const Text(
                  'PENDING',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            month,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          const Divider(color: Colors.white24),
          const SizedBox(height: AppSpacing.sm),
          _BillLine(
            label: 'Base Maintenance',
            value: '₹${maintenanceCharge.toStringAsFixed(0)}',
            white: true,
          ),
          if (waterCharge > 0)
            _BillLine(
              label: 'Water Supply',
              value: '₹${waterCharge.toStringAsFixed(0)}',
              white: true,
            ),
          if (parkingCharge > 0)
            _BillLine(
              label: 'Parking Slot',
              value: '₹${parkingCharge.toStringAsFixed(0)}',
              white: true,
            ),
          if (sinkingFund > 0)
            _BillLine(
              label: 'Sinking Fund',
              value: '₹${sinkingFund.toStringAsFixed(0)}',
              white: true,
            ),
          if (penaltyFee > 0)
            _BillLine(
              label: 'Late Penalty',
              value: '₹${penaltyFee.toStringAsFixed(0)}',
              isRed: true,
            ),
          const Divider(color: Colors.white24, height: AppSpacing.lg),
          Row(
            children: [
              const Text(
                'Total Payable',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              const Spacer(),
              Text(
                '₹${totalAmount.toStringAsFixed(0)}',
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _BillLine extends StatelessWidget {
  final String label, value;
  final bool white;
  final bool isRed;

  const _BillLine({
    required this.label,
    required this.value,
    this.white = false,
    this.isRed = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              color: white ? Colors.white70 : AppColors.textSecondary,
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isRed
                  ? Colors.redAccent.shade100
                  : (white ? Colors.white : AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}
