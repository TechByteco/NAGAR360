import { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    brandName: 'Nagar360',
    primaryTagline: 'Namma Nagar, Namma Poruppu',
    secondaryTagline: 'See It. Report It. Improve It.',
    heroHeadline: 'Turn civic problems into civic action.',
    heroSubtext: 'AI-powered civic complaint reporting and community action platform for Indian cities. Connect directly with municipal departments in real time.',
    reportIssue: 'Report an Issue',
    exploreNearby: 'Explore Nearby Issues',
    trackComplaint: 'Track Complaint',
    cityChennai: 'Chennai, Tamil Nadu',
    demoModeNotice: 'Demo Mode Active — Full Functionality Enabled',

    // Nav
    navHome: 'Home',
    navFeed: 'Civic Feed',
    navNearMe: 'Near Me',
    navMap: 'Interactive Map',
    navTrack: 'Track Status',
    navEvents: 'Civic Events',
    navDepartments: 'Departments',
    navAbout: 'About Us',
    navHelp: 'Help & FAQs',
    navProfile: 'My Impact',
    navAdmin: 'Authority Dashboard',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    demoCitizenLogin: 'Demo Citizen Login',
    demoOfficialLogin: 'Demo Official Login',

    // Stats
    statReported: 'Total Issues Reported',
    statResolved: 'Resolved & Fixed',
    statActiveCitizens: 'Active Citizens',
    statAvgDays: 'Avg Resolution Days',

    // Categories
    catPothole: 'Pothole',
    catBrokenRoad: 'Broken Road',
    catOpenManhole: 'Open Manhole',
    catStreetlight: 'Broken Streetlight',
    catGarbage: 'Garbage Accumulation',
    catDrainage: 'Blocked Drainage',
    catWaterLeak: 'Water Leakage',
    catFloodedRoad: 'Flooded Road',
    catFootpath: 'Damaged Footpath',
    catFallenTree: 'Fallen Tree',
    catTrafficSignal: 'Traffic Signal Issue',

    // Actions
    support: 'Support Issue',
    supported: 'Supported',
    addComment: 'Add Local Comment',
    share: 'Share Issue',
    viewDetails: 'View Details',
    submitReport: 'Submit Complaint',
    aiAnalysisHeading: 'AI-Powered Smart Categorization',

    // Disclaimer
    emergencyDisclaimer: 'Nagar360 is not an emergency service. For immediate danger, contact official helpline (112 / 100).',
    aiDisclaimer: 'AI-generated suggestion — verify details before submitting.',

    // Workflow
    step1Title: '1. Snap Photo',
    step1Desc: 'Take a picture of the civic problem on your phone.',
    step2Title: '2. AI Inspection',
    step2Desc: 'Instant AI auto-detects category, severity, and suggested ward department.',
    step3Title: '3. Community Support',
    step3Desc: 'Neighbors upvote & verify priority in your locality.',
    step4Title: '4. Direct Action',
    step4Desc: 'Municipal authorities inspect, resolve, and upload evidence.',

    // Statuses
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusAssigned: 'Assigned',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusRejected: 'Rejected',
    statusDuplicate: 'Duplicate',
  },
  ta: {
    brandName: 'நகர்360',
    primaryTagline: 'நம்ம நகர், நம்ம பொறுப்பு',
    secondaryTagline: 'பாருங்கள். தெரிவியுங்கள். சீரமையுங்கள்.',
    heroHeadline: 'நகர்ப்புறப் பிரச்சினைகளை சமூக நடவடிக்கையாக மாற்றுங்கள்.',
    heroSubtext: 'இந்திய நகரங்களுக்கான AI-ஆல் இயங்கும் குடிமக்கள் புகார் தளம். மாநகராட்சித் துறைகளுடன் நேரடியாக இணையுங்கள்.',
    reportIssue: 'பிரச்சினையைப் புகாரளிக்கவும்',
    exploreNearby: 'அருகிலுள்ள புகார்களைக் காண்க',
    trackComplaint: 'புகார் நிலையை அறிய',
    cityChennai: 'சென்னை, தமிழ்நாடு',
    demoModeNotice: 'டெமோ பயன்முறை செயலில் உள்ளது',

    // Nav
    navHome: 'முகப்பு',
    navFeed: 'சமூகப் புகார்கள்',
    navNearMe: 'என் அருகில்',
    navMap: 'வரைபடம்',
    navTrack: 'புகார் கண்காணிப்பு',
    navEvents: 'சமூக நிகழ்வுகள்',
    navDepartments: 'துறைகள்',
    navAbout: 'எங்களைப் பற்றி',
    navHelp: 'உதவி',
    navProfile: 'என் பங்களிப்பு',
    navAdmin: 'அதிகாரிகள் தளம்',
    signIn: 'உள்நுழை',
    signOut: 'வெளியேறு',
    demoCitizenLogin: 'மாதிரி குடிமகன் உள்நுழைவு',
    demoOfficialLogin: 'மாதிரி அதிகாரி உள்நுழைவு',

    // Stats
    statReported: 'மொத்தப் புகார்கள்',
    statResolved: 'சீர்செய்யப்பட்டவை',
    statActiveCitizens: 'செயலில் உள்ள குடிமக்கள்',
    statAvgDays: 'சராசரி தீர்வு நாட்கள்',

    // Categories
    catPothole: 'சாலைப் பள்ளம்',
    catBrokenRoad: 'பழுதடைந்த சாலை',
    catOpenManhole: 'திறந்த மேன்ஹோல்',
    catStreetlight: 'எரியாத தெருவிளக்கு',
    catGarbage: 'குப்பை தேக்கம்',
    catDrainage: 'அடைபட்ட கழிவுநீர் கால்வாய்',
    catWaterLeak: 'குடிநீர் கசிவு',
    catFloodedRoad: 'வெள்ளப்பெருக்கு',
    catFootpath: 'பழுதடைந்த நடைபாதை',
    catFallenTree: 'விழுந்த மரம்',
    catTrafficSignal: 'போக்குவரத்து சிக்னல் பழுது',

    // Actions
    support: 'ஆதரவு அளிக்கவும்',
    supported: 'ஆதரிக்கப்பட்டது',
    addComment: 'கருத்து பதிவிடுங்கள்',
    share: 'பகிர்க',
    viewDetails: 'விவரங்கள் காண்க',
    submitReport: 'புகாரை அனுப்புக',
    aiAnalysisHeading: 'AI தானியங்கி வகைப்பாடு',

    // Disclaimer
    emergencyDisclaimer: 'நகர்360 அவசர உதவிச் சேவை அல்ல. அவசர நிலைக்கு 112 / 100 ஐத் தொடர்பு கொள்ளவும்.',
    aiDisclaimer: 'AI பரிந்துரை — சமர்ப்பிக்கும் முன் சரிபார்க்கவும்.',

    // Workflow
    step1Title: '1. படம் எடுக்கவும்',
    step1Desc: 'பிரச்சினையைப் படம் பிடியுங்கள்.',
    step2Title: '2. AI பகுப்பாய்வு',
    step2Desc: 'வகை மற்றும் அவசரநிலையை AI கண்டறியும்.',
    step3Title: '3. மக்கள் ஆதரவு',
    step3Desc: 'அருகிலுள்ள மக்கள் ஆதரவு தெரிவிப்பார்கள்.',
    step4Title: '4. அரசு நடவடிக்கை',
    step4Desc: 'மாநகராட்சி அதிகாரிகள் சீரமைத்து சான்று பதிவேற்றுவர்.',

    // Statuses
    statusSubmitted: 'சமர்ப்பிக்கப்பட்டது',
    statusUnderReview: 'பரிசீலனையில்',
    statusAssigned: 'ஒதுக்கப்பட்டது',
    statusInProgress: 'செயல்பாட்டில்',
    statusResolved: 'சீர்செய்யப்பட்டது',
    statusRejected: 'நிராகரிக்கப்பட்டது',
    statusDuplicate: 'போலி புகார்',
  },
  hi: {
    brandName: 'नगर360',
    primaryTagline: 'मेरा शहर, मेरी जिम्मेदारी',
    secondaryTagline: 'देखो। रिपोर्ट करो। सुधारो।',
    heroHeadline: 'नागरिक समस्याओं को सामुदायिक कार्रवाई में बदलें।',
    heroSubtext: 'भारतीय शहरों के लिए AI-संचालित नागरिक शिकायत मंच। नगर निगम विभागों से सीधे जुड़ें।',
    reportIssue: 'समस्या दर्ज करें',
    exploreNearby: 'आस-पास की शिकायतें देखें',
    trackComplaint: 'स्थिति जांचें',
    cityChennai: 'चेन्नई, तमिलनाडु',
    demoModeNotice: 'डेमो मोड सक्रिय है',

    // Nav
    navHome: 'होम',
    navFeed: 'नागरिक फीड',
    navNearMe: 'मेरे पास',
    navMap: 'मानचित्र',
    navTrack: 'शिकायत ट्रैकिंग',
    navEvents: 'नागरिक कार्यक्रम',
    navDepartments: 'विभाग',
    navAbout: 'हमारे बारे में',
    navHelp: 'सहायता',
    navProfile: 'मेरा प्रभाव',
    navAdmin: 'अधिकारी डैशबोर्ड',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    demoCitizenLogin: 'डेमो नागरिक लॉगिन',
    demoOfficialLogin: 'डेमो अधिकारी लॉगिन',

    // Stats
    statReported: 'कुल दर्ज शिकायतें',
    statResolved: 'हल की गई समस्याएं',
    statActiveCitizens: 'सक्रिय नागरिक',
    statAvgDays: 'औसत समाधान दिन',

    // Categories
    catPothole: 'सड़क का गड्ढा',
    catBrokenRoad: 'टूटी सड़क',
    catOpenManhole: 'खुला मैनहोल',
    catStreetlight: 'खराब स्ट्रीटलाइट',
    catGarbage: 'कचरा जमाव',
    catDrainage: 'बंद नाला',
    catWaterLeak: 'पानी का रिसाव',
    catFloodedRoad: 'जलभराव वाली सड़क',
    catFootpath: 'टूटा फुटपाथ',
    catFallenTree: 'गिरा हुआ पेड़',
    catTrafficSignal: 'ट्रैफिक सिग्नल खराबी',

    // Actions
    support: 'समर्थन दें',
    supported: 'समर्थन दिया गया',
    addComment: 'टिप्पणी जोड़ें',
    share: 'शेयर करें',
    viewDetails: 'विवरण देखें',
    submitReport: 'शिकायत भेजें',
    aiAnalysisHeading: 'AI-संचालित स्मार्ट वर्गीकरण',

    // Disclaimer
    emergencyDisclaimer: 'नगर360 आपातकालीन सेवा नहीं है। आपात स्थिति के लिए 112 / 100 पर संपर्क करें।',
    aiDisclaimer: 'AI-जनरेटेड सुझाव — सबमिट करने से पहले जांच लें।',

    // Workflow
    step1Title: '1. फोटो खींचें',
    step1Desc: 'समस्या की फोटो लें।',
    step2Title: '2. AI निरीक्षण',
    step2Desc: 'AI श्रेणी और गंभीरता की जांच करता है।',
    step3Title: '3. जन समर्थन',
    step3Desc: 'पड़ोसी समर्थन देकर प्राथमिकता बढ़ाते हैं।',
    step4Title: '4. त्वरित समाधान',
    step4Desc: 'अधिकारी कार्रवाई करते हैं और प्रमाण अपलोड करते हैं।',

    // Statuses
    statusSubmitted: 'दर्ज',
    statusUnderReview: 'समीक्षा में',
    statusAssigned: 'आवंटित',
    statusInProgress: 'प्रगति में',
    statusResolved: 'हल हो गया',
    statusRejected: 'अस्वीकृत',
    statusDuplicate: 'डुप्लिकेट',
  },
};

export function getTranslation(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}
