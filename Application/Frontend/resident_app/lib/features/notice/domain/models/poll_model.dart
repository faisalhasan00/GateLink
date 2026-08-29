import 'package:cloud_firestore/cloud_firestore.dart';

class PollOption {
  final String id;
  final String text;
  final int voteCount;

  const PollOption({
    required this.id,
    required this.text,
    this.voteCount = 0,
  });

  factory PollOption.fromMap(Map<String, dynamic> map) {
    return PollOption(
      id: map['id'] as String? ?? '',
      text: map['text'] as String? ?? '',
      voteCount: (map['voteCount'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'text': text,
      'voteCount': voteCount,
    };
  }

  PollOption copyWith({
    String? id,
    String? text,
    int? voteCount,
  }) {
    return PollOption(
      id: id ?? this.id,
      text: text ?? this.text,
      voteCount: voteCount ?? this.voteCount,
    );
  }
}

class PollModel {
  final String id;
  final String title;
  final String description;
  final String category; // 'AGM Resolution', 'Facility Upgrade', 'Society Rule', 'General Poll'
  final List<String> allowedRoles; // ['owner'] or ['owner', 'tenant', 'resident']
  final String votingRule; // 'one_per_flat' or 'one_per_user'
  final String status; // 'active' or 'closed'
  final String? expiresAt;
  final String? createdAt;
  final String? createdBy;
  final int totalVotes;
  final List<PollOption> options;
  final String? userVotedOptionId; // Local/hydrated field if user/flat has already voted

  const PollModel({
    required this.id,
    required this.title,
    required this.description,
    this.category = 'General Poll',
    this.allowedRoles = const ['owner', 'tenant', 'resident'],
    this.votingRule = 'one_per_flat',
    this.status = 'active',
    this.expiresAt,
    this.createdAt,
    this.createdBy,
    this.totalVotes = 0,
    this.options = const [],
    this.userVotedOptionId,
  });

  factory PollModel.fromFirestore(DocumentSnapshot doc, {String? userVotedOptionId}) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return PollModel.fromMap(data, defaultId: doc.id, userVotedOptionId: userVotedOptionId);
  }

  factory PollModel.fromMap(Map<String, dynamic> map, {String? defaultId, String? userVotedOptionId}) {
    final rawOptions = map['options'] as List<dynamic>? ?? [];
    final parsedOptions = rawOptions
        .whereType<Map<String, dynamic>>()
        .map((opt) => PollOption.fromMap(opt))
        .toList();

    final rawRoles = map['allowedRoles'] as List<dynamic>? ?? ['owner', 'tenant', 'resident'];
    final parsedRoles = rawRoles.map((r) => r.toString().toLowerCase()).toList();

    return PollModel(
      id: map['id'] as String? ?? defaultId ?? '',
      title: map['title'] as String? ?? 'Society Poll',
      description: map['description'] as String? ?? '',
      category: map['category'] as String? ?? 'General Poll',
      allowedRoles: parsedRoles,
      votingRule: map['votingRule'] as String? ?? 'one_per_flat',
      status: map['status'] as String? ?? 'active',
      expiresAt: map['expiresAt'] as String?,
      createdAt: map['createdAt'] as String?,
      createdBy: map['createdBy'] as String?,
      totalVotes: (map['totalVotes'] as num?)?.toInt() ?? 0,
      options: parsedOptions,
      userVotedOptionId: userVotedOptionId ?? map['userVotedOptionId'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'allowedRoles': allowedRoles,
      'votingRule': votingRule,
      'status': status,
      if (expiresAt != null) 'expiresAt': expiresAt,
      if (createdAt != null) 'createdAt': createdAt,
      if (createdBy != null) 'createdBy': createdBy,
      'totalVotes': totalVotes,
      'options': options.map((o) => o.toMap()).toList(),
    };
  }

  bool get isActive {
    if (status != 'active') return false;
    if (expiresAt != null && expiresAt!.isNotEmpty) {
      try {
        final exp = DateTime.parse(expiresAt!);
        if (DateTime.now().isAfter(exp)) return false;
      } catch (_) {}
    }
    return true;
  }

  bool get isExpired => !isActive;

  bool get hasVoted => userVotedOptionId != null && userVotedOptionId!.isNotEmpty;

  bool get isOwnerOnly =>
      allowedRoles.length == 1 && allowedRoles.first.toLowerCase() == 'owner';

  bool canUserVote(String userRole) {
    if (isExpired) return false;
    if (hasVoted) return false;
    final role = userRole.toLowerCase().trim();
    return allowedRoles.contains(role) || (role == 'admin') || (role == 'super_admin');
  }

  PollModel copyWith({
    String? id,
    String? title,
    String? description,
    String? category,
    List<String>? allowedRoles,
    String? votingRule,
    String? status,
    String? expiresAt,
    String? createdAt,
    String? createdBy,
    int? totalVotes,
    List<PollOption>? options,
    String? userVotedOptionId,
  }) {
    return PollModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      allowedRoles: allowedRoles ?? this.allowedRoles,
      votingRule: votingRule ?? this.votingRule,
      status: status ?? this.status,
      expiresAt: expiresAt ?? this.expiresAt,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      totalVotes: totalVotes ?? this.totalVotes,
      options: options ?? this.options,
      userVotedOptionId: userVotedOptionId ?? this.userVotedOptionId,
    );
  }
}
