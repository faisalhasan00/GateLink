export const BAZAAR_CATEGORIES = [
  {
    id: 'all',
    name: 'All Items',
    icon: '🛒',
    tagline: 'All Society Essentials'
  },
  {
    id: 'milk-dairy',
    name: 'Fresh Milk & Dairy',
    icon: '🥛',
    tagline: 'Farm Pure & Delivered Cold'
  },
  {
    id: 'eggs',
    name: 'Farm Fresh Eggs',
    icon: '🥚',
    tagline: 'Free-Range & Country Eggs'
  },
  {
    id: 'vegetables',
    name: 'Farm Veggies',
    icon: '🥦',
    tagline: 'Harvested Today'
  },
  {
    id: 'honey-ghee',
    name: 'Raw Honey & Ghee',
    icon: '🍯',
    tagline: '100% Pure & Vedic'
  },
  {
    id: 'achar',
    name: "Dadi's Achar (Pickle)",
    icon: '🌶️',
    tagline: 'Homestyle Sun-Cured'
  },
  {
    id: 'papad',
    name: 'Handmade Papad',
    icon: '🍘',
    tagline: 'Sun-Dried Artisanal'
  },
  {
    id: 'daily-pass',
    name: 'Daily Society Pass',
    icon: '🎟️',
    tagline: 'Custom Daily Basket'
  }
];

export const BAZAAR_PRODUCTS = [
  // --- 1. MILK & DAIRY ---
  {
    id: 'milk-01',
    name: 'A2 Gir Cow Fresh Raw Milk',
    category: 'milk-dairy',
    unit: '1 Litre Pouch',
    price: 88,
    mrp: 98,
    discount: '10% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.9,
    ratingCount: 1420,
    source: 'Vedic Meadows Dairy Farm, Shamshabad',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    description: 'Unprocessed, chilled whole A2 milk from grass-fed indigenous Gir cows. Tested for zero adulteration, synthetic hormones, or chemical preservatives. Delivered fresh in cold-chain pouches before 9 AM.',
    highlights: [
      '100% pure A2 beta-casein protein for easy gut digestion',
      'Free from oxytocin, antibiotics, and synthetic growth hormones',
      'Milked at 3:30 AM & delivered chilled to your doorstep before 9:00 AM',
      'Naturally rich cream content with 4.5%+ healthy milk fat'
    ],
    shelfLife: '48 hours from delivery (Must be boiled & refrigerated)',
    storage: 'Store refrigerated at 2°C - 4°C. Boil within 2 hours of morning doorstep delivery.',
    ingredients: '100% Pure Raw Indigenous Gir Cow Whole Milk',
    benefits: [
      'Gentle on the stomach and ideal for lactose-sensitive family members',
      'Abundant in calcium, phosphorus, Vitamin D3 and essential minerals',
      'Enhances natural immunity and supports children bone development'
    ],
    inStock: true,
    isBestseller: true
  },
  {
    id: 'milk-02',
    name: 'Farm Fresh Pure Buffalo Milk',
    category: 'milk-dairy',
    unit: '1 Litre Pouch',
    price: 82,
    mrp: 90,
    discount: '9% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.8,
    ratingCount: 980,
    source: 'Sangareddy Farm Collective',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
    description: 'Thick, creamy 7.5% fat rich buffalo milk sourced directly from healthy Murrah buffaloes. Ideal for rich morning chai, thick set homemade curd, and traditional Indian sweets.',
    highlights: [
      'High natural fat (7.5%+) yielding thick malai layer',
      'Perfect for thick aromatic chai, creamy filter coffee, and dense dahi',
      'Direct farm chilled collection without skimming or chemical milk powder'
    ],
    shelfLife: '48 hours from delivery',
    storage: 'Refrigerate immediately at 4°C. Boil thoroughly before consumption.',
    ingredients: '100% Pure Fresh Whole Murrah Buffalo Milk',
    benefits: [
      'High calorie & protein density for active gym-goers and growing kids',
      'Higher calcium and magnesium levels than regular commercial packets'
    ],
    inStock: true
  },
  {
    id: 'dairy-03',
    name: 'Artisanal Fresh Malai Paneer',
    category: 'milk-dairy',
    unit: '200 g Block',
    price: 110,
    mrp: 125,
    discount: '12% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.9,
    ratingCount: 1150,
    source: 'GauKripa Dairy, Hyderabad',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    description: 'Melt-in-mouth artisanal cottage cheese made from fresh whole cow milk curdled with natural lemon extract. Zero cornstarch, vegetable fats, or preservatives added.',
    highlights: [
      'Extremely soft texture that absorbs curries and marinades effortlessly',
      'Zero synthetic coagulants or starch fillers',
      'Crafted fresh every evening for next morning morning delivery'
    ],
    shelfLife: '4 days in vacuum-sealed chilled pack',
    storage: 'Keep immersed in cold water in an airtight container inside the refrigerator.',
    ingredients: 'Pure Cow Milk, Natural Lemon Extract Coagulant, Purified Water',
    benefits: [
      'High bioavailability vegetarian protein (approx 18g per 100g)',
      'Rich in healthy fats and conjugated linoleic acid (CLA)'
    ],
    inStock: true,
    isBestseller: true
  },
  {
    id: 'dairy-04',
    name: 'Thick Farm Set Curd (Dahi)',
    category: 'milk-dairy',
    unit: '400 g Clay Tub',
    price: 45,
    mrp: 50,
    discount: '10% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.7,
    ratingCount: 840,
    source: 'Vedic Meadows Dairy Farm',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally cultured probiotic thick curd prepared using whole farm milk with authentic clay-pot homestyle consistency. Pleasantly mild and not overly sour.',
    highlights: [
      'Live active probiotic cultures for optimal gut microbiome balance',
      'No added gelatin, stabilizers, or artificial thickeners',
      'Naturally set without mechanical homogenization'
    ],
    shelfLife: '5 days from delivery date',
    storage: 'Store refrigerated at 2°C - 5°C. Consume within 3 days after opening.',
    ingredients: 'Pasteurized Whole Milk, Active Lactic Starter Cultures',
    benefits: [
      'Soothes acidity and promotes digestive wellness',
      'Natural source of Vitamin B12 and probiotic gut bacteria'
    ],
    inStock: true
  },
  {
    id: 'dairy-05',
    name: 'Pure Desi Cow Bilona Cultured Ghee',
    category: 'milk-dairy',
    unit: '500 ml Glass Jar',
    price: 799,
    mrp: 950,
    discount: '16% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.9,
    ratingCount: 2100,
    source: 'Surabhi Vedic Gaushala',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional wood-churned Bilona method ghee prepared from curd (makkhan) of grass-fed indigenous Gir cows. Features a rich golden hue, granular (danedar) texture, and intoxicating aroma.',
    highlights: [
      'Prepared strictly via the 5-step ancient Vedic Bilona method',
      'Golden granular texture with rich nutty fragrance',
      'Zero chemicals, zero palm oil mixing, packed in sanitized glass jars'
    ],
    shelfLife: '12 months from manufacturing',
    storage: 'Store in a cool, dry place. Always use a dry spoon. No refrigeration needed.',
    ingredients: '100% Cultured Butter Clarified Fat from A2 Cow Milk',
    benefits: [
      'High smoke point ideal for Ayurvedic cooking, tadka & rotis',
      'Rich in butyric acid, Vitamin A, E, and Omega-3 fatty acids'
    ],
    inStock: true,
    isBestseller: true
  },

  // --- 2. FARM FRESH EGGS ---
  {
    id: 'egg-01',
    name: 'Free-Range Desi Country Eggs',
    category: 'eggs',
    unit: 'Pack of 6',
    price: 95,
    mrp: 115,
    discount: '17% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.9,
    ratingCount: 1650,
    source: 'Shamshabad Open Pasture Farm',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic free-range country eggs laid by heritage Indian breeds roaming open grass pastures. Features a deep orange-golden yolk and firm albumen.',
    highlights: [
      'Hens forage on natural seeds, greens, and sunshine in cage-free pastures',
      'Deep golden yolk packed with natural carotenoids and lutein',
      'Zero antibiotic growth promoters or synthetic egg-dye feeds'
    ],
    shelfLife: '21 days in cool room temperature or 30 days refrigerated',
    storage: 'Store in egg tray inside refrigerator with pointed end downwards.',
    ingredients: '100% Fresh Free-Range Pasture Country Eggs',
    benefits: [
      'Significantly higher Vitamin A, E and natural Omega-3 than cage eggs',
      'High-grade complete biological protein for breakfast nutrition'
    ],
    inStock: true,
    isBestseller: true
  },
  {
    id: 'egg-02',
    name: 'Organic Brown Farm Eggs (Omega-3 Rich)',
    category: 'eggs',
    unit: 'Pack of 10',
    price: 135,
    mrp: 160,
    discount: '16% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.8,
    ratingCount: 1220,
    source: 'BioFlora Pastures',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
    description: 'Flaxseed-fed hens yielding high Omega-3 and Vitamin D fortified brown farm fresh eggs. Cleaned, graded, and UV sanitized for safety.',
    highlights: [
      'Fortified naturally through organic flaxseed & herbal poultry diet',
      'UV sanitized and candling tested for blood spot prevention',
      'High yolk-to-white ratio with robust shell integrity'
    ],
    shelfLife: '25 days from delivery date',
    storage: 'Refrigerate upon delivery for maximum freshness and texture retention.',
    ingredients: 'Organic Brown Farm Eggs',
    benefits: [
      'Supports cardiovascular wellness with elevated Omega-3 fatty acids',
      '6.5g clean protein per egg with essential amino acid profile'
    ],
    inStock: true
  },
  {
    id: 'egg-03',
    name: 'Classic White Table Eggs',
    category: 'eggs',
    unit: 'Pack of 12',
    price: 105,
    mrp: 120,
    discount: '12% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.7,
    ratingCount: 2300,
    source: 'FreshLayer Farms',
    image: 'https://images.unsplash.com/photo-1569288052389-dac9b01c970f?auto=format&fit=crop&w=600&q=80',
    description: 'Cleaned, sanitized and graded daily farm fresh white eggs. A wholesome protein-rich breakfast staple for daily society cooking.',
    highlights: [
      'Graded for uniform size and pristine shell hygiene',
      'Delivered within 24 hours of farm collection',
      'Zero fishmeal or artificial hormones in flock feed'
    ],
    shelfLife: '21 days refrigerated',
    storage: 'Keep in refrigerator at 4°C.',
    ingredients: 'Fresh White Table Eggs',
    benefits: [
      'Reliable daily source of choline for cognitive health and protein'
    ],
    inStock: true
  },

  // --- 3. FARM VEGGIES ---
  {
    id: 'veg-01',
    name: 'Farm Fresh Desi Tomatoes',
    category: 'vegetables',
    unit: '1 kg',
    price: 38,
    mrp: 48,
    discount: '21% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.8,
    ratingCount: 3100,
    source: 'Medak Organic Farmers Cluster',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'Juicy, tangy vine-ripened desi tomatoes harvested fresh at sunrise for morning delivery. Naturally ripened without carbide, wax, or artificial color chemicals.',
    highlights: [
      'Harvested at 4 AM from local open-field farm patches',
      'Authentic sour-sweet desi flavor essential for rasam, curries & chutneys',
      'Zero chemical waxing or ethylene chamber forcing'
    ],
    shelfLife: '5-7 days at room temperature or refrigerator',
    storage: 'Store stems facing up in a cool airy basket; refrigerate once fully ripe.',
    ingredients: '100% Fresh Farm Desi Tomatoes',
    benefits: [
      'Rich in Lycopene antioxidant and Vitamin C for glowing skin',
      'Low calorie and hydrating vegetable staple'
    ],
    inStock: true,
    isBestseller: true
  },
  {
    id: 'veg-02',
    name: 'Fresh Hydroponic Spinach (Palak)',
    category: 'vegetables',
    unit: '250 g Bunch',
    price: 28,
    mrp: 35,
    discount: '20% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.9,
    ratingCount: 890,
    source: 'UrbanAgri Hydro Farms',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp, pesticide-residue-free tender baby spinach leaves grown in clean nutrient water. Pre-washed with ozonized water so you can cook immediately without muddy grit.',
    highlights: [
      'Soil-free hydroponic cultivation with 0 pesticide contamination',
      'Ozone washed and roots trimmed for instant cooking convenience',
      'Crunchy texture with vibrant deep emerald chlorophyll'
    ],
    shelfLife: '4-5 days refrigerated',
    storage: 'Keep in crisper drawer sealed in breathable container.',
    ingredients: 'Hydroponic Tender Green Spinach Leaves',
    benefits: [
      'Exceptional source of iron, folic acid, and dietary fiber',
      'Supports healthy blood hemoglobin levels'
    ],
    inStock: true
  },
  {
    id: 'veg-03',
    name: 'Fresh Coriander & Mint (Combo Bunch)',
    category: 'vegetables',
    unit: '200 g Combo',
    price: 22,
    mrp: 30,
    discount: '27% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.7,
    ratingCount: 1800,
    source: 'GreenRoots Hyderabad',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Aromatic garden-fresh dhaniya and refreshing pudina bunch for daily society cooking, garnishing, and green chutneys.',
    highlights: [
      'Crisp fragrant leaves with root moist-wrap packaging',
      'Zero yellowing or wilted stalks',
      'Harvested fresh in the morning'
    ],
    shelfLife: '5 days refrigerated',
    storage: 'Wrap in paper towel and store in an airtight box inside fridge.',
    ingredients: 'Fresh Green Coriander (100g) & Fresh Mint Leaves (100g)',
    benefits: [
      'Natural body coolant that stimulates digestive enzymes and appetite'
    ],
    inStock: true
  },
  {
    id: 'veg-04',
    name: 'Nashik Red Onions & Farm Potatoes',
    category: 'vegetables',
    unit: '2 kg (1kg + 1kg Combo)',
    price: 79,
    mrp: 95,
    discount: '17% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.8,
    ratingCount: 4200,
    source: 'Direct Mandi Farmer Gate',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    description: 'Pungent firm Nashik red onions and clean, dry dirt-free baking potatoes. The essential daily kitchen staple combo sorted and delivered without waste.',
    highlights: [
      'Firm dry skins with minimal moisture to prevent sprouting',
      'Standard medium-large sorting ideal for daily kitchen chopping',
      '100% net weight guaranteed'
    ],
    shelfLife: '2-3 weeks in cool ventilated basket',
    storage: 'Keep in an open airy basket away from direct sunlight. Do not refrigerate.',
    ingredients: 'Nashik Medium Red Onions (1kg) + Fresh Farm Potatoes (1kg)',
    benefits: [
      'Rich in quercetin flavonoid and potassium for daily energy'
    ],
    inStock: true
  },

  // --- 4. RAW HONEY & OILS ---
  {
    id: 'honey-01',
    name: '100% Pure Raw Wild Forest Honey',
    category: 'honey-ghee',
    unit: '500 g Glass Jar',
    price: 399,
    mrp: 499,
    discount: '20% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.9,
    ratingCount: 1870,
    source: 'Nallamala Tribal Foragers Collective',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: 'Unheated, unfiltered multi-flora raw forest honey harvested sustainably from wild beehives in the Nallamala dense forests. Retains natural bee pollen, propolis, and live enzymes.',
    highlights: [
      'Never heated above hive temperature (40°C) to protect vital enzymes',
      'Tested by NMR spectroscopy for zero corn syrup or sugar adulteration',
      'Rich dark amber color with floral medicinal notes'
    ],
    shelfLife: '24 months (Pure honey never expires if kept sealed)',
    storage: 'Store at room temperature in a dry spot. Do not refrigerate to avoid crystallization.',
    ingredients: '100% Unprocessed Wild Multi-Flora Forest Honey',
    benefits: [
      'Soothes sore throats, coughs, and supports respiratory immunity',
      'Natural prebiotic sweetener with lower glycemic impact than white sugar'
    ],
    inStock: true,
    isBestseller: true
  },
  {
    id: 'honey-02',
    name: 'Mustard Blossom Raw Honey',
    category: 'honey-ghee',
    unit: '350 g Glass Jar',
    price: 285,
    mrp: 340,
    discount: '16% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.8,
    ratingCount: 650,
    source: 'BioBee Organic Aviary, Punjab',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally crystallized, smooth creamy golden honey harvested from winter yellow mustard fields. Melts like butter on warm toast and pancakes.',
    highlights: [
      'Single-origin mono-floral harvest from blooming mustard flowers',
      'Natural creamy micro-crystalline spreadable texture',
      'Raw, unpasteurized, and free from added corn fructose'
    ],
    shelfLife: '18 months',
    storage: 'Store at room temperature in airtight glass jar.',
    ingredients: '100% Pure Mustard Blossom Honey',
    benefits: [
      'Warming properties beneficial during winter mornings and monsoon'
    ],
    inStock: true
  },
  {
    id: 'oil-01',
    name: 'Wood-Pressed Kachi Ghani Mustard Oil',
    category: 'honey-ghee',
    unit: '1 Litre Bottle',
    price: 240,
    mrp: 290,
    discount: '17% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.9,
    ratingCount: 1430,
    source: 'Gramin Kolhu Oil Mill',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional slow-extracted wooden cold-pressed mustard oil with high natural pungency (jhal) and zero chemicals. Ideal for pickles, Bengali & North Indian cooking.',
    highlights: [
      'Cold pressed below 45°C in wooden kolhu / chekku churner',
      'Natural pungency with allyl isothiocyanate preserved',
      'Unrefined, non-bleached, and non-deodorized'
    ],
    shelfLife: '12 months from milling date',
    storage: 'Keep in dark cool cupboard away from direct light.',
    ingredients: '100% Pure Black & Yellow Mustard Seed Cold-Pressed Oil',
    benefits: [
      'Balanced Omega-3 to Omega-6 ratio beneficial for heart health',
      'Natural antibacterial and antifungal properties for curing pickles'
    ],
    inStock: true
  },

  // --- 5. DADI'S HOMEMADE ACHAR ---
  {
    id: 'achar-01',
    name: "Grandma's Traditional Raw Mango Achar (Aam Ka Achar)",
    category: 'achar',
    unit: '400 g Glass Jar',
    price: 249,
    mrp: 299,
    discount: '17% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.95,
    ratingCount: 2600,
    source: "Kamla Dadi's Kitchen (Society Homemaker)",
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic North Indian style Ramkela raw mango pickle cured under the hot summer sun for 21 days with roasted methi, kalonji, saunf & cold-pressed mustard oil. Zero vinegar or chemical preservatives.',
    highlights: [
      'Prepared by verified society homemakers following 60-year-old family recipes',
      'Aged in traditional porcelain barnis under natural rooftop sun',
      'Submerged in cold-pressed mustard oil with zero sodium benzoate or vinegar'
    ],
    shelfLife: '12 months from packing',
    storage: 'Keep jar in a dry cool place. Always use a dry spoon and ensure oil covers top layer.',
    ingredients: 'Ramkela Raw Mango Chunks, Cold-Pressed Mustard Oil, Fenugreek (Methi), Nigella Seeds (Kalonji), Fennel (Saunf), Turmeric, Kashmiri Red Chilli, Rock Salt, Hing',
    benefits: [
      'Natural wild fermentation aids digestion and enhances meal palatability'
    ],
    inStock: true,
    isBestseller: true
  },
  {
    id: 'achar-02',
    name: 'Banarasi Stuffed Red Chilli Pickle (Bharwa Lal Mirch)',
    category: 'achar',
    unit: '350 g Glass Jar',
    price: 275,
    mrp: 330,
    discount: '17% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.9,
    ratingCount: 1890,
    source: 'Varanasi Heritage Pickles',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    description: 'Plump sun-dried winter red chillies hand-stuffed with 12 freshly ground spices, roasted mustard, amchur, and dipped in fragrant mustard oil.',
    highlights: [
      'Handcrafted with fleshy thick-skinned Banarasi red chillies',
      'Stuffed individually with coarse dry-roasted aromatic spice blend',
      'Bold spicy and tangy flavor profile'
    ],
    shelfLife: '12 months',
    storage: 'Store at room temperature. Ensure chillies stay submerged in oil.',
    ingredients: 'Banarasi Red Chillies, Mustard Oil, Dry Mango Powder (Amchur), Mustard Seeds, Cumin, Coriander, Ajwain, Black Salt, Sendha Namak',
    benefits: [
      'Stimulates sluggish digestion and complements parathas and dal-chawal'
    ],
    inStock: true,
    isBestseller: true
  },
  {
    id: 'achar-03',
    name: 'Spicy Sun-Cured Garlic Pickle (Lahsun Ka Achar)',
    category: 'achar',
    unit: '300 g Glass Jar',
    price: 220,
    mrp: 260,
    discount: '15% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.8,
    ratingCount: 940,
    source: "Asha Aunty's Homestyle Flavours",
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    description: 'Whole peeled desi garlic cloves steeped in pungent mustard oil, whole spices, and Kashmiri red chilli. The cloves turn tender and burst with robust savory flavor.',
    highlights: [
      'Desi small-clove high-pungency garlic used for medicinal potency',
      'Naturally softened over 30 days of sun curing',
      'Zero synthetic food color or artificial acidity regulators'
    ],
    shelfLife: '10 months',
    storage: 'Keep in cool dry pantry. Use a dry wooden or steel spoon.',
    ingredients: 'Desi Garlic Cloves, Kachi Ghani Mustard Oil, Fenugreek, Mustard Seeds, Turmeric, Lemon Juice, Spices',
    benefits: [
      'Known in Ayurveda for cardiovascular circulation and immunity benefits'
    ],
    inStock: true
  },
  {
    id: 'achar-04',
    name: 'Sweet & Tangy Sun-Dried Lemon Pickle (Khatta Meetha Nimbu)',
    category: 'achar',
    unit: '400 g Glass Jar',
    price: 210,
    mrp: 250,
    discount: '16% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.85,
    ratingCount: 1120,
    source: "Shanti Dadi's Rasoi",
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Oil-free aged juicy thin-skinned Kagzi lemons slowly fermented with rock salt, hing, carom seeds, and jaggery. The peel turns dark, sweet, and melt-in-mouth soft.',
    highlights: [
      '100% Oil-Free digestive traditional recipe',
      'Aged naturally for over 6 months to achieve black amber softness',
      'Sweetened with unrefined organic desi jaggery (gud)'
    ],
    shelfLife: '18 months (Gets tastier with age)',
    storage: 'Store at room temperature in a dry glass jar.',
    ingredients: 'Kagzi Lemons, Organic Jaggery, Rock Salt, Black Pepper, Ajwain, Roasted Cumin, Asafoetida (Hing)',
    benefits: [
      'Legendary homestyle remedy for gas, indigestion, and motion sickness'
    ],
    inStock: true
  },

  // --- 6. HANDMADE PAPADS & CRISPS ---
  {
    id: 'papad-01',
    name: 'Amritsari Punjabi Urad Masala Papad',
    category: 'papad',
    unit: '250 g Pack (Approx 16 Pcs)',
    price: 135,
    mrp: 160,
    discount: '16% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.9,
    ratingCount: 1780,
    source: 'Amritsar Traditional Papad Bazaars',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-rolled, sun-dried crispy urad dal papad loaded with coarse cracked black peppercorns (kali mirch) and pure hing. Can be roasted on direct flame or shallow fried.',
    highlights: [
      'Hand-kneaded and sun-dried on cotton sheets in Amritsar',
      'Spicy pungent crunch with authentic hing and black pepper bursts',
      'Zero maida, soda fillers, or synthetic preservatives'
    ],
    shelfLife: '6 months from packing',
    storage: 'Store in airtight tin or ziplock bag to prevent moisture softening.',
    ingredients: 'Urad Dal Flour, Coarse Black Pepper, Asafoetida (Hing), Cumin, Salt, Cottonseed Oil for rolling',
    benefits: [
      'Protein-rich dal crisps that stimulate digestive fire (Agni)'
    ],
    inStock: true,
    isBestseller: true
  },
  {
    id: 'papad-02',
    name: 'Royal Moong Dal & Heeng Papad',
    category: 'papad',
    unit: '200 g Pack',
    price: 120,
    mrp: 145,
    discount: '17% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.8,
    ratingCount: 1150,
    source: 'Bikaner Mahila Gruh Udyog',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    description: 'Light, thin and crunchy digestive papad made from washed yellow moong dal and aromatic heeng. Very mild on spice and easy on children & elder stomachs.',
    highlights: [
      'Extra thin rolled for rapid 10-second flame roasting',
      'Mellow flavor with premium aromatic Hing',
      'Crafted by women self-help cooperatives in Bikaner'
    ],
    shelfLife: '6 months',
    storage: 'Keep in dry airtight container.',
    ingredients: 'Moong Dal Flour, Urad Dal Flour, Asafoetida, Sendha Salt, Jeera',
    benefits: [
      'Light digestive side for everyday dal-chawal and khichdi'
    ],
    inStock: true
  },
  {
    id: 'papad-03',
    name: 'Crispy Sabudana & Jeera Fasting Papad',
    category: 'papad',
    unit: '200 g Pack',
    price: 110,
    mrp: 130,
    discount: '15% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.85,
    ratingCount: 890,
    source: 'Shree Balaji Gruh Udyog',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80',
    description: 'Light, melt-in-mouth pearl tapioca papads seasoned with rock salt (sendha namak) and roasted cumin seeds. Perfect for religious fasting (vrat) and evening tea snacks.',
    highlights: [
      '100% Vrat/Upwas certified with rock salt (Sendha Namak)',
      'Puffs up three times in size when fried in hot ghee or oil',
      'Sun-dried naturally without bleaching agents'
    ],
    shelfLife: '9 months',
    storage: 'Keep away from dampness in a sealed container.',
    ingredients: 'Tapioca Pearls (Sabudana), Rock Salt, Roasted Jeera, Green Chilli Flakes, Purified Water',
    benefits: [
      'Gluten-free quick energy snack for fasts and teatime'
    ],
    inStock: true
  },
  {
    id: 'papad-04',
    name: 'Handcrafted Rice Flour Fryums (Chawal Ke Phool)',
    category: 'papad',
    unit: '150 g Pack',
    price: 95,
    mrp: 115,
    discount: '17% OFF',
    deliveryTime: '🌅 5 AM - 9 AM Slot',
    rating: 4.75,
    ratingCount: 720,
    source: "Dadi's Homemade Sun-Dried Essentials",
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    description: 'Grandmother style sun-dried rice crisps that puff into airy, crispy bites upon frying. Made with aged rice flour, carom seeds, and a touch of green chilli.',
    highlights: [
      'Traditional summer rooftop sun-dried delight',
      'Airy feather-light crunch loved by children',
      'Zero artificial dyes or MSG preservatives'
    ],
    shelfLife: '12 months',
    storage: 'Store in dry airtight container.',
    ingredients: 'Aged Rice Flour, Carom Seeds (Ajwain), Salt, Green Chilli Paste, Water',
    benefits: [
      'Nostalgic homestyle snack that absorbs minimal oil when fried'
    ],
    inStock: true
  }
];

export const BAZAAR_PROMOS = [
  {
    id: 'promo-1',
    title: '🌅 Morning Slot Doorstep Delivery',
    subtitle: 'Order by 11 PM tonight • Choose your slot between 5 AM to 9 AM',
    bgGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    badge: 'DAILY FRESH',
    code: 'SOCIETYFREE'
  },
  {
    id: 'promo-2',
    title: '🥛 Fresh Gir Cow Milk & Country Eggs',
    subtitle: 'Pure A2 milk and golden yolk eggs delivered cold before morning tea',
    bgGradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    badge: 'DAILY ESSENTIALS',
    code: 'MORNINGA2'
  },
  {
    id: 'promo-3',
    title: "🌶️ Dadi's Special Achar & Papad Box",
    subtitle: 'Sun-cured pickles in kachi ghani mustard oil with 0 preservatives',
    bgGradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    badge: 'HOMEMADE ARTISANAL',
    code: 'DADI15'
  }
];
