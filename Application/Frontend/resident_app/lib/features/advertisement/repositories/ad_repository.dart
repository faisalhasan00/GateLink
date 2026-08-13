import '../models/ad_model.dart';

abstract class AdRepository {
  Stream<List<AdModel>> watchAdCampaigns(String societyId);
}
