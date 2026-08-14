abstract class UserRepository {
  Future<void> updateUserProfile(String societyId, String uid, Map<String, dynamic> data);
  Future<void> logAuditAction(String societyId, Map<String, dynamic> auditData);
  Future<Map<String, dynamic>?> checkUserStatus(String uid);
}
