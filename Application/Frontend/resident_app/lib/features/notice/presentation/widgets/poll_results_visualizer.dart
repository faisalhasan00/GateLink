import 'package:flutter/material.dart';
import '../../domain/models/poll_model.dart';

class PollResultsVisualizer extends StatelessWidget {
  final PollModel poll;

  const PollResultsVisualizer({
    super.key,
    required this.poll,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: poll.options.map((opt) {
        final percentage = poll.totalVotes > 0
            ? ((opt.voteCount / poll.totalVotes) * 100).round()
            : 0;
        final isUserVote = poll.userVotedOptionId == opt.id;

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isUserVote ? const Color(0xFFEFF6FF) : const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isUserVote ? const Color(0xFF3B82F6) : const Color(0xFFE2E8F0),
              width: isUserVote ? 1.5 : 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        if (isUserVote)
                          const Padding(
                            padding: EdgeInsets.only(right: 6),
                            child: Icon(
                              Icons.check_circle_rounded,
                              size: 16,
                              color: Color(0xFF2563EB),
                            ),
                          ),
                        Expanded(
                          child: Text(
                            opt.text,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: isUserVote ? FontWeight.w800 : FontWeight.w600,
                              color: isUserVote ? const Color(0xFF1D4ED8) : const Color(0xFF1E293B),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '$percentage% (${opt.voteCount})',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: isUserVote ? const Color(0xFF1D4ED8) : const Color(0xFF475569),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: LinearProgressIndicator(
                  value: poll.totalVotes > 0 ? opt.voteCount / poll.totalVotes : 0.0,
                  backgroundColor: const Color(0xFFE2E8F0),
                  valueColor: AlwaysStoppedAnimation<Color>(
                    isUserVote ? const Color(0xFF2563EB) : const Color(0xFF94A3B8),
                  ),
                  minHeight: 8,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}
