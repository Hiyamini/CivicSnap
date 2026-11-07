import { createContext, useContext, useState } from 'react';

// Telugu / Hindi / English. Key missing aithe English chupistundi.
const D = {
  en: {
    'nav.feed': 'Feed', 'nav.dashboard': 'Dashboard', 'nav.report': 'Report issue',
    'nav.login': 'Login', 'nav.logout': 'Logout',
    'feed.title': 'Issues in your area', 'filter.allDepts': 'All departments', 'filter.allStatus': 'All statuses',
    'status.OPEN': 'Pending', 'status.IN_PROGRESS': 'In progress', 'status.RESOLVED': 'Resolved',
    'upvote': 'Support', 'upvoted': 'Supported', 'noIssues': 'No issues yet.',
    'dashboard.title': 'Department dashboard', 'dashboard.dept': 'Department', 'dashboard.total': 'Total',
    'dashboard.open': 'Pending', 'dashboard.inProgress': 'In progress', 'dashboard.resolved': 'Resolved',
    'dashboard.map': 'Issue map',
    'report.title': 'Report an issue', 'report.dept': 'Department', 'report.issueTitle': 'What is the problem?',
    'report.desc': 'Details', 'report.address': 'Address / landmark', 'report.media': 'Photo or video',
    'report.pick': 'Tap the map to mark the exact spot', 'report.gps': 'Use my GPS', 'report.submit': 'Post issue',
    'report.posting': 'Posting...', 'report.needLocation': 'Please mark the location on the map.',
    'report.dupTitle': 'Looks like this is already reported nearby',
    'report.dupHelp': 'Support the existing post instead of creating a duplicate.',
    'login.title': 'Login', 'login.registerTitle': 'Create account', 'login.name': 'Name', 'login.email': 'Email',
    'login.password': 'Password', 'login.submit': 'Login', 'login.registerSubmit': 'Sign up',
    'login.toRegister': 'New here? Create an account', 'login.toLogin': 'Have an account? Login',
    'login.demo': 'Demo logins (password: demo123): collector@civic.in, roads@civic.in, asha@example.com',
    'profile.posts': 'posts', 'profile.resolved': 'resolved', 'profile.joined': 'Joined',
    'profile.edit': 'Edit profile', 'profile.save': 'Save', 'profile.bio': 'Bio', 'profile.notFound': 'Profile not found',
    'role.CITIZEN': 'Citizen', 'role.OFFICER': 'Officer', 'role.COLLECTOR': 'Collector',
    'dept.ROADS': 'Roads & Buildings', 'dept.WATER': 'Water Supply', 'dept.ELECTRICITY': 'Electricity',
    'dept.SCHOOLS': 'School Education', 'dept.SANITATION': 'Sanitation', 'dept.HEALTH': 'Health',
    'issue.updateStatus': 'Update status', 'common.loading': 'Loading...', 'common.error': 'Something went wrong',
    'common.noPosts': 'No posts yet.',
  },
  te: {
    'nav.feed': 'ఫీడ్', 'nav.dashboard': 'డాష్‌బోర్డ్', 'nav.report': 'సమస్య నమోదు',
    'nav.login': 'లాగిన్', 'nav.logout': 'లాగౌట్',
    'feed.title': 'మీ ప్రాంతంలోని సమస్యలు', 'filter.allDepts': 'అన్ని శాఖలు', 'filter.allStatus': 'అన్ని స్థితులు',
    'status.OPEN': 'పెండింగ్', 'status.IN_PROGRESS': 'పురోగతిలో ఉంది', 'status.RESOLVED': 'పరిష్కరించబడింది',
    'upvote': 'మద్దతు', 'upvoted': 'మద్దతు ఇచ్చారు', 'noIssues': 'ఇంకా సమస్యలు లేవు.',
    'dashboard.title': 'శాఖల డాష్‌బోర్డ్', 'dashboard.dept': 'శాఖ', 'dashboard.total': 'మొత్తం',
    'dashboard.open': 'పెండింగ్', 'dashboard.inProgress': 'పురోగతిలో', 'dashboard.resolved': 'పరిష్కరించినవి',
    'dashboard.map': 'సమస్యల మ్యాప్',
    'report.title': 'సమస్యను నమోదు చేయండి', 'report.dept': 'శాఖ', 'report.issueTitle': 'సమస్య ఏమిటి?',
    'report.desc': 'వివరాలు', 'report.address': 'చిరునామా / గుర్తు', 'report.media': 'ఫోటో లేదా వీడియో',
    'report.pick': 'ఖచ్చితమైన ప్రదేశాన్ని మ్యాప్‌లో నొక్కండి', 'report.gps': 'నా GPS వాడండి', 'report.submit': 'పోస్ట్ చేయండి',
    'report.posting': 'పోస్ట్ అవుతోంది...', 'report.needLocation': 'దయచేసి మ్యాప్‌లో ప్రదేశాన్ని గుర్తించండి.',
    'report.dupTitle': 'ఇది ఇప్పటికే సమీపంలో నమోదైనట్లు ఉంది',
    'report.dupHelp': 'కొత్త పోస్ట్ చేయకుండా, ఉన్న పోస్ట్‌కు మద్దతు ఇవ్వండి.',
    'login.title': 'లాగిన్', 'login.registerTitle': 'ఖాతా సృష్టించండి', 'login.name': 'పేరు', 'login.email': 'ఈమెయిల్',
    'login.password': 'పాస్‌వర్డ్', 'login.submit': 'లాగిన్', 'login.registerSubmit': 'సైన్ అప్',
    'login.toRegister': 'కొత్తవారా? ఖాతా సృష్టించండి', 'login.toLogin': 'ఖాతా ఉందా? లాగిన్',
    'login.demo': 'డెమో లాగిన్లు (పాస్‌వర్డ్: demo123): collector@civic.in, roads@civic.in, asha@example.com',
    'profile.posts': 'పోస్టులు', 'profile.resolved': 'పరిష్కరించినవి', 'profile.joined': 'చేరిన తేదీ',
    'profile.edit': 'ప్రొఫైల్ మార్చండి', 'profile.save': 'సేవ్', 'profile.bio': 'పరిచయం', 'profile.notFound': 'ప్రొఫైల్ దొరకలేదు',
    'role.CITIZEN': 'పౌరుడు', 'role.OFFICER': 'అధికారి', 'role.COLLECTOR': 'కలెక్టర్',
    'dept.ROADS': 'రోడ్లు & భవనాలు', 'dept.WATER': 'నీటి సరఫరా', 'dept.ELECTRICITY': 'విద్యుత్',
    'dept.SCHOOLS': 'పాఠశాల విద్య', 'dept.SANITATION': 'పారిశుధ్యం', 'dept.HEALTH': 'ఆరోగ్యం',
    'issue.updateStatus': 'స్థితి మార్చండి', 'common.loading': 'లోడ్ అవుతోంది...', 'common.error': 'ఏదో తప్పు జరిగింది',
    'common.noPosts': 'ఇంకా పోస్టులు లేవు.',
  },
  hi: {
    'nav.feed': 'फ़ीड', 'nav.dashboard': 'डैशबोर्ड', 'nav.report': 'शिकायत दर्ज करें',
    'nav.login': 'लॉगिन', 'nav.logout': 'लॉगआउट',
    'feed.title': 'आपके क्षेत्र की समस्याएँ', 'filter.allDepts': 'सभी विभाग', 'filter.allStatus': 'सभी स्थितियाँ',
    'status.OPEN': 'लंबित', 'status.IN_PROGRESS': 'प्रगति में', 'status.RESOLVED': 'हल हुआ',
    'upvote': 'समर्थन', 'upvoted': 'समर्थन दिया', 'noIssues': 'अभी कोई समस्या नहीं।',
    'dashboard.title': 'विभाग डैशबोर्ड', 'dashboard.dept': 'विभाग', 'dashboard.total': 'कुल',
    'dashboard.open': 'लंबित', 'dashboard.inProgress': 'प्रगति में', 'dashboard.resolved': 'हल हुए',
    'dashboard.map': 'समस्या मानचित्र',
    'report.title': 'समस्या दर्ज करें', 'report.dept': 'विभाग', 'report.issueTitle': 'समस्या क्या है?',
    'report.desc': 'विवरण', 'report.address': 'पता / पहचान स्थल', 'report.media': 'फ़ोटो या वीडियो',
    'report.pick': 'सटीक जगह के लिए मानचित्र पर टैप करें', 'report.gps': 'मेरा GPS उपयोग करें', 'report.submit': 'पोस्ट करें',
    'report.posting': 'पोस्ट हो रहा है...', 'report.needLocation': 'कृपया मानचित्र पर जगह चुनें।',
    'report.dupTitle': 'ऐसा लगता है कि यह पास में पहले से दर्ज है',
    'report.dupHelp': 'नया पोस्ट बनाने के बजाय मौजूदा पोस्ट का समर्थन करें।',
    'login.title': 'लॉगिन', 'login.registerTitle': 'खाता बनाएँ', 'login.name': 'नाम', 'login.email': 'ईमेल',
    'login.password': 'पासवर्ड', 'login.submit': 'लॉगिन', 'login.registerSubmit': 'साइन अप',
    'login.toRegister': 'नए हैं? खाता बनाएँ', 'login.toLogin': 'खाता है? लॉगिन करें',
    'login.demo': 'डेमो लॉगिन (पासवर्ड: demo123): collector@civic.in, roads@civic.in, asha@example.com',
    'profile.posts': 'पोस्ट', 'profile.resolved': 'हल हुए', 'profile.joined': 'जुड़े',
    'profile.edit': 'प्रोफ़ाइल बदलें', 'profile.save': 'सहेजें', 'profile.bio': 'परिचय', 'profile.notFound': 'प्रोफ़ाइल नहीं मिली',
    'role.CITIZEN': 'नागरिक', 'role.OFFICER': 'अधिकारी', 'role.COLLECTOR': 'कलेक्टर',
    'dept.ROADS': 'सड़क एवं भवन', 'dept.WATER': 'जल आपूर्ति', 'dept.ELECTRICITY': 'बिजली',
    'dept.SCHOOLS': 'स्कूल शिक्षा', 'dept.SANITATION': 'स्वच्छता', 'dept.HEALTH': 'स्वास्थ्य',
    'issue.updateStatus': 'स्थिति बदलें', 'common.loading': 'लोड हो रहा है...', 'common.error': 'कुछ गलत हो गया',
    'common.noPosts': 'अभी कोई पोस्ट नहीं।',
  },
};

export const LANGS = [['en', 'English'], ['te', 'తెలుగు'], ['hi', 'हिन्दी']];
const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem('civic_lang') || 'en'; } catch { return 'en'; }
  });
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('civic_lang', l); } catch { /* ignore */ }
  };
  const t = (key) => D[lang]?.[key] ?? D.en[key] ?? key;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}
