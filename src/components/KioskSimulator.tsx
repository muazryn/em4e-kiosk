import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coins, Award, HelpCircle, ArrowRight, 
  RefreshCw, Sliders, CheckCircle2, XCircle, Sparkles, GraduationCap, Info, MapPin,
  Home
} from "lucide-react";
import { QuizQuestion, KioskTheme } from "../types";
import { playSound } from "./AudioEngine";
import AnimatedKids, { FaceMood } from "./AnimatedKids";

// Bilingual translations for standard curator gallery quiz questions
const questionTranslations: Record<number, {
  category: string;
  question: string;
  options: string[];
  childHint: string;
  adultDetail: string;
  galleryItemSuggestion: string;
}> = {
  1: {
    category: "Keselamatan",
    question: "Pernahkah anda perhatikan garisan bergerigi kecil di sekeliling tepi syiling logam? Mengapa pemerintah terdahulu mengukirnya di situ?",
    options: [
      "Untuk membantu orang mencengkam syiling dalam cuaca hujan 🌧️",
      "Untuk menghalang pencuri licik daripada mencukur perak berharga dari tepi! ✂️",
      "Untuk membuat bunyi loceng yang indah apabila digoncang dalam pundi kulit 🎶",
      "Untuk membantu pedagang yang cacat penglihatan membeli dan menjual barangan 👁️"
    ],
    childHint: "Fikirkan tentang bahan asal syiling purba! Ia adalah logam berharga sebenar seperti emas dan perak.",
    adultDetail: "Dikenali sebagai 'reeding', ciri keselamatan ini diperkenalkan pada akhir abad ke-17. Oleh kerana syiling ditempa daripada logam berharga, penipu akan mencukur bahagian luar syiling untuk dilebur dan dijual, manakala syiling asal tetap dibelanjakan pada nilai muka. Corak ini segera mendedahkan syiling yang telah dipotong.",
    galleryItemSuggestion: "Dipamerkan bersebelahan dengan mahkota perak yang dipotong abad ke-16 dan mesin penekan syiling tepi pengisar."
  },
  2: {
    category: "Wang Komoditi",
    question: "Lama sebelum syiling logam berkilat dan wang kertas berwarna-warni dicipta, bagaimanakah tamadun awal membeli makanan mereka?",
    options: [
      "Dengan baldi berisi lumpur sungai digilap dan daun pokok yang cantik 🍂",
      "Dengan cangkerang laut yang jarang ditemui, ketulan garam, dan biji koko! 🐚",
      "Dengan kepompong rama-rama dan bulu burung yang berwarna-warni 🦋",
      "Dengan sudu penyukat kayu dan batu kerikil yang diukir 🌸"
    ],
    childHint: "Wang awal mestilah tahan lama, sukar ditemui, dan berguna kepada hampir semua orang supaya mereka bersetuju menerimanya!",
    adultDetail: "Ini dikenali sebagai 'wang komoditi'. Di seluruh Asia dan Afrika, cangkerang Cowrie berfungsi sebagai wang rasmi selama berabad-abad. Di Rom purba, tentera kadangkala dibayar dengan ketulan garam yang bernilai tinggi (menjadi asal usul perkataan 'gaji' daripada bahasa Latin 'salarium').",
    galleryItemSuggestion: "Dipamerkan bersebelahan dengan koleksi bekas perdagangan Cangkerang Cowrie Maldives dan spesimen acuan garam Salarium Rom kami."
  },
  3: {
    category: "Wang Kertas",
    question: "Wang kertas pada asalnya dicipta di China purba disebabkan oleh sakit kepala yang sangat berat. Apakah masalah utamanya?",
    options: [
      "Membawa syiling besi yang berat untuk membeli makan tengah hari boleh merosakkan kereta kuda dan meletihkan kuda! 🐴",
      "Syiling logam terus menarik petir semasa ribut petir musim panas yang panas ⚡",
      "Tikus terus mengunyah peti kunci kayu pedagang 🐭",
      "Bunyi gemerincing syiling membuatkan lanun dapat mendengar mereka dari berbatu-batu jauhnya! 🏴‍☠️"
    ],
    childHint: "Bayangkan anda pergi membeli-belah, tetapi baki wang di dalam poket anda lebih berat daripada peti sejuk! Bagaimana untuk membawanya pulang?",
    adultDetail: "Semasa Dinasti Song (abad ke-11), syiling besi mempunyai nilai yang sangat rendah sehinggakan membawa 1,000 syiling besi seberat hampir 100 paun. Pedagang mula meninggalkan syiling berat mereka di rumah simpanan deposit yang dipercayai, menukarnya dengan resit kertas ringan—kelahiran wang kertas wang kertas (dikenali sebagai 'Jiaozi' atau wang terbang).",
    galleryItemSuggestion: "Gandingkan dengan blok percetakan plat kuprum Dinasti Song dan nota Perbendaharaan Great Ming Maharaja Kublai Khan (sekitar 1375)."
  },
  4: {
    category: "Inflasi",
    question: "Jika anda mempunyai mesin masa dan kembali ke 100 tahun dahulu, wang kertas $10 anda boleh membeli 10 piza gergasi. Hari ini, wang yang sama hanya boleh membeli satu potong piza! Mengapa?",
    options: [
      "Pembuat piza moden menjadi lebih malas dan mengambil masa lebih lama untuk bekerja 🍕",
      "Piza moden dicipta menggunakan bahan ruang angkasa radioaktif rahsia 🚀",
      "Inflasi secara semula jadi menaikkan harga dari semasa ke semasa, menyebabkan setiap dolar membeli lebih sedikit 🎈",
      "Orang ramai pada tahun 1920-an enggan makan keju, jadi roti hampir percuma 🧀"
    ],
    childHint: "Lama-kelamaan, harga umum merayap naik perlahan-lahan di seluruh negara. Bukan piza itu yang berubah, tetapi kuasa beli wang yang menyusut.",
    adultDetail: "Ini menggambarkan 'inflasi' dan 'kuasa beli'. Apabila jumlah penawaran wang berkembang lebih cepat daripada pengeluaran barangan, unit mata wang individu kehilangan kuasa beli. Penjejak harga sejarah menjadikan konsep mikroekonomi ini sangat jelas.",
    galleryItemSuggestion: "Letakkan bersebelahan dengan troli barangan komoditi interaktif 100 tahun kami, membolehkan pelawat menimbang barangan makanan dari tahun 1926 berbanding hari ini."
  },
  5: {
    category: "Kadar Pertukaran",
    question: "Apabila melancong ke luar negara, anda mesti menukar wang tempatan anda dengan euro atau yen tempatan mereka. Apakah yang mengira nilai wang tersebut?",
    options: [
      "Pengawal keselamatan lapangan terbang meneka nasib anda ✈️",
      "Betapa sopan dan mesra anda terhadap juruwang bank tempatan 🏦",
      "Kadar Pertukaran, yang seperti tarik tali kewangan antara dua ekonomi 🎛️",
      "Jumlah berat bagasi anda di kaunter tiket 🧳"
    ],
    childHint: "Ia seperti neraca antara dua negara. Satu pihak naik atau turun bergantung pada kekuatan ekonomi masing-masing!",
    adultDetail: "Kadar pertukaran turun naik 24/7 di pasaran mata wang global. Kadar pertukaran relatif mewakili sejauh mana kebolehpercayaan sesebuah ekonomi, kadar inflasi, dasar faedah, baki perdagangan dan kestabilan politik berbanding negara lain.",
    galleryItemSuggestion: "Letakkan bersebelahan dengan papan ticker kadar pertukaran mata wang dunia mekanikal kami yang memaparkan pertukaran mata wang masa nyata."
  }
};

// Bilingual labels & descriptors for active museum presentation slides
const LOC_TEXT = {
  en: {
    curatorAcademy: "Curator Academy",
    slideProgress: "Discovery Slide",
    lesson1Title: "Lesson 1: Balancing Exchange Rates",
    lesson2Title: "Lesson 2: How Exchange Rates Work",
    lesson3Title: "Lesson 3: Securing Trust & Anti-Counterfeiting",
    liveExchangeSim: "Live Currency Exchange Simulator",
    swapDescription: "To trade globally, we swap international currencies. A sound economy with high demand makes its currency strong. Let's swap",
    goldenExplorerTokens: "10 US/AUD Dollars",
    setExchangeRate: "Set Exchange Value Rate:",
    wallet: "Your Wallet",
    receivedTrade: "Received Trade",
    curatorHint: "Curator Hint:",
    exchangeHint: "When an economy's trade surplus grows, foreign merchants must bid higher (stronger rate) to acquire its coins to buy export goods! This causes exchange rates to rise.",
    purchasingMachine: "Purchasing Power Time Machine",
    inflationDescription: "Inflation means prices rise over time. When more banknotes hunt the same amount of actual grain and milk, money loses purchasing power. Drag the slider to travel through centuries!",
    setExhibitionYear: "Set Exhibition Year:",
    whatDollarBuys: "What $1 buys:",
    inflationHint: "Inflation happens if a government prints way too many tokens without increasing actual physical products, making each token worth less!",
    securingTrustLab: "Exhibition Lab: Minting Security Ridges",
    securingTrustDesc: "Ancient gold and silver coins were regularly targeted by scammers who shaved away edges (Coin Shaving). Let's design a trustworthy edge to safeguard the coin's intrinsic value!",
    setCoinEdge: "Set Coin Edge Design Profile:",
    smoothRim: "🟡 Smooth Rim",
    smoothSub: "Easy to Shave / Clip",
    reededRidges: "⚙️ Reeded Ridges",
    reededSub: "Secure Ridged Edges",
    shaveRisk: "SHAVE RISK!",
    safeIntegral: "SAFE & INTEGRAL",
    newtonDiscovery: "Isaac Newton's Discovery:",
    newtonHint: "Newton added strict milled boundaries and small vertical notches (reeding) to gold coins so shaving off even a millimetre of gold became visibly obvious instantly!",
    nextLesson: "Next Lesson →",
    selectRidgesBorder: "Select Ridged Rim first to certify!",
    commenceQuiz: "Commence Challenge Quiz! 🚀",
    quizProgress: "Q",
    selectAnswerSide: "💭 Select your answer on the side panel!",
    selectAnswerOnSide: "💭 Select your answer on the side panel!",
    correctHeader: "✨ Correct Answer!",
    lessonHeader: "💡 Important Lesson:",
    correctNotification: "✨ Correct Answer!",
    lessonNotification: "💡 Important Lesson:",
    forJuniorCollectors: "For Junior Collectors",
    forCuriousAdults: "For Curious Adults",
    juniorCollectors: "For Junior Collectors",
    curiousAdults: "For Curious Adults",
    galleryPointer: "Guide Info",
    nextQuestion: "Next Question",
    viewFinalScore: "View Final Score",
    scoreFullSpeech: "Wow! 5 out of 5 stars! I (Leo) declare you the MASTER COIN MINT MASTER! 🥇",
    scoreGoodSpeech: "Woohoo! {score} correct! You're an official Economy Apprentice! Let's get 5/5 next time! 🥈",
    scoreLowSpeech: "Great try! You got {score} points. Let's study the lessons together and try again! 🥉",
    certificateOfNumismatics: "Certificate of Economic Excellence",
    numismaticsCertificate: "Certificate of Economic Excellence",
    correctStars: "Correct Stars",
    curatedTitleLabel: "Your Curated Title:",
    yourCuratedTitle: "Your Curated Title",
    titleMintMaster: "🥇 Master Coin Mint Master",
    titleApprentice: "🥈 Economy Apprentice",
    titleHistorian: "🥉 Curious Historian",
    curatorFeedbackHeader: "Curator Feedback:",
    curatorFeedback: "Curator Feedback",
    feedbackFull: "Exceptional mastery! You understand price mechanics, ancient coinage, security reeding, and currency minting like a senior Central Banker.",
    feedbackGood: "Great effort! You grasped why copper is alloyed, how metal ridges prevent coin shaving, and why paper banknotes saved medieval merchants from lifting heavy iron wagons.",
    feedbackLow: "You are just steps away from mastery! Walk through our lessons and challenges to spot amazing coin facts, then challenge yourself here again!",
    quizLedger: "Interactive Quiz Ledger:",
    tryAgain: "Try Quiz Again",
    tryQuizAgain: "Try Quiz Again",
    resetGuide: "Reset & Recalibrate Guide",
    returnToHome: "Return to Home 🏠",
    kidWelcome: "Hi there! I'm Leo and this is Mia. Welcome to our coin kiosk! Let's examine some exchange rates!",
    kidThinking: "Hmm... Look closely at the clues and details in the simulator!",
    kidCorrect: "Hooray! You answered correctly! That makes perfect sense!",
    kidIncorrect: "That was a good guess, but let's check out the historical clue together!",
    
    // Flash Integration Additions English
    tabWhatAre: "What Are Exchange Rates?",
    tabHowWork: "How do Exchange Rates Work?",
    tabTestKnowledge: "Test Your Knowledge",
    flashRateDefinition: "An Exchange Rate is the price which one currency exchanges for another currency.\n\nFor example, USD 1.00 can be exchanged with RM 3.00, more or less, depending on the USD - RM Exchange Rate.",
    flashHowWorkExplanation: "Exchange Rates are determined by Demand and Supply of a currency.\n\nThe higher the Demand or lower the Supply, will cause the Exchange Rate to appreciate.\n\nThe lower the Demand or the higher the Supply will cause the Exchange Rate to depreciate.",
    flashHowWorkTitle: "HOW DO EXCHANGE RATES WORK?",
    flashSelectTopicBelow: "SELECT A TOPIC BELOW...",
    flashDepreciation: "DEPRECIATION",
    flashAppreciation: "APPRECIATION",
    flashMechanics: "MECHANICS",
    flashDepreciationDesc: "Currency value falls! This happens when supply of a currency is too high in international markets (e.g., higher imports or printing too much cash), meaning $1 USD can buy more of it.",
    flashAppreciationDesc: "Currency value rises! This happens when demand is high (e.g. strong trade export surplus), so foreign merchants must bid higher (stronger rate) to acquire its coins.",
    flashMechanicsDesc: "Foreign trade fuels rates! If an economy sells premium goods globally, buyers rush to purchase its local coins to pay. This supply/demand balance dynamically shifts rates daily.",
    flashTestKnowledgeTitle: "TEST YOUR KNOWLEDGE ...",
    flashKnowledgeIntroText: "EXCHANGE RATES PLAY AN IMPORTANT ROLE IN OUR DECISIONS ON HOW TO PURCHASE THINGS, WHERE TO PURCHASE THINGS AND ALSO WHEN TO PURCHASE THINGS...",
    flashTopicHowPay: "HOW DO I PAY?",
    flashTopicWhereBuy: "WHERE DO I BUY?",
    flashTopicWhenBuy: "WHEN DO I BUY?",
    flashStartTopicQuiz: "Launch Quiz Challenge! 🚀",
  },
  ms: {
    curatorAcademy: "Akademi Kurator",
    slideProgress: "Slaid Penemuan",
    lesson1Title: "Pelajaran 1: Mengimbangkan Kadar Pertukaran",
    lesson2Title: "Pelajaran 2: Bagaimana Kadar Pertukaran Berfungsi",
    lesson3Title: "Pelajaran 3: Menjamin Kepercayaan & Pencegahan Pemalsuan",
    liveExchangeSim: "Simulator Pertukaran Mata Wang Langsung",
    swapDescription: "Untuk berdagang secara global, kita menukar mata wang antarabangsa. Ekonomi yang kukuh dengan permintaan tinggi menjadikan wangnya kuat. Mari tukar",
    goldenExplorerTokens: "10 Dolar US/AUD",
    setExchangeRate: "Tetapkan Nilai Kadar Pertukaran:",
    wallet: "Dompet Anda",
    receivedTrade: "Hasil Dagangan",
    curatorHint: "Petunjuk Kurator:",
    exchangeHint: "Apabila lebihan perdagangan sesebuah ekonomi berkembang, pedagang asing mesti bida lebih tinggi (kadar lebih kuat) untuk mendapatkan syilingnya bagi membeli barangan eksport! Ini menyebabkan kadar pertukaran meningkat.",
    purchasingMachine: "Mesin Masa Kuasa Beli",
    inflationDescription: "Inflasi bermaksud harga meningkat dari semasa ke semasa. Apabila lebih banyak wang kertas mengejar jumlah barangan yang sama, wang kehilangan kuasa beli. Seret gelongsor untuk mengembara merentasi abad!",
    setExhibitionYear: "Tetapkan Tahun Pameran:",
    whatDollarBuys: "Apa yang dibeli oleh $1:",
    inflationHint: "Inflasi berlaku jika kerajaan mencetak terlalu banyak token tanpa meningkatkan produk fizikal sebenar, menjadikan setiap token bernilai lebih rendah!",
    securingTrustLab: "Makmal Pameran: Menempa Garisan Keselamatan",
    securingTrustDesc: "Syiling emas dan perak purba sering menjadi sasaran penipu yang mencukur bahagian tepi syiling (Cukuran Syiling). Mari reka tepi syiling yang boleh dipercayai untuk melindungi nilai intrinsiknya!",
    setCoinEdge: "Tetapkan Profil Reka Bentuk Tepi Syiling:",
    smoothRim: "🟡 Rim Licin",
    smoothSub: "Mudah Dicukur / Dipotong",
    reededRidges: "⚙️ Garis Bergerigi (Reeded)",
    reededSub: "Tepi Ridged Safe",
    shaveRisk: "RISIKO CUKUR!",
    safeIntegral: "SELAMAT & UTUH",
    newtonDiscovery: "Penemuan Isaac Newton:",
    newtonHint: "Newton menambah sempadan gilingan yang ketat dan takuk menegak kecil (reeding) pada syiling emas supaya cukuran emas walaupun satu milimeter akan kelihatan jelas serta-merta!",
    nextLesson: "Pelajaran Seterusnya →",
    selectRidgesBorder: "Pilih Rim Bergerigi untuk pengesahan!",
    commenceQuiz: "Mulakan Kuiz Cabaran! 🚀",
    quizProgress: "S",
    selectAnswerSide: "💭 Pilih jawapan anda di panel sisi!",
    selectAnswerOnSide: "💭 Pilih jawapan anda di panel sisi!",
    correctHeader: "✨ Jawapan Betul!",
    lessonHeader: "💡 Pelajaran Penting:",
    correctNotification: "✨ Jawapan Betul!",
    lessonNotification: "💡 Pelajaran Penting:",
    forJuniorCollectors: "Untuk Pengumpul Muda",
    forCuriousAdults: "Untuk Dewasa Yang Ingin Tahu",
    juniorCollectors: "Untuk Pengumpul Muda",
    curiousAdults: "Untuk Dewasa Yang Ingin Tahu",
    galleryPointer: "Info Panduan",
    nextQuestion: "Soalan Seterusnya",
    viewFinalScore: "Lihat Skor Akhir",
    scoreFullSpeech: "Wow! 5 daripada 5 bintang! Saya (Mia) mengisytiharkan anda sebagai MASTER COIN MINT MASTER! 🥇",
    scoreGoodSpeech: "Woohoo! {score} betul! Anda adalah Perantis Ekonomi rasmi! Mari dapatkan 5/5 kali seterusnya! 🥈",
    scoreLowSpeech: "Cubaan yang hebat! Anda mendapat {score} mata. Mari kita kaji pelajaran bersama-sama dan cuba lagi! 🥉",
    certificateOfNumismatics: "Sijil Kecemerlangan Ekonomi",
    numismaticsCertificate: "Sijil Kecemerlangan Ekonomi",
    correctStars: "Bintang Betul",
    curatedTitleLabel: "Gelaran Kurator Anda:",
    yourCuratedTitle: "Gelaran Kurator Anda",
    titleMintMaster: "🥇 Master Coin Mint Master",
    titleApprentice: "🥈 Perantis Ekonomi",
    titleHistorian: "🥉 Sejarawan Yang Ingin Tahu",
    curatorFeedbackHeader: "Maklum Balas Kurator:",
    curatorFeedback: "Maklum Balas Kurator",
    feedbackFull: "Penguasaan yang luar biasa! Anda memahami mekanik harga, pensyilingan purba, reeding keselamatan, dan penempaan wang seperti Bank Pusat kanan.",
    feedbackGood: "Usaha yang hebat! Anda memahami mengapa tembaga dialoi, bagaimana rabung logam menghalang cukuran syiling, dan mengapa wang kertas menemani pedagang zaman pertengahan.",
    feedbackLow: "Anda hanya beberapa langkah sahaja lagi daripada penguasaan! Semak pelajaran dan cabaran kami untuk mengetahui fakta syiling yang menakjubkan, kemudian cabar diri anda di sini lagi!",
    quizLedger: "Daftar Kuiz Interaktif:",
    tryAgain: "Cuba Kuiz Semula",
    tryQuizAgain: "Cuba Kuiz Semula",
    resetGuide: "Atur Semula & Kalibrasi Panduan",
    returnToHome: "Kembali ke Laman Utama 🏠",
    kidWelcome: "Hai di sana! Saya Leo dan ini Mia. Selamat datang ke kiosk syiling! Mari kita teroka kadar pertukaran!",
    kidThinking: "Hmm... Lihat dengan teliti petunjuk dan butirannya di dalam simulator!",
    kidCorrect: "Hooray! Anda menjawab dengan betul! Memang masuk akal! ⭐",
    kidIncorrect: "Tebaan yang baik, tetapi mari kita semak petunjuk sejarah bersama-sama!",
    
    // Flash Integration Additions Bahasa Malaysia
    tabWhatAre: "Apakah Kadar Pertukaran?",
    tabHowWork: "Bagaimana Kadar Pertukaran Berfungsi?",
    tabTestKnowledge: "Uji Pengetahuan Anda",
    flashRateDefinition: "Kadar Pertukaran ialah harga di mana satu mata wang ditukarkan dengan mata wang yang lain.\n\nSebagai contoh, USD 1.00 boleh ditukar dengan RM 3.00, lebih atau kurang, bergantung pada Kadar Pertukaran USD - RM.",
    flashHowWorkExplanation: "Kadar Pertukaran ditentukan oleh Permintaan dan Bekalan sesuatu mata wang.\n\nSemakin tinggi Permintaan atau semakin rendah Bekalan, akan menyebabkan Kadar Pertukaran meningkat (apresiasi).\n\nSemakin rendah Permintaan atau semakin tinggi Bekalan akan menyebabkan Kadar Pertukaran menyusut nilai (depresiasi).",
    flashHowWorkTitle: "BAGAIMANA KADAR PERTUKARAN BERFUNGSI?",
    flashSelectTopicBelow: "PILIH TOPIK DI BAWAH...",
    flashDepreciation: "DEPRESIASI (SUSUT)",
    flashAppreciation: "APRESIASI (NAIK)",
    flashMechanics: "MEKANIK DAGANG",
    flashDepreciationDesc: "Nilai mata wang jatuh! Ini berlaku apabila bekalan mata wang terlalu tinggi dalam pasaran antarabangsa (cth., import yang lebih tinggi atau mencetak terlalu banyak wang tunai), bermakna $1 USD boleh membeli lebih banyak mata wang tersebut.",
    flashAppreciationDesc: "Nilai mata wang meningkat! Ini berlaku apabila permintaan tinggi (cth. lebihan eksport perdagangan yang kukuh), jadi pedagang asing mesti membida lebih tinggi (kadar yang lebih kuat) untuk mendapatkan syilingnya.",
    flashMechanicsDesc: "Dagangan asing mendorong kadar! Jika sesebuah ekonomi menjual barangan premium secara global, pembeli akan bergegas membeli syiling tempatan untuk membuat pembayaran. Imbangan bekalan/permintaan ini secara dinamik beralih kadar setiap hari.",
    flashTestKnowledgeTitle: "UJI PENGETAHUAN ANDA ...",
    flashKnowledgeIntroText: "KADAR PERTUKARAN DIMAINKAN PERANAN PENTING DALAM KEPUTUSAN KITA TENTANG BAGAIMANA UNTUK MEMBELI SEBARANG BARANG, DI MANA UNTUK MEMBELI BARANG DAN JUGA BILA UNTUK MEMBELI BARANG...",
    flashTopicHowPay: "BAGAIMANA SAYA MEMBAYAR?",
    flashTopicWhereBuy: "DI MANA SAYA MEMBELI?",
    flashTopicWhenBuy: "BILA SAYA MEMBELI?",
    flashStartTopicQuiz: "Mulakan Kuiz Cabaran! 🚀",
  }
};

interface KioskSimulatorProps {
  questions: QuizQuestion[];
  onResetQuestions: () => void;
  isPresentation?: boolean;
  isBorderless?: boolean;
  onExitPresentation?: () => void;
  onToggleFullscreen?: () => void;
}

export default function KioskSimulator({ 
  questions, 
  onResetQuestions,
  isPresentation = false,
  isBorderless = false,
  onExitPresentation,
  onToggleFullscreen
}: KioskSimulatorProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null); // null means welcome screen
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [kioskTheme, setKioskTheme] = useState<KioskTheme>("toybox-playground");
  const [history, setHistory] = useState<{ questionId: number; isCorrect: boolean }[]>([]);

  // Flash Player Integration States
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean>(false);
  const [showQuizIntro, setShowQuizIntro] = useState<boolean>(false);
  const [activeHowWorkTopic, setActiveHowWorkTopic] = useState<"depreciation" | "appreciation" | "mechanics" | null>(null);

  // Educational discovery guide states
  const [isLearningActive, setIsLearningActive] = useState<boolean>(false);
  const [learningStep, setLearningStep] = useState<number>(0);
  const [localExchangeRate, setLocalExchangeRate] = useState<number>(3);
  const [inflationYear, setInflationYear] = useState<number>(1920);
  const [selectedCoinEdge, setSelectedCoinEdge] = useState<"smooth" | "reeded">("smooth");

  // Language Support State (Bilingual)
  const [language, setLanguage] = useState<"en" | "ms">("en");

  // Every 10 seconds, swap language unless the user has actively locked / chosen a language
  React.useEffect(() => {
    if (isLanguageSelected) return;

    const intervalId = setInterval(() => {
      setLanguage((prevLang) => (prevLang === "en" ? "ms" : "en"));
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isLanguageSelected]);

  // Retro Welcome Screen Exchange Rates Digital States
  const [usdDigits, setUsdDigits] = useState<[number, number, number]>([3, 4, 0]);
  const [audDigits, setAudDigits] = useState<[number, number, number]>([2, 3, 0]);
  const [usdTrend, setUsdTrend] = useState<"up" | "down" | "flat">("flat");
  const [audTrend, setAudTrend] = useState<"up" | "down" | "flat">("flat");

  // Every 2.8 seconds, randomly fluctuate exchange rates in real-time
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      // 1. USD Fluctuation
      setUsdDigits((prev) => {
        const currentVal = prev[0] + prev[1] / 10 + prev[2] / 100;
        const step = parseFloat((Math.random() * 0.06 - 0.03).toFixed(2));
        let nextVal = parseFloat((currentVal + step).toFixed(2));

        if (nextVal < 3.15) {
          nextVal = 3.15;
        } else if (nextVal > 4.50) {
          nextVal = 4.50;
        }

        const diff = nextVal - currentVal;
        setUsdTrend(diff > 0.005 ? "up" : diff < -0.005 ? "down" : "flat");

        const d0 = Math.floor(nextVal);
        const dec = Math.round((nextVal - d0) * 100);
        const d1 = Math.floor(dec / 10);
        const d2 = dec % 10;
        return [d0, d1, d2] as [number, number, number];
      });

      // 2. AUD Fluctuation
      setAudDigits((prev) => {
        const currentVal = prev[0] + prev[1] / 10 + prev[2] / 100;
        const step = parseFloat((Math.random() * 0.06 - 0.03).toFixed(2));
        let nextVal = parseFloat((currentVal + step).toFixed(2));

        if (nextVal < 2.15) {
          nextVal = 2.15;
        } else if (nextVal > 2.95) {
          nextVal = 2.95;
        }

        const diff = nextVal - currentVal;
        setAudTrend(diff > 0.005 ? "up" : diff < -0.005 ? "down" : "flat");

        const d0 = Math.floor(nextVal);
        const dec = Math.round((nextVal - d0) * 100);
        const d1 = Math.floor(dec / 10);
        const d2 = dec % 10;
        return [d0, d1, d2] as [number, number, number];
      });
    }, 2800);

    return () => clearInterval(intervalId);
  }, []);

  // Map interaction / tooltip state
  const [activeGeo, setActiveGeo] = useState<"usa" | "sg" | "my" | "au" | null>(null);

  // Computed localized question object matching active language selection
  const currentQuestion = React.useMemo(() => {
    if (currentQuestionIndex === null) return null;
    const currentQuestionRaw = questions[currentQuestionIndex];
    if (!currentQuestionRaw) return null;
    
    if (language === "ms" && questionTranslations[currentQuestionRaw.id]) {
      const trans = questionTranslations[currentQuestionRaw.id];
      return {
        ...currentQuestionRaw,
        category: trans.category,
        question: trans.question,
        options: trans.options,
        childHint: trans.childHint,
        adultDetail: trans.adultDetail,
        galleryItemSuggestion: trans.galleryItemSuggestion
      };
    }
    return currentQuestionRaw;
  }, [currentQuestionIndex, questions, language]);

  const handlePlayClick = () => {
    if (soundEnabled) playSound.click();
  };

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      setTimeout(() => playSound.click(), 100);
    }
  };

  const startLearningMode = () => {
    handlePlayClick();
    setIsLanguageSelected(true);
    setIsLearningActive(true);
    setLearningStep(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setHistory([]);
    setCurrentQuestionIndex(null);
    setSelectedCoinEdge("smooth");
    setShowQuizIntro(false);
    setActiveHowWorkTopic(null);
  };

  const nextLearningStep = () => {
    handlePlayClick();
    if (learningStep < 2) {
      setLearningStep(learningStep + 1);
    } else {
      setIsLearningActive(false);
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsFinished(false);
      setSelectedOption(null);
      setHistory([]);
      setShowQuizIntro(true); // Bring up Flash player Test Your Knowledge Intro!
    }
  };

  const startQuiz = () => {
    handlePlayClick();
    setIsLearningActive(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setHistory([]);
    setShowQuizIntro(false);
  };

  const selectAnswer = (optionIndex: number) => {
    if (selectedOption !== null || currentQuestionIndex === null || !currentQuestion) return;

    setSelectedOption(optionIndex);
    const question = currentQuestion;
    const isCorrect = optionIndex === question.correctAnswerIndex;

    setHistory([...history, { questionId: question.id, isCorrect }]);

    if (isCorrect) {
      setScore((s) => s + 1);
      if (soundEnabled) playSound.correct();
    } else {
      if (soundEnabled) playSound.incorrect();
    }
  };

  const nextQuestion = () => {
    handlePlayClick();
    if (currentQuestionIndex === null) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      if (soundEnabled) playSound.victory();
    }
  };

  const restartQuiz = () => {
    handlePlayClick();
    setIsLearningActive(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setHistory([]);
    setShowQuizIntro(true);
  };

  const resetToWelcome = () => {
    setIsLanguageSelected(false);
    setCurrentQuestionIndex(null);
    setIsFinished(false);
    setIsLearningActive(false);
    setScore(0);
    setSelectedOption(null);
    setHistory([]);
    setShowQuizIntro(false);
    setActiveHowWorkTopic(null);
    setLearningStep(0);
  };

  const goToWelcomeScreen = () => {
    handlePlayClick();
    resetToWelcome();
  };

  const handleBackAction = () => {
    handlePlayClick();
    if (isFinished) {
      setIsFinished(false);
      setCurrentQuestionIndex(questions.length - 1);
      setSelectedOption(null);
    } else if (currentQuestionIndex !== null) {
      if (showQuizIntro) {
        setIsLearningActive(true);
        setLearningStep(2);
        setCurrentQuestionIndex(null);
        setShowQuizIntro(false);
      } else {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
          setSelectedOption(null);
        } else {
          setShowQuizIntro(true);
        }
      }
    } else if (isLearningActive) {
      if (learningStep > 0) {
        setLearningStep(learningStep - 1);
      } else {
        setIsLanguageSelected(false);
        setIsLearningActive(false);
      }
    } else {
      setIsLanguageSelected(false);
    }
  };

  // Theme styles selector
  const getThemeStyles = () => {
    switch (kioskTheme) {
      case "classic-wood":
        return {
          frame: "border-[16px] border-amber-900 bg-emerald-950 text-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl",
          screen: "bg-emerald-900/60 border border-emerald-800/80 patterns-diagonal-stripes",
          accentColor: "bg-amber-600 text-amber-950 hover:bg-amber-500",
          optionDefault: "bg-emerald-950/70 hover:bg-emerald-800 border-amber-800/40 text-slate-100",
          optionCorrect: "bg-green-800 text-white border-green-400 font-semibold",
          optionIncorrect: "bg-red-950 text-red-200 border-red-500",
          tagBg: "bg-amber-800/30 text-amber-200 border-amber-800/50",
          fontClass: "font-serif"
        };
      case "royal-vault":
        return {
          frame: "border-[16px] border-yellow-600 bg-slate-900 text-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl",
          screen: "bg-slate-900/95 border border-yellow-600/40",
          accentColor: "bg-yellow-600 text-slate-950 hover:bg-yellow-500 font-bold",
          optionDefault: "bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200",
          optionCorrect: "bg-emerald-800 text-white border-emerald-400 font-semibold shadow-lg shadow-emerald-900/20",
          optionIncorrect: "bg-red-900/80 text-red-200 border-red-500/80",
          tagBg: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
          fontClass: "font-sans"
        };
      case "digital-hologram":
        return {
          frame: "border-[12px] border-cyan-500/30 bg-slate-950 text-[#ccfbf1] shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-3xl relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,24,38,0)_50%,rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] before:bg-[size:100%_4px,_100px_100%] before:pointer-events-none",
          screen: "bg-slate-950 border border-cyan-500/30",
          accentColor: "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]",
          optionDefault: "bg-slate-900/80 hover:bg-slate-855 border-cyan-950 text-[#2dd4bf]",
          optionCorrect: "bg-teal-950 text-white border-emerald-400 font-semibold shadow-[0_0_15px_rgba(52,211,153,0.3)]",
          optionIncorrect: "bg-rose-950 border-rose-500 text-rose-200",
          tagBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
          fontClass: "font-sans"
        };
      case "toybox-playground":
        return {
          frame: "border-[16px] border-amber-400 bg-slate-900 text-slate-100 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.35)] rounded-3xl",
          screen: "bg-slate-950 border border-amber-400/40",
          accentColor: "bg-[#e12a6f] text-white hover:bg-[#c21e59] shadow-md font-bold rounded-xl",
          optionDefault: "bg-slate-900 hover:bg-slate-850 border-2 border-dashed border-amber-400/30 text-amber-200 font-medium",
          optionCorrect: "bg-emerald-500 text-white border-2 border-emerald-300 font-extrabold shadow-md",
          optionIncorrect: "bg-[#e12a6f] text-white border-2 border-red-305 font-bold shadow-md",
          tagBg: "bg-amber-400/15 text-amber-300 border-amber-400/40",
          fontClass: "font-sans"
        };
      case "brushed-steel":
      default:
        return {
          frame: "border-[16px] border-slate-700 bg-slate-900 text-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-3xl",
          screen: "bg-slate-905 border border-slate-800",
          accentColor: "bg-indigo-600 text-slate-100 hover:bg-indigo-500",
          optionDefault: "bg-slate-800 hover:bg-slate-700 border-slate-700/60 text-slate-200",
          optionCorrect: "bg-emerald-600/90 text-white border-emerald-400 font-semibold",
          optionIncorrect: "bg-rose-900/90 text-rose-100 border-rose-500",
          tagBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/40",
          fontClass: "font-sans"
        };
    }
  };

  // 20 seconds idle timer for each page except the main/welcome page
  React.useEffect(() => {
    // Only run if we are NOT on the main welcome page (i.e. isLanguageSelected is true)
    if (!isLanguageSelected) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resetToWelcome();
      }, 20000); // 20 seconds
    };

    // Initialize timer immediately
    resetTimer();

    // Event listeners to detect any human activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "wheel"
    ];

    const handleUserActivity = () => {
      resetTimer();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [
    isLanguageSelected,
    isLearningActive,
    learningStep,
    currentQuestionIndex,
    isFinished,
    activeHowWorkTopic,
    showQuizIntro,
    selectedCoinEdge,
    inflationYear
  ]);

  const theme = getThemeStyles();

  return (
    <div className={`flex flex-col items-center ${isBorderless ? "w-full h-full" : "w-full"}`}>
      
      {/* Theme and Volume bar */}
      {!isPresentation && (
        <div className="w-full max-w-[1200px] mb-4 flex flex-col sm:flex-row items-center justify-between bg-slate-900 p-3.5 rounded-2xl border border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest font-mono">
              Kiosk Hardware Frame:
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5">
            {["toybox-playground", "brushed-steel", "classic-wood", "royal-vault", "digital-hologram"].map((t) => (
              <button
                 id={`btn_theme_${t}`}
                key={t}
                onClick={() => {
                  setKioskTheme(t as KioskTheme);
                  handlePlayClick();
                }}
                className={`p-1 px-3 rounded-md text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-all ${
                  kioskTheme === t
                    ? "bg-slate-100 text-slate-900 shadow"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {t === "toybox-playground" ? "🧒 Toybox" : t === "digital-hologram" ? "Cyber" : t.split("-")[0]}
              </button>
            ))}

            <button
              id="btn_enter_fullscreen_kiosk"
              onClick={onToggleFullscreen}
              className="ml-3 p-1 px-3 rounded-md text-[10px] font-extrabold uppercase tracking-wider cursor-pointer bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-[#10b981] hover:to-[#059669] text-white active:scale-95 shadow transition-all flex items-center gap-1"
              title="Activate full screen presentation mode"
            >
              🖥️ Kiosk Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Touch Screen Terminal Bezel Frame */}
      <div className={`${isBorderless ? "w-full h-full " + theme.frame : theme.frame + " w-full max-w-[1200px] aspect-[16/9]"} flex flex-col transition-all duration-300 relative`}>
        
        {/* Physical hardware elements simulating real kiosk installation */}
        <div className="h-6 flex items-center justify-center relative bg-slate-950/40 rounded-t-lg">
          <div className="absolute top-[8px] flex gap-1.5">
            <div className={`w-2 h-2 rounded-full ${soundEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
            <div className="w-20 h-1.5 bg-slate-800 rounded-full" />
          </div>
          <span className="text-[9px] text-slate-500 tracking-[0.2em] font-mono absolute right-4 uppercase">
            Touch Interactive Terminal
          </span>
        </div>

        {/* Screen Content Window */}
        <div className={`${theme.screen} p-3.5 sm:p-5 lg:p-6 pb-3 sm:pb-3 lg:pb-5 flex-grow flex flex-col justify-between h-0 overflow-y-auto rounded-b-xl relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
          
          {/* GLOBAL FLASH-PLAYER TOP HEADER (Visible after language is chosen) */}
          {isLanguageSelected && (
            <div className="-mx-3.5 sm:-mx-5 lg:-mx-6 -mt-3.5 sm:-mt-5 lg:-mt-6 mb-3 sm:mb-4 lg:mb-5 border-b border-slate-800 bg-[#1e293b] text-white flex flex-col sm:flex-row items-stretch justify-between relative z-10 animate-fade-in shadow-md">
              {/* Slant Header Left banner */}
              <div className="flex-grow bg-[#0c4a6e] bg-gradient-to-r from-sky-600 to-cyan-500 text-white px-6 py-2 flex flex-col justify-center relative overflow-hidden rounded-tl-lg min-h-[50px]" style={{ clipPath: "polygon(0 0, 100% 0, 96% 100%, 0% 100%)" }}>
                {/* Dashed border block copy from screenshots */}
                <div className="absolute inset-1.5 border border-dashed border-white/40 rounded-sm pointer-events-none" style={{ clipPath: "polygon(0 0, 100% 0, 96% 100%, 0% 100%)" }} />
                
                <h2 className="text-xs sm:text-sm lg:text-base font-black uppercase tracking-widest relative z-10 text-white font-sans drop-shadow-md">
                  Exchange Rate Simulation
                </h2>
                <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold italic text-sky-100 relative z-10 leading-none mt-0.5 font-sans drop-shadow">
                  An Interactive Guide on Why Exchange Rates Fluctuate
                </p>
              </div>

              {/* Navigation Actions Right (Back and HOME) */}
              <div className="flex items-center gap-3 px-6 py-3 sm:py-0 bg-slate-900 border-t sm:border-t-0 border-slate-800 sm:rounded-tr-lg">
                
                {/* Back pointing Pointer Button */}
                <button
                  id="btn_flash_back"
                  onClick={handleBackAction}
                  className="bg-[#cabea5] hover:bg-[#b5a990] text-[#3e3422] font-black uppercase text-xs sm:text-sm tracking-widest px-4.5 py-2 border border-[#a29175] rounded shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all select-none"
                  title="Previous Step"
                >
                  <span className="text-sm">◀</span>
                  <span>{language === "ms" ? "Kembali" : "Back"}</span>
                </button>

                {/* Home Pentagram Button */}
                <button
                  id="btn_flash_home"
                  onClick={goToWelcomeScreen}
                  className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black tracking-widest text-xs sm:text-sm px-5 py-2 uppercase rounded border border-[#0284c7] bg-gradient-to-b from-[#38bdf8] to-[#0369a1] shadow-md cursor-pointer flex items-center gap-2 transition-all active:scale-95 select-none"
                  title="Main Welcome Language Selection"
                >
                  <Home className="h-4 w-4" />
                  <span>HOME</span>
                </button>
              </div>
            </div>
          )}

          {/* WELCOME / ATTRACTION SCREEN */}
          {currentQuestionIndex === null && !isFinished && !isLearningActive && (
            <div className="flex-grow flex flex-col justify-between py-4 text-center animate-fade-in gap-5 sm:gap-6 relative">
              {/* Header inside screen */}
              <div className="text-center space-y-2 mb-4">
                <motion.span 
                  key={`header-sub-${language}`}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xs sm:text-sm lg:text-base uppercase tracking-[0.25em] font-mono text-yellow-500 font-extrabold block"
                >
                  {language === "ms" ? "Galeri Ekonomi • Kiosk Interaktif" : "Economics Gallery • Interactive Kiosk"}
                </motion.span>
                <motion.h2 
                  key={`header-title-${language}`}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 uppercase tracking-wide block"
                >
                  {language === "ms" ? "Selamat Datang ke Stesen Pertukaran Syiling" : "Welcome to the Coin Exchange Station"}
                </motion.h2>
              </div>

              {/* Three panels layout: Exchange Rate Left, Maps Central, Exchange Rate Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-5 items-start justify-center my-1.5 flex-grow">
                
                {/* 1. Left Rate Widget: USD to RM */}
                <div className="lg:col-span-3 flex flex-col items-center justify-start lg:mt-0">
                  <div className="border-2 border-dashed border-slate-600 rounded-3xl p-6 sm:p-7 bg-slate-950/60 w-full max-w-[260px] text-center space-y-4 shadow-xl">
                    <span className="text-xs sm:text-sm uppercase font-mono tracking-widest font-black text-sky-400 block">
                      USD 1.00 = RM
                    </span>
                    
                    {/* Digit Display (Real-Time Live Rate with Decimals) */}
                    <div className="flex justify-center items-center gap-1.5 py-1">
                      {usdDigits.map((digit, idx) => (
                        <React.Fragment key={idx}>
                          <div
                            className={`bg-slate-900 border-2 text-slate-100 w-12 h-16 flex flex-col items-center justify-center rounded-2xl font-mono text-xl sm:text-2xl lg:text-3xl font-black select-none shadow-md relative overflow-hidden transition-all duration-300 ${
                              usdTrend === "up" 
                                ? "border-emerald-500 text-emerald-400" 
                                : usdTrend === "down" 
                                ? "border-rose-500 text-rose-400" 
                                : "border-slate-700 text-slate-200"
                            }`}
                          >
                            <span className="leading-none">{digit}</span>
                          </div>
                          {idx === 0 && (
                            <span className={`text-3xl font-black font-mono mx-0.5 leading-none self-end pb-3 transition-colors duration-300 ${
                              usdTrend === "up" 
                                ? "text-emerald-400" 
                                : usdTrend === "down" 
                                ? "text-rose-400" 
                                : "text-slate-500"
                            }`}>
                              .
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold leading-none py-1.5 px-2 rounded-full bg-slate-900/60 border border-slate-800/80 mt-1 max-w-[220px] mx-auto">
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${
                        usdTrend === "up" 
                          ? "bg-emerald-500" 
                          : usdTrend === "down" 
                          ? "bg-rose-500" 
                          : "bg-sky-400"
                      }`} />
                      <span className={`truncate ${
                        usdTrend === "up" 
                          ? "text-emerald-400" 
                          : usdTrend === "down" 
                          ? "text-rose-400" 
                          : "text-slate-400"
                      }`}>
                        {language === "ms" 
                          ? (usdTrend === "up" ? "▲ LIVE NAIK" : usdTrend === "down" ? "▼ LIVE TURUN" : "● LIVE KADAR")
                          : (usdTrend === "up" ? "▲ LIVE UP" : usdTrend === "down" ? "▼ LIVE DOWN" : "● LIVE RATE")
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Central Map Canvas (The core exhibit simulation) */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center gap-3 flex-grow">
                  <div className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-[2rem] p-2.5 sm:p-3 shadow-2xl relative">
                    
                    {/* Map SVG representation */}
                    <div className={`w-full ${isBorderless ? "h-[400px]" : "h-[155px] sm:h-[180px] lg:h-[195px]"} relative overflow-hidden bg-slate-950/40 rounded-2xl transition-all duration-300`}>
                      <svg viewBox="0 0 460 220" className="w-full h-full">
                        {/* Define glowing drop-shadow filters */}
                        <defs>
                          <filter id="glow-usa" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Background World Map (Grey coloured) */}
                        <g opacity="0.45" stroke="#334155" strokeWidth="1" fill="#1e293b" className="pointer-events-none">
                          {/* Canada / Northern North America */}
                          <path d="M 28 15 L 180 12 L 195 24 L 180 32 L 165 38 L 148 30 L 135 35 L 115 30 L 90 40 L 65 45 L 50 65 L 42 50 Z" />
                          
                          {/* Greenland */}
                          <path d="M 195 5 L 215 8 L 205 22 L 195 18 Z" />
                          
                          {/* Central & South America */}
                          <path d="M 120 104 L 140 105 L 150 98 L 160 102 L 155 115 L 165 125 L 150 155 L 130 185 L 125 198 L 122 195 L 128 175 L 120 150 L 112 118 Z" />
                          
                          {/* Africa */}
                          <path d="M 145 98 L 175 90 L 185 105 L 180 120 L 170 145 L 158 160 L 152 145 L 142 120 Z" />
                          
                          {/* Europe & Asia (Eurasia) */}
                          <path d="M 230 30 L 290 20 L 350 22 L 410 15 L 440 25 L 435 45 L 450 60 L 430 75 L 390 85 L 350 82 L 310 90 L 290 75 L 260 81 L 245 60 Z" />
                          
                          {/* India & Southern Asia (extends down towards the Peninsula) */}
                          <path d="M 270 70 L 285 78 L 282 85 L 270 82 Z" />
                          
                          {/* Japan */}
                          <path d="M 445 40 L 452 48 L 448 60 L 442 55 Z" />
                          
                          {/* Sumatra / Java / Indonesia */}
                          <path d="M 280 140 L 300 150 L 315 155 Q 310 160, 290 152 Z" />
                          
                          {/* Papua New Guinea */}
                          <path d="M 315 135 L 340 140 L 335 150 L 312 145 Z" />
                          
                          {/* Philippines */}
                          <path d="M 315 105 L 325 110 L 320 125 L 312 120 Z" />
                          
                          {/* New Zealand */}
                          <path d="M 295 190 L 305 205 L 300 215 L 293 200 Z" />
                        </g>

                        {/* Country 1: USA (Top-Left) */}
                        <g 
                          className="group cursor-pointer"
                          onClick={() => {
                            handlePlayClick();
                            setActiveGeo("usa");
                          }}
                        >
                          <path 
                            d="M 50 65 L 65 45 L 90 40 L 115 30 L 135 35 L 148 30 L 165 38 L 180 32 L 190 45 L 200 42 L 210 52 L 205 60 L 218 65 L 210 80 L 190 85 L 180 98 L 160 102 L 150 98 L 140 105 L 130 98 L 120 105 L 95 98 L 80 88 L 65 102 L 50 88 L 52 78 Z" 
                            fill={activeGeo === "usa" ? "#38bdf8" : "#0284c7"} 
                            stroke={activeGeo === "usa" ? "#e0f2fe" : "#0369a1"} 
                            strokeWidth="1.5"
                            className="transition-all duration-300 transform group-hover:scale-105"
                          />
                          {/* USD Badge */}
                          <foreignObject x="110" y="45" width="45" height="26">
                            <div className="bg-[#84cc16] text-[#0f172a] text-[10.5px] font-mono font-black rounded-md px-1.5 py-0.5 shadow-md flex items-center justify-center border border-white/60">
                              USD
                            </div>
                          </foreignObject>
                        </g>
                        {/* Country 3: Malaysia (Center - Peninsular & Sabah/Sarawak) */}
                        <g 
                          className="group cursor-pointer"
                          onClick={() => {
                            handlePlayClick();
                            setActiveGeo("my");
                          }}
                        >
                          {/* West Malaysia Peninsula */}
                          <path 
                            d="M 195 90 C 190 105, 195 125, 218 140 C 220 148, 210 152, 205 142 C 200 130, 185 110, 188 100 Z" 
                            fill={activeGeo === "my" ? "#f87171" : "#ec4899"} 
                            stroke={activeGeo === "my" ? "#fef2f2" : "#be185d"} 
                            strokeWidth="1.5"
                            className="transition-all duration-300 transform group-hover:scale-105"
                          />
                          {/* East Malaysia (Borneo portion) */}
                          <path 
                            d="M 235 120 L 250 115 L 265 105 L 285 92 Q 295 95, 302 105 L 305 118 L 290 128 L 275 124 L 260 132 L 245 128 Z" 
                            fill={activeGeo === "my" ? "#f87171" : "#ec4899"} 
                            stroke={activeGeo === "my" ? "#fef2f2" : "#be185d"} 
                            strokeWidth="1.5"
                            className="transition-all duration-300 transform group-hover:scale-105"
                          />
                          {/* RM Badge */}
                          <foreignObject x="220" y="100" width="38" height="26">
                            <div className="bg-[#475569] text-white text-[10.5px] font-mono font-black rounded-md px-1.5 py-0.5 shadow-md flex items-center justify-center border border-white/60">
                              RM
                            </div>
                          </foreignObject>
                        </g>

                        {/* Country 4: Australia (Bottom) */}
                        <g 
                          className="group cursor-pointer"
                          onClick={() => {
                            handlePlayClick();
                            setActiveGeo("au");
                          }}
                        >
                          <path 
                            d="M 190 158 L 220 145 L 250 150 L 268 162 L 275 178 L 260 195 L 245 198 L 225 204 L 210 200 L 195 192 L 180 180 L 182 168 Z" 
                            fill={activeGeo === "au" ? "#4ade80" : "#22c55e"} 
                            stroke={activeGeo === "au" ? "#f0fdf4" : "#15803d"} 
                            strokeWidth="1.5"
                            className="transition-all duration-300 transform group-hover:scale-105"
                          />
                          {/* Tasmania */}
                          <path 
                            d="M 240 208 L 246 210 L 244 214 Z" 
                            fill={activeGeo === "au" ? "#4ade80" : "#22c55e"} 
                            stroke={activeGeo === "au" ? "#f0fdf4" : "#15803d"} 
                            strokeWidth="1.5"
                          />
                          {/* AUD Badge */}
                          <foreignObject x="254" y="166" width="46" height="26">
                            <div className="bg-[#2563eb] text-white text-[10.5px] font-mono font-black rounded-md px-1.5 py-0.5 shadow-md flex items-center justify-center border border-white/60">
                              AUD
                            </div>
                          </foreignObject>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* Fun-fact interactive strip positioned outside (sibling to the box) */}
                  <div className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-2 sm:p-2.5 text-xs sm:text-sm text-left min-h-[48px] lg:min-h-[54px] flex items-center justify-start gap-2.5 shadow-xl select-none">
                    <div className="bg-amber-500/15 p-1.5 rounded-md text-amber-400 shrink-0">
                      <Info className="h-4 w-4 lg:h-4.5 lg:w-4.5 animate-bounce-slow" />
                    </div>
                    <motion.div 
                      key={`trivia-content-${language}-${activeGeo}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex-grow font-sans"
                    >
                      {activeGeo === "usa" ? (
                        <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                          🇺🇸 <span className="text-sky-400 font-bold">USD (US Dollar)</span>: {language === "ms" ? "Mata wang utama dunia. Simulator kami memaparkan fakta jongkong sejarah sebenar yang digunakan untuk menyokong rizab mata wang antarabangsa!" : "The world's top currency. Our simulator displays real historical bullion facts used to back international currency reserves!"}
                        </p>
                      ) : activeGeo === "my" ? (
                        <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                          🇲🇾 <span className="text-pink-400 font-bold">RM (Malaysian Ringgit)</span>: {language === "ms" ? "\"Ringgit\" secara harfiah bermaksud \"bergigi/bergerigi\" dalam bahasa Melayu—penghormatan sejarah kepada syiling bergerigi yang selamat!" : "\"Ringgit\" literally means \"serrated/milled\" in Malay—a historic tribute to the secure ridged coins!"}
                        </p>
                      ) : activeGeo === "au" ? (
                        <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                          🇦🇺 <span className="text-green-400 font-bold">AUD (Australian Dollar)</span>: {language === "ms" ? "Pelopor lembaran plastik polimer untuk wang kertas bagi mengelakkan koyakan air dan pertindihan!" : "Pioneer of polymer plastic sheets for banknotes to prevent water tearing and duplications!"}
                        </p>
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-400 italic leading-relaxed font-bold">
                          {language === "ms" 
                            ? "👉 Sentuh mana-mana peta negara pada papan interaktif di atas untuk meneroka trivia mata wang sejarah!"
                            : "👉 Touch any country's map on the interactive board above to discover historical currency trivia!"
                          }
                        </p>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* 3. Right Rate Widget: AUD to RM */}
                <div className="lg:col-span-3 flex flex-col items-center justify-start lg:mt-0">
                  <div className="border-2 border-dashed border-slate-600 rounded-3xl p-6 sm:p-7 bg-slate-950/60 w-full max-w-[260px] text-center space-y-4 shadow-xl">
                    <span className="text-xs sm:text-sm uppercase font-mono tracking-widest font-black text-blue-400 block">
                      AUD 1.00 = RM
                    </span>
                    
                    {/* Digit Display (Real-Time Live Rate with Decimals) */}
                    <div className="flex justify-center items-center gap-1.5 py-1">
                      {audDigits.map((digit, idx) => (
                        <React.Fragment key={idx}>
                          <div
                            className={`bg-slate-900 border-2 text-slate-100 w-12 h-16 flex flex-col items-center justify-center rounded-2xl font-mono text-xl sm:text-2xl lg:text-3xl font-black select-none shadow-md relative overflow-hidden transition-all duration-300 ${
                              audTrend === "up" 
                                ? "border-emerald-500 text-emerald-400" 
                                : audTrend === "down" 
                                ? "border-rose-500 text-rose-400" 
                                : "border-slate-700 text-slate-200"
                            }`}
                          >
                            <span className="leading-none">{digit}</span>
                          </div>
                          {idx === 0 && (
                            <span className={`text-3xl font-black font-mono mx-0.5 leading-none self-end pb-3 transition-colors duration-300 ${
                              audTrend === "up" 
                                ? "text-emerald-400" 
                                : audTrend === "down" 
                                ? "text-rose-400" 
                                : "text-slate-500"
                            }`}>
                              .
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold leading-none py-1.5 px-2 rounded-full bg-slate-900/60 border border-slate-800/80 mt-1 max-w-[220px] mx-auto">
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${
                        audTrend === "up" 
                          ? "bg-emerald-500" 
                          : audTrend === "down" 
                          ? "bg-rose-500" 
                          : "bg-sky-400"
                      }`} />
                      <span className={`truncate ${
                        audTrend === "up" 
                          ? "text-emerald-400" 
                          : audTrend === "down" 
                          ? "text-rose-400" 
                          : "text-slate-400"
                      }`}>
                        {language === "ms" 
                          ? (audTrend === "up" ? "▲ LIVE NAIK" : audTrend === "down" ? "▼ LIVE TURUN" : "● LIVE KADAR")
                          : (audTrend === "up" ? "▲ LIVE UP" : audTrend === "down" ? "▼ LIVE DOWN" : "● LIVE RATE")
                        }
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom row: Kids Avatars Speech Bubble + Pink Language Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-end mt-4 lg:mt-5">
                
                {/* Kids Speaking Left: Blonde Mia */}
                <div className={`lg:col-span-3 md:col-span-4 flex flex-col items-center justify-end h-full relative transition-all duration-300 ${isBorderless ? "-translate-y-24 sm:-translate-y-32 lg:-translate-y-40" : "-translate-y-10 sm:-translate-y-12 lg:-translate-y-14"}`}>
                  {/* speech bubble */}
                  <div className="bg-[#b3c10a] text-slate-950 font-black px-3.5 py-2 rounded-2xl border-2 border-dashed border-white shadow-xl relative mb-2 w-full max-w-[200px]">
                    <motion.div 
                      key={`speech-left-bubble-${language}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="font-mono text-[10px] sm:text-xs leading-none select-none tracking-tight"
                    >
                      {language === "ms" ? "SILA PILIH BAHASA ..." : "CHOOSE YOUR LANGUAGE ..."}
                    </motion.div>
                    {/* Tail */}
                    <div className="absolute -bottom-2.5 left-[40%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-[#b3c10a]" />
                  </div>
                  {/* vector head */}
                  <div className={`flex items-end ${isBorderless ? "h-28 sm:h-32 lg:h-36" : "h-24 sm:h-28"}`}>
                    <svg viewBox="0 0 120 120" className={`${isBorderless ? "w-28 h-28 sm:w-32 h-32 lg:w-36 lg:h-36" : "w-24 h-24 sm:w-28 sm:h-28"} drop-shadow-xl animate-bounce-slow`}>
                      <path d="M 15 65 Q 15 25 60 20 Q 105 25 105 65 Q 120 80 110 90 Q 95 65 95 70 Q 70 85 60 85 Q 50 85 25 70 Q 25 65 10 90 Q 0 80 15 65 Z" fill="#facc15" stroke="#eab308" strokeWidth="2" />
                      <circle cx="60" cy="65" r="34" fill="#ffeeeb" />
                      <path d="M 27 50 Q 60 30 93 50 Q 80 25 60 40 Q 40 25 27 50" fill="#facc15" />
                      <circle cx="45" cy="60" r="4.5" fill="#1e293b" />
                      <circle cx="75" cy="60" r="4.5" fill="#1e293b" />
                      <circle cx="43" cy="58" r="1.5" fill="#ffffff" />
                      <circle cx="73" cy="58" r="1.5" fill="#ffffff" />
                      <ellipse cx="32" cy="68" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />
                      <ellipse cx="88" cy="68" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />
                      <motion.path 
                        d="M 45 73 Q 60 86 75 73" 
                        animate={{
                          d: [
                            "M 45 73 Q 60 86 75 73",
                            "M 45 73 Q 60 94 75 73",
                            "M 45 73 Q 60 76 75 73",
                            "M 45 73 Q 60 86 75 73"
                          ]
                        }}
                        transition={{
                          duration: 1.0,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatDelay: 0.1
                        }}
                        stroke="#000" 
                        strokeWidth="3" 
                        fill="none" 
                        strokeLinecap="round" 
                      />
                    </svg>
                  </div>
                </div>

                {/* Central Pink Buttons */}
                <div className={`lg:col-span-6 md:col-span-4 flex flex-col justify-center gap-2.5 py-2 ${isBorderless ? "max-w-[300px]" : "max-w-[340px]"} mx-auto w-full relative transition-all duration-350 ${isBorderless ? "-translate-y-2 sm:-translate-y-3 lg:-translate-y-4" : "-translate-y-10 sm:-translate-y-12 lg:-translate-y-14"}`}>
                  
                  {/* Option 1: BAHASA MALAYSIA */}
                  <button
                    id="btn_lang_ms"
                    onClick={() => {
                      setLanguage("ms");
                      startLearningMode();
                    }}
                    className={`w-full bg-[#e12a6f] hover:bg-[#c21e59] text-white font-black italic rounded-xl border border-dashed border-white uppercase tracking-wider transition-all active:scale-95 shadow-[0_4px_12px_rgba(225,42,111,0.4)] flex items-center justify-center gap-2 cursor-pointer font-sans py-3 text-xs sm:text-sm`}
                  >
                    🚀 Bahasa Malaysia
                  </button>

                  {/* Option 2: ENGLISH */}
                  <button
                    id="btn_lang_en"
                    onClick={() => {
                      setLanguage("en");
                      startLearningMode();
                    }}
                    className={`w-full bg-[#e12a6f] hover:bg-[#c21e59] text-white font-black italic rounded-xl border border-dashed border-white uppercase tracking-wider transition-all active:scale-95 shadow-[0_4px_12px_rgba(225,42,111,0.4)] flex items-center justify-center gap-2 cursor-pointer font-sans py-3 text-xs sm:text-sm`}
                  >
                    🌐 English
                  </button>

                  <motion.p 
                    key={`select-lang-hint-${language}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-[10px] text-slate-400 text-center font-bold italic mt-1 font-mono uppercase tracking-widest select-none"
                  >
                    {language === "ms" ? "Pilih bahasa untuk mulakan kuiz" : "Select language to launch quiz"}
                  </motion.p>
                </div>

                {/* Kids Speaking Right: Brown Leo */}
                <div className={`lg:col-span-3 md:col-span-4 flex flex-col items-center justify-end h-full relative transition-all duration-300 ${isBorderless ? "-translate-y-24 sm:-translate-y-32 lg:-translate-y-40" : "-translate-y-10 sm:-translate-y-12 lg:-translate-y-14"}`}>
                  {/* speech bubble */}
                  <div className="bg-[#b3c10a] text-slate-950 font-black px-3.5 py-2 rounded-2xl border-2 border-dashed border-white shadow-xl relative mb-2 w-full max-w-[200px]">
                    <motion.div 
                      key={`speech-right-bubble-${language}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="font-mono text-[10px] sm:text-xs leading-none select-none tracking-tight"
                    >
                      {language === "ms" ? "PILIH BAHASA ANDA ..." : "CHOOSE YOUR LANGUAGE ..."}
                    </motion.div>
                    {/* Tail */}
                    <div className="absolute -bottom-2.5 left-[60%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-[#b3c10a]" />
                  </div>
                  {/* vector head */}
                  <div className={`flex items-end ${isBorderless ? "h-28 sm:h-32 lg:h-36" : "h-24 sm:h-28"}`}>
                    <svg viewBox="0 0 120 120" className={`${isBorderless ? "w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36" : "w-24 h-24 sm:w-28 sm:h-28"} drop-shadow-xl animate-bounce-slow`} style={{ animationDelay: "0.2s" }}>
                      <circle cx="21" cy="66" r="11" fill="#ffeeeb" stroke="#f97316" strokeWidth="0.5" />
                      <circle cx="99" cy="66" r="11" fill="#ffeeeb" stroke="#f97316" strokeWidth="0.5" />
                      <circle cx="60" cy="65" r="34" fill="#ffeeeb" />
                      <path d="M 26 55 Q 18 10 60 18 Q 102 12 94 55 Q 85 28 60 38 Q 35 28 26 55" fill="#7c2d12" stroke="#451a03" strokeWidth="1" />
                      <circle cx="45" cy="60" r="4.5" fill="#1e293b" />
                      <circle cx="75" cy="60" r="4.5" fill="#1e293b" />
                      <circle cx="43" cy="58" r="1.5" fill="#ffffff" />
                      <circle cx="73" cy="58" r="1.5" fill="#ffffff" />
                      <ellipse cx="32" cy="68" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />
                      <ellipse cx="88" cy="68" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />
                      <motion.path 
                        d="M 45 73 Q 60 86 75 73" 
                        animate={{
                          d: [
                            "M 45 73 Q 60 86 75 73",
                            "M 45 73 Q 60 76 75 73",
                            "M 45 73 Q 60 94 75 73",
                            "M 45 73 Q 60 86 75 73"
                          ]
                        }}
                        transition={{
                          duration: 1.1,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatDelay: 0.15
                        }}
                        stroke="#000" 
                        strokeWidth="3" 
                        fill="none" 
                        strokeLinecap="round" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEARNING INFO PHASE */}
          {isLearningActive && (
            <div className="flex-grow flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch animate-fade-in text-left">
              
              {/* Left Column (38%) - Guides giving advice */}
              <div className="lg:w-[38%] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/60 pb-3 lg:pb-0 lg:pr-5">
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[10px] lg:text-xs uppercase font-black tracking-widest rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                      {language === "ms" ? "MOD BELAJAR" : "LEARNING MODE"}
                    </span>
                    <span className="text-xs font-black font-mono text-slate-400">
                      {LOC_TEXT[language].slideProgress} {learningStep + 1} {language === "ms" ? "daripada" : "of"} 3
                    </span>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="w-full bg-slate-950/60 rounded-full h-2 overflow-hidden border border-slate-850">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      style={{ width: `${((learningStep + 1) / 3) * 100}%` }}
                    />
                  </div>

                  <h3 className={`text-base sm:text-lg lg:text-xl text-slate-100 font-extrabold leading-tight tracking-tight ${theme.fontClass}`}>
                    {learningStep === 0 && LOC_TEXT[language].lesson1Title}
                    {learningStep === 1 && LOC_TEXT[language].lesson2Title}
                    {learningStep === 2 && LOC_TEXT[language].lesson3Title}
                  </h3>
                </div>

                {/* Kids Speaking Box */}
                <div className="mt-3 lg:mt-4">
                  <AnimatedKids 
                    mood={learningStep === 2 && selectedCoinEdge === "reeded" ? "correct" : "thinking"} 
                    language={language}
                    interactiveSpeech={
                      learningStep === 0 
                        ? (language === "ms" 
                            ? "Kurator Mia di sini! Cuba seret penunjuk kadar perdagangan di sisi untuk melihat berapa banyak MYR yang anda dapat apabila USD/AUD anda semakin kukuh!" 
                            : "Curator Leo here! Try dragging the trade slider on the side to see how many MYR you get when your USD/AUD gains strength!")
                        : learningStep === 1
                          ? (language === "ms" 
                              ? "Kader pertukaran melantun seperti bola getah! Cuba ketik DEPRESIASI, APRESIASI, atau MEKANIK di sebelah untuk melihat bagaimana bekalan dan permintaan mempengaruhi nilai mata wang! 📉📈" 
                              : "Exchange rates bounce like a rubber ball! Try tapping DEPRECIATION, APRECIATION, or MECHANICS on the side to see how supply and demand affect currency value! 📉📈")
                          : selectedCoinEdge === "smooth"
                            ? (language === "ms" 
                                ? "Seret tetapan tepi di atas! Syiling licin sangat berbahaya kerana pencuri cukur emas akan memotong rim logam, menyebabkan syiling itu tidak bernilai! 😲" 
                                : "Drag the edge setting above! Smooth coins are super dangerous because gold-shaving thieves will clip off the metal rims, making the coins worthless! 😲")
                            : (language === "ms" 
                                ? "Luar biasa! Garisan bergerigi (reeding keselamatan) serta-merta memberi tahu orang ramai jika emas telah dicukur. Sir Isaac Newton mencipta ciri ini semasa menjadi Pengurus Penempaan Wang! 🥇" 
                                : "Amazing! Reeded ridges (security reeding) instantly alert people if the gold was shaved off. Sir Isaac Newton invented this as Master of the Mint! 🥇")
                    }
                  />
                </div>
              </div>

              {/* Right Column (62%) - Educational Interactive Games */}
              <div className="lg:w-[62%] flex flex-col justify-between pl-0 lg:pl-5 mt-4 lg:mt-0">
                <div className="space-y-3 lg:space-y-4 flex-grow text-left">
                  {learningStep === 0 ? (
                    // Step 1: Exchange Markets Game
                    <div className="space-y-3 bg-slate-950/40 p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-2xl">
                      <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm sm:text-base uppercase tracking-wider">
                        <Coins className="h-4.5 w-4.5" />
                        {LOC_TEXT[language].liveExchangeSim}
                      </div>
                      
                      <p className="text-sm sm:text-base text-slate-300 leading-normal font-semibold">
                        {LOC_TEXT[language].swapDescription} <span className="text-[#fbbf24] font-black">{LOC_TEXT[language].goldenExplorerTokens}</span>:
                      </p>

                      <div className="bg-slate-900/85 p-3.5 sm:p-4 rounded-xl border border-slate-850/80 space-y-4">
                        <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
                          <span>{LOC_TEXT[language].setExchangeRate}</span>
                          <span className="text-indigo-400 font-black bg-indigo-500/10 px-2.5 py-1 rounded font-mono border border-indigo-500/15 text-xs sm:text-sm">
                            1 USD/AUD = {localExchangeRate} MYR
                          </span>
                        </div>
                        
                        <input 
                          type="range"
                          min="1"
                          max="5"
                          value={localExchangeRate}
                          onChange={(e) => {
                            setLocalExchangeRate(Number(e.target.value));
                            handlePlayClick();
                          }}
                          className="w-full h-2 bg-slate-705 cursor-pointer accent-indigo-500 rounded-lg focus:outline-none"
                        />
                        
                        <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-850/60 text-center">
                          <div className="p-2 sm:p-3 bg-slate-950/60 rounded-lg border border-slate-850">
                            <span className="text-xs text-slate-550 block uppercase font-mono mb-1 font-bold">{LOC_TEXT[language].wallet}</span>
                            <span className="text-sm sm:text-base font-black text-amber-400 flex items-center justify-center gap-1 font-sans">
                              💵 10 USD / AUD
                            </span>
                          </div>
                          
                          <div className="p-2 sm:p-3 bg-slate-950/60 rounded-lg border border-slate-850">
                            <span className="text-xs text-slate-455 block uppercase font-mono mb-1 font-bold">{LOC_TEXT[language].receivedTrade}</span>
                            <span className="text-sm sm:text-base font-black text-indigo-300 flex items-center justify-center gap-1 font-sans">
                              🇲🇾 RM {10 * localExchangeRate} MYR
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-indigo-955/15 rounded-lg border border-indigo-500/15 text-xs sm:text-sm text-indigo-205 leading-normal text-left font-sans font-bold">
                        <strong>{LOC_TEXT[language].curatorHint}</strong> {language === "ms" ? LOC_TEXT.ms.exchangeHint : LOC_TEXT.en.exchangeHint}
                      </div>
                    </div>
                  ) : learningStep === 1 ? (
                    // Step 2: How Do Exchange Rates Work (Integrated interactive panels)
                    <div className="space-y-3 bg-slate-950/40 p-3.5 sm:p-4.5 rounded-2xl border border-slate-800/80 shadow-2xl">
                      
                      {/* Top segment: Description on Why Exchange Rates Fluctuate */}
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                          <Sliders className="h-4 w-4 text-amber-400" />
                          {LOC_TEXT[language].flashHowWorkTitle}
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-355 leading-normal font-medium">
                          {language === "ms"
                            ? "Kadar ditentukan oleh kuasa bekalan dan permintaan global. Apabila eksport meningkat, mata wang mengukuh (apresiasi). Jika bekalan tunai berlebihan, nilai mata wang boleh melemah (depresiasi)."
                            : "Exchange rates are driven by international supply and demand. When exports are high, currency value strengthens (appreciation). Excessive money supply leads to values weakening (depreciation)."}
                        </p>
                      </div>

                      {/* The Interactive Board from original segment but elevated */}
                      <div className="space-y-2.5 pt-2 border-t border-slate-855">
                        <div className="flex items-center justify-between text-left">
                          <span className="text-[10px] sm:text-xs font-black text-[#b4c20f] uppercase tracking-wider">
                            Interactive Topic Exploration
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono tracking-widest hidden sm:inline">
                            {LOC_TEXT[language].flashSelectTopicBelow}
                          </span>
                        </div>

                        {/* Interactive columns: Horizontal layout of 3 buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              handlePlayClick();
                              setActiveHowWorkTopic("depreciation");
                            }}
                            className={`p-1.5 sm:p-2 rounded-lg border text-center cursor-pointer transition-all flex items-center justify-center gap-1 font-sans font-black text-[10px] sm:text-xs ${
                              activeHowWorkTopic === "depreciation"
                                ? "bg-amber-950/45 border-[#b3c10a] text-amber-205 shadow-md"
                                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                            }`}
                          >
                            <span className="text-rose-500 font-extrabold shadow-sm">▼</span>
                            <span className="tracking-wider text-[9px] sm:text-[10.5px] uppercase">{language === "ms" ? "DEPRESIASI" : "DEPREC."}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handlePlayClick();
                              setActiveHowWorkTopic("appreciation");
                            }}
                            className={`p-1.5 sm:p-2 rounded-lg border text-center cursor-pointer transition-all flex items-center justify-center gap-1 font-sans font-black text-[10px] sm:text-xs ${
                              activeHowWorkTopic === "appreciation"
                                ? "bg-indigo-950/45 border-[#b3c10a] text-indigo-300 shadow-md"
                                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-855"
                            }`}
                          >
                            <span className="text-emerald-400 font-extrabold shadow-sm">▲</span>
                            <span className="tracking-wider text-[9px] sm:text-[10.5px] uppercase">{language === "ms" ? "APRESIASI" : "APPREC."}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handlePlayClick();
                              setActiveHowWorkTopic("mechanics");
                            }}
                            className={`p-1.5 sm:p-2 rounded-lg border text-center cursor-pointer transition-all flex items-center justify-center gap-1 font-sans font-black text-[10px] sm:text-xs ${
                              activeHowWorkTopic === "mechanics"
                                ? "bg-cyan-950/45 border-[#b3c10a] text-cyan-205 shadow-md"
                                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-855"
                            }`}
                          >
                            <span className="text-cyan-400 font-extrabold shadow-sm">⚙</span>
                            <span className="tracking-wider text-[9px] sm:text-[10.5px] uppercase">{language === "ms" ? "MEKANIK" : "MECH."}</span>
                          </button>
                        </div>

                        {/* Dynamic Output Box Col */}
                        <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-xl border border-slate-850 flex flex-col justify-between text-left text-xs min-h-[92px] sm:min-h-[102px]">
                          {activeHowWorkTopic ? (
                            <div className="space-y-2 animate-fade-in pb-1">
                              <span className="text-sm uppercase tracking-widest text-[#fbbf24] font-black font-mono flex items-center gap-1.5">
                                {activeHowWorkTopic === "depreciation" && "🔻 " + LOC_TEXT[language].flashDepreciation}
                                {activeHowWorkTopic === "appreciation" && "🔺 " + LOC_TEXT[language].flashAppreciation}
                                {activeHowWorkTopic === "mechanics" && "⚙️ " + LOC_TEXT[language].flashMechanics}
                              </span>
                              <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-bold font-sans">
                                {activeHowWorkTopic === "depreciation" && LOC_TEXT[language].flashDepreciationDesc}
                                {activeHowWorkTopic === "appreciation" && LOC_TEXT[language].flashAppreciationDesc}
                                {activeHowWorkTopic === "mechanics" && LOC_TEXT[language].flashMechanicsDesc}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-[#94a3b8] italic text-sm sm:text-base text-center py-4">
                              <p className="leading-normal font-bold">{LOC_TEXT[language].flashSelectTopicBelow}</p>
                            </div>
                          )}

                          {/* USA / Malaysia Mini-Banner representation (Screenshot 3) */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900 text-xs sm:text-sm text-slate-400">
                            <div className="flex items-center gap-1.5 bg-blue-950/30 px-2 py-0.5 rounded border border-blue-900/20 font-sans">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                              <span className="font-bold text-xs sm:text-sm">USA (USD)</span>
                            </div>
                            <div className="font-mono text-center text-[#b3c10a] font-black text-xs sm:text-sm">
                              USD 1.00 = RM {activeHowWorkTopic === "depreciation" ? "4.50" : activeHowWorkTopic === "appreciation" ? "2.50" : "3.00"}
                            </div>
                            <div className="flex items-center gap-1.5 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/20 font-sans">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              <span className="font-bold text-xs sm:text-sm">Malaysia (RM)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Clean relevant curator Tip at bottom */}
                      <div className="p-3.5 bg-amber-955/15 rounded-xl border border-amber-500/15 text-xs sm:text-sm text-amber-200 leading-normal text-left font-sans font-bold">
                        <strong>Petunjuk:</strong> {language === "ms" 
                          ? "Kadar tidak statik. Pihak Berkuasa mengimbangi prestasi mata wang untuk membantu perdagangan global dan kestabilan domestik."
                          : "Managers carefully monitor these currency rates to optimally balance both import costs and global export competitiveness."
                        }
                      </div>
                    </div>
                  ) : (
                    // Step 3: Security & Trust Game
                    <div className="space-y-3 bg-slate-950/40 p-4 sm:p-4.5 rounded-2xl border border-slate-800/80 shadow-2xl animate-fade-in">
                      <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm sm:text-base uppercase tracking-wider">
                        <Award className="h-4.5 w-4.5" />
                        {LOC_TEXT[language].securingTrustLab}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-355 leading-normal font-medium">
                        {LOC_TEXT[language].securingTrustDesc}
                      </p>

                      <div className="bg-slate-900/85 p-3 rounded-xl border border-slate-850 space-y-3">
                        <span className="text-[11px] sm:text-xs font-black font-mono text-slate-400 block mb-1 uppercase tracking-wider">{LOC_TEXT[language].setCoinEdge}</span>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCoinEdge("smooth");
                              handlePlayClick();
                            }}
                            className={`p-2.5 sm:p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                              selectedCoinEdge === "smooth"
                                ? "bg-rose-955/35 border-rose-500 text-rose-205 font-black shadow-md text-sm sm:text-sm"
                                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 text-sm sm:text-sm"
                            }`}
                          >
                            <span className="block text-sm sm:text-base font-bold">{LOC_TEXT[language].smoothRim}</span>
                            <span className="text-[10.5px] font-mono leading-none block mt-1">{language === "ms" ? "Mudah Dicukur" : "Easy to Shave / Clip"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCoinEdge("reeded");
                              handlePlayClick();
                            }}
                            className={`p-2.5 sm:p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                              selectedCoinEdge === "reeded"
                                ? "bg-emerald-955/35 border-emerald-500 text-emerald-205 font-black shadow-md text-sm sm:text-sm"
                                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 text-sm sm:text-sm"
                            }`}
                          >
                            <span className="block text-sm sm:text-base font-bold">{LOC_TEXT[language].reededRidges}</span>
                            <span className="text-[10.5px] font-mono leading-none block mt-1">{language === "ms" ? "Tepi Ridged Selamat" : "Secure Ridged Edges"}</span>
                          </button>
                        </div>

                        {/* Visual coin representation scaled down */}
                        <div className="flex flex-col items-center py-1 h-[78px] justify-center">
                          <div className={`w-13 h-13 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 flex items-center justify-center relative shadow-md ${
                            selectedCoinEdge === "reeded" 
                              ? "border-[3.5px] border-dashed border-amber-250 animate-spin-slow" 
                              : "border-[1.5px] border-amber-300"
                          }`}>
                            <span className="text-xs font-mono font-black text-amber-955 bg-yellow-450/45 px-1 rounded">Au</span>
                            
                            {/* Visual indicator of shaved coin */}
                            {selectedCoinEdge === "smooth" && (
                              <span className="absolute -bottom-1.5 text-[10px] bg-red-600 text-white font-mono rounded px-2 animate-pulse leading-none py-0.5 font-bold tracking-wider font-sans">
                                {LOC_TEXT[language].shaveRisk}
                              </span>
                            )}
                            {selectedCoinEdge === "reeded" && (
                              <span className="absolute -bottom-1.5 text-[10px] bg-emerald-600 text-white font-mono rounded px-2 animate-pulse leading-none py-0.5 font-bold tracking-wider font-sans">
                                {LOC_TEXT[language].safeIntegral}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-indigo-950/20 rounded-lg border border-indigo-500/15 text-xs sm:text-sm text-indigo-200 leading-normal font-semibold font-sans">
                        <strong>{LOC_TEXT[language].newtonDiscovery}</strong> {language === "ms" ? LOC_TEXT.ms.newtonHint : LOC_TEXT.en.newtonHint}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation and Actions Row */}
                <div className="pt-3 border-t border-slate-905 flex items-center justify-between gap-4 mt-4">
                  {/* Slider indicator dots */}
                  <div className="flex gap-2 font-sans">
                    {[0, 1, 2].map((s) => (
                      <div 
                        key={s} 
                        className={`h-2.5 rounded-full transition-all ${
                          learningStep === s
                            ? "w-6 bg-emerald-400"
                            : "w-2.5 bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    id="btn_next_learning"
                    onClick={nextLearningStep}
                    disabled={learningStep === 2 && selectedCoinEdge !== "reeded"}
                    className={`${theme.accentColor} font-black py-2.5 px-6 rounded-xl transform active:scale-95 transition-all text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-md disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <span>
                      {learningStep < 2 
                        ? LOC_TEXT[language].nextLesson 
                        : selectedCoinEdge === "smooth"
                          ? LOC_TEXT[language].selectRidgesBorder
                          : LOC_TEXT[language].commenceQuiz}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ACTIVE QUIZ SCREEN */}
          {currentQuestionIndex !== null && !isFinished && !isLearningActive && currentQuestion && (
            showQuizIntro ? (
              // Flash Screen 4: Test Your Knowledge Intro
              <div className="flex-grow flex flex-col lg:flex-row gap-8 items-stretch animate-fade-in text-left">
                {/* Left side: kids guidance bubble */}
                <div className="lg:w-[40%] flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-800/60 pb-6 lg:pb-0 lg:pr-8">
                  <AnimatedKids 
                    mood="victory" 
                    language={language}
                    interactiveSpeech={
                      language === "ms"
                        ? "Hebat sekali! Sekarang anda telah menguasai asas, mari uji pengetahuan am anda tentang bagaimana kadar pertukaran memberi kesan kepada barangan harian kita! Adakah anda bersedia? 🧠"
                        : "Awesome job! Now that you've mastered the basics, let's test your general knowledge and see how exchange rates affect our everyday shopping! Are you ready? 🧠"
                    }
                  />
                </div>

                {/* Right side: Flash styling "TEST YOUR KNOWLEDGE" */}
                <div className="lg:w-[60%] flex flex-col justify-between pl-0 lg:pl-6 text-left">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="border-b border-slate-800 pb-2">
                      <h3 className="text-lg sm:text-xl font-black text-amber-400 tracking-wider">
                        {LOC_TEXT[language].flashTestKnowledgeTitle}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono tracking-widest uppercase block mt-1 font-bold">
                        {LOC_TEXT[language].flashSelectTopicBelow}
                      </span>
                    </div>

                    {/* The 3 Topic Blocks */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center shadow-md">
                        <span className="text-[10px] sm:text-[11px] font-black text-sky-400 select-none cursor-default font-mono block leading-tight tracking-wider">
                          {LOC_TEXT[language].flashTopicHowPay}
                        </span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center shadow-md">
                        <span className="text-[10px] sm:text-[11px] font-black text-rose-400 select-none cursor-default font-mono block leading-tight tracking-wider">
                          {LOC_TEXT[language].flashTopicWhereBuy}
                        </span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center shadow-md">
                        <span className="text-[10px] sm:text-[11px] font-black text-amber-400 select-none cursor-default font-mono block leading-tight tracking-wider">
                          {LOC_TEXT[language].flashTopicWhenBuy}
                        </span>
                      </div>
                    </div>

                    {/* Big Marker Crayon Box */}
                    <div className="bg-amber-950/15 border border-dashed border-amber-500/30 p-4 rounded-xl text-center shadow-md relative my-3">
                      {/* White dashed inner border */}
                      <div className="absolute inset-1 border border-dashed border-amber-500/10 pointer-events-none rounded-lg" />
                      
                      <p className="text-amber-450 font-black text-xs sm:text-sm leading-normal tracking-wide select-none font-sans drop-shadow-md uppercase">
                        "{LOC_TEXT[language].flashKnowledgeIntroText}"
                      </p>
                    </div>

                    {/* Cartoon head centered on Malaysia pink map (Screenshot 4) */}
                    <div className="mt-3 flex flex-col items-center justify-center p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                      <div className="flex items-center gap-4">
                        {/* Pink map outline simulated */}
                        <div className="relative w-14 h-14 bg-rose-500/15 border border-rose-500/30 rounded-full flex items-center justify-center overflow-hidden">
                          <svg viewBox="0 0 120 120" className="w-10 h-10">
                            <circle cx="60" cy="65" r="34" fill="#ffeeeb" />
                            <circle cx="45" cy="60" r="4.5" fill="#1e293b" />
                            <circle cx="75" cy="60" r="4.5" fill="#1e293b" />
                            <path d="M 45 73 Q 60 86 75 73" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                          </svg>
                          <span className="absolute bottom-1 bg-slate-950/90 px-1 py-0.5 text-[8px] font-mono font-black text-rose-305 border border-rose-500/30 rounded leading-none">RM</span>
                        </div>
                        <div className="space-y-0.5 text-left">
                          <span className="text-[10px] font-bold font-mono text-slate-500 block uppercase tracking-wider">Simulating:</span>
                          <p className="text-xs font-black text-slate-200">
                            {language === "ms" ? "Cabaran Ekonomi Galeri Interaktif" : "Interactive Economics Gallery Challenge"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COMMENCE ACTION BUTTON */}
                  <div className="mt-3">
                    <button
                      type="button"
                      id="btn_launch_quiz"
                      onClick={startQuiz}
                      className="w-full bg-[#e12a6f] hover:bg-[#c21e59] text-white font-black italic px-6 py-3.5 rounded-xl border-2 border-dashed border-white uppercase tracking-wider text-xs sm:text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer font-sans"
                    >
                      {LOC_TEXT[language].flashStartTopicQuiz}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col lg:flex-row gap-8 items-stretch font-sans">
              
              {/* Left Column: Question, progress, avatar feedback (45%) */}
              <div className="lg:w-[45%] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/60 pb-4 lg:pb-0 lg:pr-8 text-left">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 text-[11px] uppercase font-extrabold tracking-widest rounded-md border ${theme.tagBg}`}>
                      {currentQuestion.category}
                    </span>
                    <span className="text-xs font-black font-mono text-slate-450">
                      QUESTION {currentQuestionIndex + 1} OF {questions.length}
                    </span>
                  </div>

                  {/* Horizontal Progress bar */}
                  <div className="w-full bg-slate-950/60 rounded-full h-2 overflow-hidden border border-slate-900">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Label */}
                  <h3 className={`text-[17px] sm:text-xl lg:text-2xl text-slate-100 font-black leading-snug tracking-tight ${theme.fontClass}`}>
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Left Assistant Avataring */}
                <div className="mt-4">
                  <AnimatePresence mode="wait">
                    {selectedOption !== null ? (
                      <motion.div 
                        key={`kids-answer-${selectedOption}`} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <AnimatedKids 
                          mood={selectedOption === currentQuestion.correctAnswerIndex ? "correct" : "incorrect"} 
                          language={language}
                          interactiveSpeech={
                            selectedOption === currentQuestion.correctAnswerIndex 
                              ? (language === "ms" 
                                  ? "Syabas! Jawapan itu betul sekali! Marilah kita raikan kejayaan kita! ⭐" 
                                  : "Super job! That is absolutely correct! Golden stars for you! ⭐")
                              : (language === "ms" 
                                  ? "Hampir tepat! Saya mempunyai beberapa petunjuk sejarah menarik di bawah untuk membantu anda:" 
                                  : "Almost! I have some cool historical tips below to help you:")
                          }
                        />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="kids-thinking" 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <AnimatedKids mood="thinking" language={language} />
                        <div className="text-center text-slate-400 text-xs uppercase font-black tracking-widest mt-2 font-mono">
                          💭 {LOC_TEXT[language].selectAnswerOnSide}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Choices and explanation details (55%) */}
              <div className="lg:w-[55%] flex flex-col justify-between pl-0 lg:pl-5 mt-4 lg:mt-0 text-left">
                
                {/* 4 Large Touch-Optimized Option Keys is laid out in 2x2 grid for wide layouts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectAnswer = idx === currentQuestion.correctAnswerIndex;
                    
                    let btnStyle = theme.optionDefault + " border";
                    if (selectedOption !== null) {
                      if (isCorrectAnswer) {
                        btnStyle = theme.optionCorrect;
                      } else if (isSelected) {
                        btnStyle = theme.optionIncorrect;
                      } else {
                        btnStyle = "bg-slate-950/20 text-slate-600 border-slate-950/40 opacity-30 border";
                      }
                    }

                    return (
                      <button
                        id={`btn_option_${idx}`}
                        key={idx}
                        onClick={() => selectAnswer(idx)}
                        disabled={selectedOption !== null}
                        className={`${btnStyle} min-h-[48px] text-left p-3.5 rounded-xl text-sm transition-all focus:outline-none flex items-center justify-between gap-3.5 cursor-pointer font-bold shadow-md`}
                      >
                        <span className="leading-normal font-bold">{option}</span>
                        {selectedOption !== null && isCorrectAnswer && (
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0 font-sans" />
                        )}
                        {selectedOption !== null && isSelected && !isCorrectAnswer && (
                          <XCircle className="h-4.5 w-4.5 text-red-400 flex-shrink-0 font-sans" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanations container responding with nice transition height */}
                <div className="mt-3 min-h-[110px] flex flex-col justify-end">
                  <AnimatePresence mode="wait">
                    {selectedOption !== null && (
                      <motion.div 
                        key="explanation-details" 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-950/85 p-3.5 rounded-xl border border-slate-800 space-y-2"
                      >
                        {/* Interactive Header Notification */}
                        <span className={`text-xs font-black uppercase tracking-widest block font-mono ${
                          selectedOption === currentQuestion.correctAnswerIndex ? "text-emerald-400" : "text-amber-400"
                        }`}>
                          {selectedOption === currentQuestion.correctAnswerIndex ? LOC_TEXT[language].correctNotification : LOC_TEXT[language].lessonNotification}
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-900">
                          {/* Children's level description */}
                          <div>
                            <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold text-xs uppercase font-mono tracking-wider">
                              <Sparkles className="h-4 w-4" />
                              {LOC_TEXT[language].forJuniorCollectors}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 italic mt-1 leading-relaxed font-sans font-medium">
                              "{currentQuestion.childHint}"
                            </p>
                          </div>
                          
                          {/* Adult descriptive details */}
                          <div>
                            <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-xs uppercase font-mono tracking-wider">
                              <GraduationCap className="h-4 w-4" />
                              {LOC_TEXT[language].forCuriousAdults}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-250 mt-1 leading-relaxed font-sans font-medium">
                              {currentQuestion.adultDetail}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 flex justify-end border-t border-slate-900 font-sans">
                          <button
                            id="btn_next_question"
                            onClick={nextQuestion}
                            className={`${theme.accentColor} font-black py-3 px-6 rounded-xl transform active:scale-95 transition-all text-xs sm:text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-lg ml-auto`}
                          >
                            <span>{currentQuestionIndex < questions.length - 1 ? LOC_TEXT[language].nextQuestion : LOC_TEXT[language].viewFinalScore}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </div>
            )
          )}

          {/* COMPASS COMPLETED / RESULTS CONSOLE */}
          {isFinished && (
            <div className="flex-grow flex flex-col md:flex-row gap-8 items-center justify-around animate-fade-in py-4">
              
              {/* Left Column: Celebrate children & Score (45%) */}
              <div className="w-full md:w-[45%] flex flex-col items-center text-center space-y-4 border-b md:border-b-0 md:border-r border-slate-800/60 pb-6 md:pb-0 md:pr-8">
                {/* Celebratory Avatars with score customized dialogue bubble */}
                <div className="w-full max-w-sm font-sans">
                  <AnimatedKids 
                    mood="victory" 
                    language={language}
                    interactiveSpeech={
                      score === questions.length 
                        ? LOC_TEXT[language].scoreFullSpeech
                        : score >= 3 
                          ? LOC_TEXT[language].scoreGoodSpeech.replace("{score}", String(score))
                          : LOC_TEXT[language].scoreLowSpeech.replace("{score}", String(score))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-slate-400 block font-mono">
                    {LOC_TEXT[language].numismaticsCertificate}
                  </span>
                  
                  {/* Score */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
                    {score} / {questions.length} {LOC_TEXT[language].correctStars}
                  </h3>

                  {/* Curated Kiosk Title reward */}
                  <div className="mt-2 text-center font-mono">
                    <span className="text-xs text-slate-400 block uppercase">{LOC_TEXT[language].yourCuratedTitle}:</span>
                    <span className="bg-indigo-600/30 text-indigo-305 border border-indigo-500/40 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider inline-block mt-1">
                      {score === questions.length ? LOC_TEXT[language].titleMintMaster : score >= 3 ? LOC_TEXT[language].titleApprentice : LOC_TEXT[language].titleHistorian}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Descriptions, Ledger, CTA buttons (55%) */}
              <div className="w-full md:w-[55%] flex flex-col justify-between h-full space-y-5">
                
                {/* Custom explanation block depending on score */}
                <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl">
                  <h4 className="text-sm font-semibold text-slate-200 mb-1 text-left uppercase font-mono">{LOC_TEXT[language].curatorFeedback}:</h4>
                  <p className="text-sm text-slate-350 leading-relaxed text-left font-sans">
                    {score === questions.length && LOC_TEXT[language].feedbackFull}
                    {score >= 3 && score < questions.length && LOC_TEXT[language].feedbackGood}
                    {score < 3 && LOC_TEXT[language].feedbackLow}
                  </p>
                </div>

                {/* Question performance tracking overview */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-xs uppercase font-mono tracking-widest text-slate-450 block mb-2 text-left">{LOC_TEXT[language].quizLedger}:</span>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => {
                      const hit = history.find(h => h.questionId === q.id);
                      const isCorrect = hit ? hit.isCorrect : false;
                      return (
                        <div 
                          key={idx} 
                          className={`p-2.5 rounded border flex flex-col items-center justify-center gap-1.5 font-sans ${
                            hit
                              ? isCorrect
                                ? "bg-emerald-950/35 border-emerald-500/40 text-emerald-300"
                                : "bg-red-950/35 border-red-500/45 text-red-300"
                              : "bg-slate-900 border-slate-800 text-slate-500"
                          }`}
                        >
                          <span className="text-[9px] font-mono leading-none font-bold">Q{idx+1}</span>
                          {hit ? (
                            isCorrect ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" /> : <XCircle className="h-4.5 w-4.5 text-red-400" />
                          ) : (
                            <span className="text-[9px] font-mono">-</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Play Again Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-sans">
                  <button
                    id="btn_restart_quiz"
                    onClick={restartQuiz}
                    className={`${theme.accentColor} font-semibold py-3 px-4 rounded-xl transform active:scale-95 transition-all text-xs uppercase cursor-pointer flex items-center justify-center gap-2`}
                  >
                    <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
                    {LOC_TEXT[language].tryQuizAgain}
                  </button>
                  
                  <button
                    id="btn_go_home"
                    onClick={goToWelcomeScreen}
                    className="bg-indigo-650 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transform active:scale-95 transition-all text-xs uppercase cursor-pointer flex items-center justify-center gap-2 border border-indigo-500 shadow-md"
                  >
                    <Home className="h-4 w-4" />
                    {LOC_TEXT[language].returnToHome}
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* PERSISTENT FLASH-PLAYER BOTTOM NAVIGATION TABS REMOVED per user feedback since Back/Home covers the flow */}

        </div>

        {/* Physical cabinet base simulator */}
        <div className="h-5 bg-slate-950/80 rounded-b-3xl border-t border-slate-800 flex items-center justify-center relative">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/70" />
        </div>
      </div>
    </div>
  );
}
