import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../domain/models/complaint_model.dart';

class ComplaintRatingCard extends StatefulWidget {
  final ComplaintModel complaint;
  final bool submittingRating;
  final Future<void> Function(int rating, Set<String> tags, String comment)
      onSubmitRating;

  const ComplaintRatingCard({
    super.key,
    required this.complaint,
    required this.submittingRating,
    required this.onSubmitRating,
  });

  @override
  State<ComplaintRatingCard> createState() => _ComplaintRatingCardState();
}

class _ComplaintRatingCardState extends State<ComplaintRatingCard> {
  int _selectedRating = 5;
  final _feedbackController = TextEditingController();
  final Set<String> _selectedFeedbackTags = {};

  final List<String> _quickTags = [
    '⚡ Quick Response',
    '🛠️ Professional Work',
    '😊 Polite Staff',
    '✨ Issue Fully Fixed',
    '🧹 Clean & Neat',
  ];

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final complaint = widget.complaint;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: complaint.rating != null
              ? const Color(0xFF86EFAC)
              : const Color(0xFFFDE68A),
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF59E0B).withValues(alpha: 0.08),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.star_rounded,
                color: Color(0xFFF59E0B),
                size: 22,
              ),
              const SizedBox(width: 8),
              Text(
                complaint.rating != null
                    ? 'YOUR RESOLUTION RATING'
                    : 'RATE TECHNICIAN & RESOLUTION',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.6,
                  color: Color(0xFF0F172A),
                ),
              ),
              const Spacer(),
              if (complaint.rating != null)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    '✓ Rated',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF15803D),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          if (complaint.rating != null) ...[
            Row(
              children: List.generate(
                5,
                (i) => Icon(
                  Icons.star_rounded,
                  color: i < complaint.rating!
                      ? const Color(0xFFF59E0B)
                      : const Color(0xFFCBD5E1),
                  size: 26,
                ),
              ),
            ),
            if (complaint.ratingFeedback != null &&
                complaint.ratingFeedback!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                '"${complaint.ratingFeedback}"',
                style: const TextStyle(
                  fontSize: 13,
                  fontStyle: FontStyle.italic,
                  color: Color(0xFF475569),
                ),
              ),
            ],
          ] else ...[
            const Text(
              'How satisfied are you with the resolution of this issue?',
              style: TextStyle(
                fontSize: 13,
                color: Color(0xFF475569),
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: List.generate(
                5,
                (i) => IconButton(
                  icon: Icon(
                    Icons.star_rounded,
                    color: i < _selectedRating
                        ? const Color(0xFFF59E0B)
                        : const Color(0xFFCBD5E1),
                    size: 32,
                  ),
                  onPressed: () {
                    HapticFeedback.selectionClick();
                    setState(() => _selectedRating = i + 1);
                  },
                ),
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: _quickTags.map((tag) {
                final isSelected = _selectedFeedbackTags.contains(tag);
                return FilterChip(
                  label: Text(tag),
                  selected: isSelected,
                  onSelected: (sel) {
                    HapticFeedback.selectionClick();
                    setState(() {
                      if (sel) {
                        _selectedFeedbackTags.add(tag);
                      } else {
                        _selectedFeedbackTags.remove(tag);
                      }
                    });
                  },
                  selectedColor: const Color(0xFFFEF3C7),
                  labelStyle: TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700,
                    color: isSelected
                        ? const Color(0xFF92400E)
                        : const Color(0xFF334155),
                  ),
                  backgroundColor: const Color(0xFFF8FAFC),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                    side: BorderSide(
                      color: isSelected
                          ? const Color(0xFFF59E0B)
                          : const Color(0xFFE2E8F0),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 42,
              child: ElevatedButton(
                onPressed: widget.submittingRating
                    ? null
                    : () => widget.onSubmitRating(
                          _selectedRating,
                          _selectedFeedbackTags,
                          _feedbackController.text.trim(),
                        ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  elevation: 0,
                ),
                child: widget.submittingRating
                    ? const SizedBox(
                        height: 18,
                        width: 18,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text(
                        'Submit Feedback',
                        style: TextStyle(
                            fontWeight: FontWeight.w800, fontSize: 14),
                      ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
