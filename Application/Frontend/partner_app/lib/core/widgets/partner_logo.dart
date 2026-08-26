import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

enum PartnerLogoSize { small, medium, large }

class PartnerLogo extends StatelessWidget {
  final PartnerLogoSize size;
  final bool showText;
  final bool showTagline;
  final bool isDark;

  const PartnerLogo({
    super.key,
    this.size = PartnerLogoSize.medium,
    this.showText = true,
    this.showTagline = true,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    double logoHeight;
    double fontSize;
    double subtitleSize;

    switch (size) {
      case PartnerLogoSize.small:
        logoHeight = 26.0;
        fontSize = 15.0;
        subtitleSize = 10.0;
        break;
      case PartnerLogoSize.medium:
        logoHeight = 38.0;
        fontSize = 19.0;
        subtitleSize = 11.0;
        break;
      case PartnerLogoSize.large:
        logoHeight = 54.0;
        fontSize = 24.0;
        subtitleSize = 12.0;
        break;
    }

    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white70 : AppColors.textSecondary;

    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          height: logoHeight,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
          ),
          child: Image.asset(
            'assets/images/app_logo.png',
            height: logoHeight,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              return Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  Icons.handshake_rounded,
                  color: Colors.white,
                  size: logoHeight * 0.7,
                ),
              );
            },
          ),
        ),
        if (showText) ...[
          const SizedBox(width: 10),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'GateLink',
                    style: TextStyle(
                      fontSize: fontSize,
                      fontWeight: FontWeight.w900,
                      color: textColor,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(width: 5),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: const Text(
                      'PARTNER',
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ],
              ),
              if (showTagline) ...[
                const SizedBox(height: 1),
                Text(
                  'Channel Partner & Broker Network',
                  style: TextStyle(
                    fontSize: subtitleSize,
                    color: subtitleColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ],
          ),
        ],
      ],
    );
  }
}
