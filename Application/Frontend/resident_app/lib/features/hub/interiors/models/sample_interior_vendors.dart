import '../models/interior_vendor_model.dart';

final List<InteriorVendor> sampleInteriorVendors = [
  const InteriorVendor(
    id: 'vendor-1',
    name: 'Studio Luxe Living',
    tagline: 'Premium Turnkey Interiors & Modular Architectural Systems',
    type: VendorType.studio,
    rating: 4.9,
    reviewsCount: 38,
    completedProjectsCount: 52,
    startingPrice: '₹3.5 Lakhs',
    experience: '9+ Years Experience',
    phone: '+91 98451 22334',
    email: 'contact@studioluxe.in',
    address: 'Indiranagar 100ft Road, Bangalore',
    isVerified: true,
    specialties: [
      'Modular Kitchens',
      'Luxury Living Rooms',
      'Wardrobe Systems',
      'False Ceiling & Smart LED',
    ],
    projects: [
      PortfolioProject(
        id: 'proj-1',
        title: '3BHK Contemporary Zen Apartment',
        flatType: '3BHK • Tower 2, Flat 804',
        budget: '₹6.2 Lakhs',
        style: 'Warm Japandi & Oak Finishes',
        duration: '40 Days',
        description:
            'Complete turnkey transformation including acoustic fluted panels, hydraulic storage master bed, custom bar counter, and Italian PU-finished modular kitchen.',
        imageUrls: [],
        highlights: [
          'Anti-fingerprint acrylic kitchen cabinets',
          'Concealed warm cove lighting with Alexa integration',
          'Solid oak 6-seater dining set with rounded edges',
        ],
      ),
      PortfolioProject(
        id: 'proj-2',
        title: '2BHK Space-Optimized Urban Flat',
        flatType: '2BHK • Tower 1, Flat 302',
        budget: '₹3.8 Lakhs',
        style: 'Modern Minimalist',
        duration: '28 Days',
        description:
            'Focus on hidden storage, dual-purpose study/guest room, and seamless TV unit with hidden cable management.',
        imageUrls: [],
        highlights: [
          'Wall-bed unit with integrated study desk',
          'Soft-close telescopic wardrobe sliders',
          'Quartz countertop with under-mount granite sink',
        ],
      ),
    ],
    packages: [
      InteriorPackage(
        id: 'pkg-1',
        title: 'Essential 2BHK Modular Package',
        price: '₹3.49 Lakhs',
        estimatedDuration: '30 Days',
        tag: 'MOST POPULAR',
        inclusions: [
          'Acrylic modular kitchen with tandem drawers',
          'Master bedroom sliding wardrobe (7x7 ft)',
          'Living room TV console with textured back wall',
          'Entryway foyer shoe rack with seating',
          '10-Year hardware replacement warranty',
        ],
      ),
      InteriorPackage(
        id: 'pkg-2',
        title: 'Luxe 3BHK Complete Turnkey Suite',
        price: '₹5.99 Lakhs',
        estimatedDuration: '45 Days',
        tag: 'ALL-INCLUSIVE',
        inclusions: [
          'Full modular kitchen with quartz & chimney ducting',
          '3 Bedroom wardrobes with internal LED profiles',
          'False ceiling & designer magnetic track lights',
          'Custom 6-seater solid wood dining table',
          'Complete Royale luxury wall painting',
        ],
      ),
    ],
    reviews: [
      VendorReview(
        residentName: 'Rajesh & Pooja K.',
        flatNumber: 'Flat B-501',
        rating: 5.0,
        comment:
            'Studio Luxe designed our complete 3BHK flat. The 3D designs matched the final handover exactly! Zero delay on handover.',
        date: '2 weeks ago',
      ),
      VendorReview(
        residentName: 'Anita Menon',
        flatNumber: 'Flat A-804',
        rating: 4.8,
        comment:
            'Very professional team. Their modular kitchen finish is top notch and the soft-close drawers are extremely smooth.',
        date: '1 month ago',
      ),
    ],
  ),
  const InteriorVendor(
    id: 'vendor-2',
    name: 'Elena Vance Designs (Freelance Architect)',
    tagline: 'Custom Sustainable Homes, Scandinavian Aesthetics & Bespoke Woodcraft',
    type: VendorType.freelancer,
    rating: 5.0,
    reviewsCount: 19,
    completedProjectsCount: 26,
    startingPrice: '₹1.8 Lakhs',
    experience: '6+ Years Experience',
    phone: '+91 97312 88441',
    email: 'elena.vance.arch@gmail.com',
    address: 'Koramangala 4th Block, Bangalore',
    isVerified: true,
    specialties: [
      'Space Planning',
      'Scandinavian & Boho Decor',
      'Custom Reclaimed Teak Furniture',
      'Balcony Garden Living',
    ],
    projects: [
      PortfolioProject(
        id: 'proj-3',
        title: 'Scandinavian Living & Green Balcony Oasis',
        flatType: '2BHK • Tower 3, Flat 1102',
        budget: '₹2.4 Lakhs',
        style: 'Scandinavian Eco-Luxe',
        duration: '21 Days',
        description:
            'Handcrafted cane & teak furniture, vertical balcony planter wall with drip irrigation, and custom fluted glass room divider.',
        imageUrls: [],
        highlights: [
          'Live-edge acacia center coffee table',
          'Custom velvet bouclé accent armchairs',
          'Micro-cement feature wall in living area',
        ],
      ),
    ],
    packages: [
      InteriorPackage(
        id: 'pkg-3',
        title: 'Design-Only Architectural Consultation',
        price: '₹45,000',
        estimatedDuration: '10 Days',
        tag: 'DESIGN ONLY',
        inclusions: [
          'Full 2D layout & 3D photorealistic walkthroughs',
          'Electrical, plumbing, and false ceiling CAD blueprints',
          'Material & vendor sourcing shopping list with discounts',
          '3 On-site contractor supervision visits',
        ],
      ),
      InteriorPackage(
        id: 'pkg-4',
        title: 'Bespoke Living & Balcony Transformation',
        price: '₹1.85 Lakhs',
        estimatedDuration: '18 Days',
        tag: 'ECO LUXE',
        inclusions: [
          'Custom 3-seater sofa + accent lounge chair',
          'Weatherproof balcony deck flooring & planters',
          'Curated wall art, lighting & indoor greenery package',
        ],
      ),
    ],
    reviews: [
      VendorReview(
        residentName: 'Siddharth V.',
        flatNumber: 'Flat C-302',
        rating: 5.0,
        comment:
            'Elena is phenomenal! As a freelancer, she gave us 1-on-1 personal attention. Saved us over ₹1.5L in material costs.',
        date: '3 weeks ago',
      ),
    ],
  ),
  const InteriorVendor(
    id: 'vendor-3',
    name: 'CraftSpace Modular Systems',
    tagline: 'Direct-From-Factory Modular Kitchens & Wardrobes at Wholesale Prices',
    type: VendorType.contractor,
    rating: 4.7,
    reviewsCount: 44,
    completedProjectsCount: 88,
    startingPrice: '₹1.15 Lakhs',
    experience: '12+ Years Experience',
    phone: '+91 99002 44119',
    email: 'orders@craftspace.in',
    address: 'Bommasandra Industrial Area, Bangalore',
    isVerified: true,
    specialties: [
      'Factory Direct Modular Kitchens',
      'BWR Waterproof Plywood Cabinets',
      'Hettich / Blum German Fittings',
      'Express 15-Day Delivery',
    ],
    projects: [
      PortfolioProject(
        id: 'proj-4',
        title: 'High-Gloss Acrylic Modular Kitchen & Bar',
        flatType: '3BHK • Tower 1, Flat 501',
        budget: '₹1.65 Lakhs',
        style: 'High Gloss Minimalist',
        duration: '14 Days',
        description:
            'German soft-close hinges, quartz countertop, pull-out tall pantry organizer, and hidden cutlery trays.',
        imageUrls: [],
        highlights: [
          'ISO-certified BWR grade marine plywood',
          '15-Year structural warranty certificate',
          'Seamless stainless steel profile handles',
        ],
      ),
    ],
    packages: [
      InteriorPackage(
        id: 'pkg-5',
        title: 'Straight / L-Shape Modular Kitchen',
        price: '₹1.19 Lakhs',
        estimatedDuration: '14 Days',
        tag: 'FACTORY DIRECT',
        inclusions: [
          'Marine plywood carcass with anti-termite treatment',
          '6 Soft-close wire basket tandem units',
          'Overhead wall cabinets with frosted glass lift-ups',
          'Free installation & sink cutout',
        ],
      ),
    ],
    reviews: [
      VendorReview(
        residentName: 'Deepak Sharma',
        flatNumber: 'Flat D-104',
        rating: 4.7,
        comment:
            'Got our modular kitchen in exactly 14 days directly from their factory. Excellent value for money compared to retail showrooms.',
        date: 'Last month',
      ),
    ],
  ),
];
