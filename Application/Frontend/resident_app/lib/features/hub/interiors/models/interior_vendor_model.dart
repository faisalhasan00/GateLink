enum VendorType {
  studio,
  freelancer,
  contractor,
}

class PortfolioProject {
  final String id;
  final String title;
  final String flatType; // e.g. "3BHK Luxury Interior", "Modular Kitchen"
  final String budget; // e.g. "₹4.8 Lakhs"
  final String style; // e.g. "Modern Minimalist", "Warm Scandinavian"
  final String duration; // e.g. "45 Days"
  final String description;
  final List<String> imageUrls;
  final List<String> highlights;

  const PortfolioProject({
    required this.id,
    required this.title,
    required this.flatType,
    required this.budget,
    required this.style,
    required this.duration,
    required this.description,
    required this.imageUrls,
    required this.highlights,
  });
}

class InteriorPackage {
  final String id;
  final String title;
  final String price;
  final String estimatedDuration;
  final List<String> inclusions;
  final String tag;

  const InteriorPackage({
    required this.id,
    required this.title,
    required this.price,
    required this.estimatedDuration,
    required this.inclusions,
    required this.tag,
  });
}

class VendorReview {
  final String residentName;
  final String flatNumber;
  final double rating;
  final String comment;
  final String date;

  const VendorReview({
    required this.residentName,
    required this.flatNumber,
    required this.rating,
    required this.comment,
    required this.date,
  });
}

class InteriorVendor {
  final String id;
  final String name;
  final String tagline;
  final VendorType type;
  final double rating;
  final int reviewsCount;
  final int completedProjectsCount;
  final String startingPrice;
  final String experience;
  final String phone;
  final String email;
  final String address;
  final bool isVerified;
  final List<String> specialties;
  final List<PortfolioProject> projects;
  final List<InteriorPackage> packages;
  final List<VendorReview> reviews;

  const InteriorVendor({
    required this.id,
    required this.name,
    required this.tagline,
    required this.type,
    required this.rating,
    required this.reviewsCount,
    required this.completedProjectsCount,
    required this.startingPrice,
    required this.experience,
    required this.phone,
    required this.email,
    required this.address,
    required this.isVerified,
    required this.specialties,
    required this.projects,
    required this.packages,
    required this.reviews,
  });
}
