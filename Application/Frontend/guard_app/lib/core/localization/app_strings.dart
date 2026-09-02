import 'app_language.dart';

class AppStrings {
  final AppLanguage language;
  const AppStrings(this.language);

  static const Map<String, Map<String, String>> _translations = {
    // Top Bar & App Header
    'app_title': {
      'en': 'GateLink Guard',
      'hi': 'गेटलिंक गार्ड',
      'te': 'గేట్‌లింక్ గార్డ్',
    },
    'on_duty': {
      'en': 'ON DUTY',
      'hi': 'ड्यूटी पर',
      'te': 'డ్యూటీలో ఉన్నారు',
    },
    'gate_terminal': {
      'en': 'Gate Terminal',
      'hi': 'गेट टर्मिनल',
      'te': 'గేట్ టెర్మినల్',
    },
    'sos_button': {
      'en': 'SOS ALERT',
      'hi': 'इमरजेंसी SOS',
      'te': 'అత్యవసర SOS',
    },

    // Stat Cards
    'inside_now': {
      'en': 'Inside Society',
      'hi': 'अंदर है',
      'te': 'లోపల ఉన్నారు',
    },
    'inside_trend': {
      'en': 'Currently in society',
      'hi': 'सोसायटी में मौजूद',
      'te': 'సొసైటీలో ఉన్నారు',
    },
    'awaiting': {
      'en': 'Waiting',
      'hi': 'रुका हुआ है',
      'te': 'వేచి ఉంది',
    },
    'awaiting_trend': {
      'en': 'Needs flat approval',
      'hi': 'मंजूरी चाहिए',
      'te': 'అనుమతి కావాలి',
    },
    'approved': {
      'en': 'Approved',
      'hi': 'मंजूर',
      'te': 'అనుమతించబడింది',
    },
    'approved_trend': {
      'en': 'Ready to enter',
      'hi': 'अंदर आने दो',
      'te': 'లోపలికి రానివ్వండి',
    },
    'deliveries_today': {
      'en': 'Deliveries',
      'hi': 'डिलीवरी / पार्सल',
      'te': 'డెలివరీలు',
    },
    'deliveries_trend': {
      'en': 'Swiggy / Zomato / Zepto',
      'hi': 'खाना / सामान डिलीवरी',
      'te': 'స్విగ్గీ / జొమాటో',
    },
    'exited': {
      'en': 'Exited',
      'hi': 'बाहर गए',
      'te': 'బయటకు వెళ్లారు',
    },
    'exited_trend': {
      'en': 'Checked out',
      'hi': 'गेट से निकले',
      'te': 'గేట్ నుండి నిష్క్రమించారు',
    },

    // 1-Tap Fast Actions
    'fast_gate_actions': {
      'en': 'Fast Gate Actions',
      'hi': 'तुरंत गेट एंट्री',
      'te': 'త్వరిత గేట్ చర్యలు',
    },
    'one_tap_triggers': {
      'en': '1-Tap actions',
      'hi': '1-टैप बटन',
      'te': '1-ట్యాప్ చర్యలు',
    },
    'action_delivery': {
      'en': 'Delivery',
      'hi': 'डिलीवरी',
      'te': 'డెలివరీ',
    },
    'action_delivery_sub': {
      'en': 'Food / Parcel',
      'hi': 'खाना / पार्सल',
      'te': 'ఆహారం / పార్శిల్',
    },
    'action_guest': {
      'en': 'New Guest',
      'hi': 'नया मेहमान',
      'te': 'కొత్త అతిథి',
    },
    'action_guest_sub': {
      'en': 'Walk-In Entry',
      'hi': 'सीधी एंट्री',
      'te': 'వాక్-ఇన్ ఎంట్రీ',
    },
    'action_cab': {
      'en': 'Cab / Auto',
      'hi': 'कैब / गाड़ी',
      'te': 'క్యాబ్ / ఆటో',
    },
    'action_cab_sub': {
      'en': 'Uber / Ola',
      'hi': 'ऊबर / ओला',
      'te': 'ఉబెర్ / ఓలా',
    },
    'action_sos': {
      'en': 'Alert / SOS',
      'hi': 'इमरजेंसी / मदद',
      'te': 'అలర్ట్ / ఎమర్జెన్సీ',
    },
    'action_sos_sub': {
      'en': 'Police / Help',
      'hi': 'पुलिस / मदद',
      'te': 'పోలీస్ / సహాయం',
    },

    // Search & Filter
    'search_hint': {
      'en': 'Search flat no (e.g. 402), name or vehicle...',
      'hi': 'फ़्लैट नंबर (उदा. 402), नाम या गाड़ी नंबर लिखें...',
      'te': 'ఫ్లాట్ నం (ఉదా. 402), పేరు లేదా వాహనం వెతకండి...',
    },
    'filter_all': {
      'en': 'All',
      'hi': 'सब',
      'te': 'అన్నీ',
    },
    'filter_inside': {
      'en': 'Inside',
      'hi': 'अंदर',
      'te': 'లోపల',
    },
    'filter_pending': {
      'en': 'Waiting',
      'hi': 'रुका हुआ',
      'te': 'వేచి ఉంది',
    },
    'filter_approved': {
      'en': 'Approved',
      'hi': 'मंजूर',
      'te': 'మంజూరు',
    },
    'filter_delivery': {
      'en': 'Delivery',
      'hi': 'डिलीवरी',
      'te': 'డెలివరీ',
    },
    'filter_cab': {
      'en': 'Cab / Auto',
      'hi': 'कैब / ऑटो',
      'te': 'క్యాబ్ / ఆటో',
    },
    'filter_exited': {
      'en': 'Exited',
      'hi': 'बाहर गए',
      'te': 'బయటకు వెళ్లారు',
    },

    // Gate Entry Card Actions
    'call_resident': {
      'en': 'Call Flat',
      'hi': 'कॉल करें',
      'te': 'కాల్ చేయండి',
    },
    'mark_exit': {
      'en': 'Mark Exit',
      'hi': 'बाहर गया (Exit)',
      'te': 'నిష్క్రమణ (Exit)',
    },
    'allow_entry': {
      'en': 'Allow Entry',
      'hi': 'अंदर आने दो (Allow)',
      'te': 'రానివ్వండి (Allow)',
    },
    'check_in': {
      'en': 'Check In',
      'hi': 'गेट एंट्री दें (Check In)',
      'te': 'ప్రవేశం (Check In)',
    },
    'overstay_warning': {
      'en': 'Overstaying inside (>4h)',
      'hi': '4 घंटे से ज्यादा अंदर है (Overstay)',
      'te': '4 గంటలకు పైగా లోపల ఉన్నారు',
    },

    // Bottom Navigation
    'nav_gate': {
      'en': 'Gate Log',
      'hi': 'गेट लॉग',
      'te': 'గేట్ లాగ్',
    },
    'nav_qr_scan': {
      'en': 'QR Scan',
      'hi': 'क्यूआर स्कैन',
      'te': 'QR స్కాన్',
    },
    'nav_quick_entry': {
      'en': 'New Entry',
      'hi': 'नई एंट्री',
      'te': 'కొత్త ఎంట్రీ',
    },
    'nav_vehicles': {
      'en': 'Vehicles',
      'hi': 'गाड़ियां',
      'te': 'వాహనాలు',
    },
    'nav_profile': {
      'en': 'Profile',
      'hi': 'प्रोफाइल',
      'te': 'ప్రొఫైల్',
    },

    // Quick Entry Form
    'fast_gate_entry': {
      'en': 'Fast Gate Entry',
      'hi': 'त्वरित गेट एंट्री',
      'te': 'త్వరిత గేట్ ప్రవేశం',
    },
    'visitor_name': {
      'en': 'Visitor Name',
      'hi': 'आगंतुक का नाम',
      'te': 'సందర్శకుడి పేరు',
    },
    'mobile_number': {
      'en': 'Mobile Number',
      'hi': 'मोबाइल नंबर',
      'te': 'మొబైల్ నంబర్',
    },
    'block_tower': {
      'en': 'Block / Tower',
      'hi': 'ब्लॉक / टॉवर',
      'te': 'బ్లాక్ / టవర్',
    },
    'flat_number': {
      'en': 'Flat Number',
      'hi': 'फ़्लैट नंबर',
      'te': 'ఫ్లాట్ నంబర్',
    },
    'vehicle_number': {
      'en': 'Vehicle Number',
      'hi': 'गाड़ी नंबर',
      'te': 'వాహనం నంబర్',
    },
    'company_name': {
      'en': 'Company (e.g. Swiggy)',
      'hi': 'कंपनी (उदा. स्विगी)',
      'te': 'కంపెనీ (ఉదా. స్విగ్గీ)',
    },
    'submit_entry': {
      'en': 'Submit & Notify Resident',
      'hi': 'एंट्री भेजें और सूचित करें',
      'te': 'సమర్పించి నివాసికి తెలపండి',
    },

    // Domestic Staff / Helper Scan Modal
    'verified_pass': {
      'en': 'VERIFIED PERMANENT PASS',
      'hi': 'सत्यापित स्थायी पास',
      'te': 'ధృవీకరించబడిన పాస్',
    },
    'authorized_flat': {
      'en': 'Authorized Flat:',
      'hi': 'मान्य फ़्लैट:',
      'te': 'అనుమతించబడిన ఫ్లాట్:',
    },
    'confirm_check_in': {
      'en': 'Confirm Check-In',
      'hi': 'अंदर आया (Check-In)',
      'te': 'ప్రవేశం నిర్ధారించండి',
    },
    'confirm_check_out': {
      'en': 'Confirm Check-Out',
      'hi': 'बाहर गया (Check-Out)',
      'te': 'నిష్క్రమణ నిర్ధారించండి',
    },
    'language_select_title': {
      'en': 'Select Language',
      'hi': 'भाषा चुनें',
      'te': 'భాషను ఎంచుకోండి',
    },
  };

  String get(String key) {
    final entry = _translations[key];
    if (entry == null) return key;
    return entry[language.code] ?? entry['en'] ?? key;
  }
}
