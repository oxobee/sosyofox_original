export const publicSections = {
  social: {
    title: "Sosyal Medya Hizmetleri",
    href: "/sosyal-medya-hizmetleri",
    icon: "favorite",
    description: "Takipçi, beğeni, izlenme ve etkileşim odaklı hizmetler."
  },
  epin: {
    title: "E-Pin",
    href: "/epin",
    icon: "stadia_controller",
    description: "Oyun, platform ve dijital kod alanları yakında."
  },
  licenses: {
    title: "Lisanslar",
    href: "/lisanslar",
    icon: "grid_view",
    description: "Yazılım ve dijital lisans kataloğu hazırlanıyor."
  },
  agency: {
    title: "Ajans Hizmetleri",
    href: "/ajans-hizmetleri",
    icon: "auto_awesome",
    description: "Marka, yazılım, reklam ve içerik üretimi çözümleri."
  }
};

export const socialMenuGroups = [
  {
    title: "Popüler Platformlar",
    items: [
      { title: "Instagram Hizmetleri", description: "Takipçi, beğeni, izlenme", icon: "photo_camera", href: "/sosyal-medya-hizmetleri?platform=instagram" },
      { title: "TikTok Hizmetleri", description: "Video ve profil etkileşimi", icon: "music_note", href: "/sosyal-medya-hizmetleri?platform=tiktok" },
      { title: "YouTube Hizmetleri", description: "İzlenme ve kanal büyümesi", icon: "smart_display", href: "/sosyal-medya-hizmetleri?platform=youtube" },
      { title: "Spotify Hizmetleri", description: "Dinlenme ve liste görünürlüğü", icon: "album", href: "/sosyal-medya-hizmetleri?platform=spotify" }
    ]
  },
  {
    title: "Sipariş Tipleri",
    items: [
      { title: "Takipçi Paketleri", description: "Kademeli ve kontrollü büyüme", icon: "group_add", href: "/sosyal-medya-hizmetleri?tip=takipci" },
      { title: "Beğeni ve Kaydetme", description: "İçerik etkileşim desteği", icon: "thumb_up", href: "/sosyal-medya-hizmetleri?tip=etkilesim" },
      { title: "Video İzlenme", description: "Reels, Shorts ve video görünürlüğü", icon: "play_circle", href: "/sosyal-medya-hizmetleri?tip=izlenme" },
      { title: "Profil Trafiği", description: "Keşif ve ziyaret odaklı akış", icon: "moving", href: "/sosyal-medya-hizmetleri?tip=trafik" }
    ]
  }
];

export const agencyMenuGroups = [
  {
    title: "Yazılım Hizmetleri",
    items: [
      { title: "Web Yazılım Hizmetleri", description: "Özel yazılım ve web geliştirme", icon: "code_blocks", href: "/ajans-hizmetleri/web-yazilim-hizmetleri" },
      { title: "Web Tasarım Hizmetleri", description: "SEO uyumlu premium arayüzler", icon: "web", href: "/ajans-hizmetleri/web-tasarim-hizmetleri" },
      { title: "Mobil Uygulama Geliştirme", description: "iOS ve Android uygulamalar", icon: "phone_iphone", href: "/ajans-hizmetleri/mobil-uygulama-gelistirme" },
      { title: "Kurumsal Kimlik Tasarımı", description: "Profesyonel marka kimliği", icon: "badge", href: "/ajans-hizmetleri/kurumsal-kimlik-tasarimi" }
    ]
  },
  {
    title: "Sosyal Medya Reklamcılığı",
    items: [
      { title: "Sosyal Medya İçerik Üretimi", description: "Etkileşim odaklı içerik stratejisi", icon: "auto_awesome", href: "/ajans-hizmetleri/sosyal-medya-icerik-uretimi" },
      { title: "Meta Reklam Yönetimi", description: "Hedef kitle odaklı kampanya", icon: "all_inclusive", href: "/ajans-hizmetleri/meta-reklam-yonetimi" },
      { title: "Google Ads Reklam Yönetimi", description: "Dönüşüm odaklı reklam stratejisi", icon: "travel_explore", href: "/ajans-hizmetleri/google-ads-reklam-yonetimi" },
      { title: "TikTok Reklam Yönetimi", description: "Viral reklam yönetimi", icon: "music_note", href: "/ajans-hizmetleri/tiktok-reklam-yonetimi" }
    ]
  }
];

export const socialContentPackages = [
  {
    title: "Başlangıç Paketi",
    subtitle: "Sosyal medyaya giriş yapın.",
    oldBasePrice: 8999,
    basePrice: 2999,
    oldPrice: "8.999,00 TL",
    price: "2.999,00 TL",
    engagement: "%5 - %10",
    icon: "rocket_launch",
    features: [
      "Haftalık 1 Story Paylaşımı",
      "3 Revizyon Hakkı",
      "%25 Hedef Kitle Artışı",
      "%5 Yeni Takipçi Hedefi",
      "%10 Profil Ziyareti Artışı",
      "%10 Etkileşim Artışı",
      "%10 Öne Çıkarma Avantajı"
    ]
  },
  {
    title: "Gelişim Paketi",
    subtitle: "Etkileşimi artırmak isteyenler için.",
    oldBasePrice: 18000,
    basePrice: 6999,
    oldPrice: "18.000,00 TL",
    price: "6.999,00 TL",
    engagement: "%10 - %20",
    icon: "show_chart",
    features: [
      "İsteğinize Özel 2 Story Paylaşımı",
      "İsteğinize Özel 1 Post Paylaşımı",
      "5 Revizyon Hakkı",
      "%30 Hedef Kitle Artışı",
      "%10 Yeni Takipçi Hedefi",
      "%15 Profil Ziyareti Artışı",
      "%15 Etkileşim Artışı"
    ]
  },
  {
    title: "Çoklu Platform",
    subtitle: "Tüm sosyal medya işlemleri tek pakette.",
    oldBasePrice: 14999,
    basePrice: 9999,
    oldPrice: "14.999,00 TL",
    price: "9.999,00 TL",
    engagement: "%20 - %30",
    icon: "hub",
    features: [
      "İsteğinize Özel 2 Post Paylaşımı",
      "İsteğinize Özel 4 Story Paylaşımı",
      "7 Revizyon Hakkı",
      "%35 Hedef Kitle Artışı",
      "%15 Yeni Takipçi Hedefi",
      "%20 Profil Ziyareti Artışı",
      "%20 Etkileşim Artışı"
    ]
  },
  {
    title: "Profesyonel Paket",
    subtitle: "Markasını profesyonelliğe taşımak isteyenler için.",
    oldBasePrice: 19999,
    basePrice: 12999,
    oldPrice: "19.999,00 TL",
    price: "12.999,00 TL",
    engagement: "%30 - %45",
    icon: "business_center",
    features: [
      "İsteğinize özel 4 post paylaşımı",
      "İsteğinize özel 6 story paylaşımı",
      "9 Revizyon Hakkı",
      "%40 Hedef Kitle Artışı",
      "%20 Yeni Takipçi Hedefi",
      "%25 Profil Ziyareti Artışı",
      "%25 Etkileşim Artışı"
    ]
  },
  {
    title: "Kurumsal Paket",
    subtitle: "Kurumsal markalar için özel çözümler.",
    oldBasePrice: 59999,
    basePrice: 29999,
    oldPrice: "59.999,00 TL",
    price: "29.999,00 TL",
    engagement: "%45 - %60",
    icon: "apartment",
    features: [
      "İsteğinize özel 6 post paylaşımı",
      "İsteğinize özel 7 story paylaşımı",
      "15 Revizyon Hakkı",
      "%45 Hedef Kitle Artışı",
      "%25 Yeni Takipçi Hedefi",
      "%35 Profil Ziyareti Artışı",
      "%35 Etkileşim Artışı"
    ]
  },
  {
    title: "Zirve Paketi",
    subtitle: "Markanız için üst seviye sosyal medya deneyimi.",
    oldBasePrice: 299999,
    basePrice: 75000,
    oldPrice: "299.999,00 TL",
    price: "75.000,00 TL",
    engagement: "%75+",
    icon: "workspace_premium",
    features: [
      "İsteğinize özel 7 post paylaşımı",
      "İsteğinize özel 7 story paylaşımı",
      "Sınırsız Revizyon Hakkı",
      "%55 Hedef Kitle Artışı",
      "%35 Yeni Takipçi Hedefi",
      "%45 Profil Ziyareti Artışı",
      "%45 Etkileşim Artışı"
    ]
  }
];

const sharedAgencyForm = {
  services: ["Web Yazılım", "Web Tasarım", "E-Ticaret", "Entegrasyon Hizmeti", "SEO Çalışması", "Arama Motoru Kaydı"],
  fields: ["Adınız, Soyadınız", "Telefon Numaranız", "Mail Adresiniz", "Site Adı", "Sektörünüz"]
};

export const agencyPages = [
  {
    slug: "sosyal-medya-icerik-uretimi",
    title: "Sosyal Medya İçerik Üretimi",
    eyebrow: "İçerik Stratejisi",
    summary: "Markanız için düzenli, etkileşim odaklı ve ölçülebilir sosyal medya içerik üretimi.",
    heroIcon: "auto_awesome",
    kind: "packages",
    content: [
      { heading: "Planlı İçerik, Ölçülebilir Büyüme", body: "Sosyofox, hedef kitlenizin davranışlarını dikkate alarak içerik takvimi, story, post ve kampanya akışlarını tek bir strateji içinde kurgular." },
      { heading: "Platforma Uygun Üretim", body: "Instagram, TikTok, YouTube ve çoklu platform akışları için format, metin, görsel yön ve yayın sıklığı beraber planlanır." }
    ],
    bullets: ["Haftalık paylaşım planı", "Story ve post üretim akışı", "Hedef kitle ve etkileşim artışı", "Revizyon ve raporlama süreci"],
    form: { ...sharedAgencyForm, services: ["Instagram", "TikTok", "YouTube", "Çoklu Platform", "Reels İçerikleri", "Story Planı"] }
  },
  {
    slug: "web-yazilim-hizmetleri",
    title: "Web Yazılım Hizmetleri",
    eyebrow: "Özel Yazılım",
    summary: "Operasyonunuza uygun, ölçeklenebilir ve güvenli web yazılım altyapıları.",
    heroIcon: "code_blocks",
    kind: "consulting",
    content: [
      { heading: "Dijitalde Neden Bizimle Yol Almalısınız?", body: "Sosyofox, standart paketlerin dışına çıkarak iş hedeflerinize, operasyonel ihtiyaçlarınıza ve sektör dinamiklerinize uygun özel yazılım mimarileri üretir." },
      { heading: "Veri Odaklı Mimari ve Performans", body: "Yüksek trafik, güvenli veri yönetimi, API entegrasyonları ve sürdürülebilir kod kalitesi aynı plan içinde ele alınır." },
      { heading: "Çok Tercih Edilen Temel Alanlar", body: "ERP/CRM çözümleri, e-ticaret altyapıları, özel otomasyon yazılımları ve üçüncü taraf entegrasyonlar için teklif süreci oluşturulur." }
    ],
    bullets: ["PostgreSQL, Redis ve modern API mimarisi", "CDN, WAF ve güvenlik katmanları", "Modüler geliştirme ve entegrasyon planı", "SEO ve kullanıcı deneyimi uyumu"],
    form: sharedAgencyForm
  },
  {
    slug: "web-tasarim-hizmetleri",
    title: "Web Tasarım Hizmetleri",
    eyebrow: "Premium Arayüz",
    summary: "Markanızın dijital vitrini için modern, hızlı ve dönüşüm odaklı web tasarım.",
    heroIcon: "web",
    kind: "consulting",
    content: [
      { heading: "Dijital Kimliğinizi Fonksiyonellikle Şekillendiriyoruz", body: "Sosyofox, sadece göze hoş gelen tasarımlar değil; markanızın hikayesini anlatan, kullanıcıyı eyleme geçiren ve her cihazda güçlü çalışan arayüzler tasarlar." },
      { heading: "Kullanıcı Deneyimi ve Tasarım Yaklaşımımız", body: "Veri odaklı tasarım, mobil öncelik, dönüşüm odaklı arayüzler ve tutarlı marka dili birlikte değerlendirilir." },
      { heading: "Tasarımda Öne Çıkan Standartlarımız", body: "Core Web Vitals, erişilebilirlik, mikro etkileşimler ve SEO uyumu tasarım sürecinin ana parçasıdır." }
    ],
    bullets: ["UX/UI tasarım", "E-ticaret ve landing page arayüzleri", "Logo ve katalog tasarım yönü", "Mobil uygulama arayüz desteği"],
    form: { ...sharedAgencyForm, services: ["Web Yazılım", "Web Tasarım", "UI / UX", "E-Ticaret", "Logo Tasarım", "Mobil Uygulama"] }
  },
  {
    slug: "mobil-uygulama-gelistirme",
    title: "Mobil Uygulama Geliştirme",
    eyebrow: "iOS ve Android",
    summary: "Hızlı, güvenli ve ölçeklenebilir mobil uygulama geliştirme süreci.",
    heroIcon: "phone_iphone",
    kind: "consulting",
    content: [
      { heading: "Mobil Dünyada Yenilikçi Kullanıcı Deneyimleri", body: "Sosyofox, kullanıcılarınızın her an yanında olan, hızlı ve güvenli dijital ekosistemler inşa eder." },
      { heading: "Yüksek Performanslı Mobil Teknolojiler", body: "Flutter ve React Native gibi cross-platform yaklaşımlar, API altyapısı ve analitik takip aynı proje planında değerlendirilir." },
      { heading: "Analitik Odaklı İzleme ve Sürekli Gelişim", body: "Firebase, Crashlytics, performans izleme ve düzenli versiyon uyumluluğu uygulama ömrü boyunca planlanır." }
    ],
    bullets: ["Startup uygulaması", "iOS ve Android uygulama", "Çapraz platform geliştirme", "Performans ve UI/UX optimizasyonu"],
    form: { ...sharedAgencyForm, services: ["Startup Uygulama", "iOS Uygulama", "Android Uygulama", "Çapraz Platform Hizmeti", "Performans Optimizasyonu", "UI/UX Tasarım"] }
  },
  {
    slug: "kurumsal-kimlik-tasarimi",
    title: "Kurumsal Kimlik Tasarımı",
    eyebrow: "Marka Kimliği",
    summary: "Markanızın karakterini, görsel dilini ve dijital duruşunu profesyonelce oluşturun.",
    heroIcon: "badge",
    kind: "consulting",
    content: [
      { heading: "Markanızın Karakterini ve Geleceğini Tasarlıyoruz", body: "Sosyofox, logonun ötesine geçen bütünleşik bir görsel dil oluşturarak markanızın vizyonunu yansıtır." },
      { heading: "Stratejik Görsel Kimlik Oluşturma Süreci", body: "Logo, ikonografi, tipografi, renk psikolojisi ve tüm temas noktalarındaki görsel standartlar birlikte tasarlanır." },
      { heading: "Kurumsal Duruş ve Marka Rehberi", body: "Markanızın her platformda profesyonel görünmesi için kullanım standartları ve dijital materyaller hazırlanır." }
    ],
    bullets: ["Logo ve amblem tasarımı", "Kurumsal renk ve tipografi", "Kimlik kılavuzu", "Dijital şablon setleri"],
    form: { ...sharedAgencyForm, services: ["Logo Tasarımı", "Kurumsal Renk & Tipografi", "Kurumsal Kimlik Kılavuzu", "Kartvizit & Antetli Kağıt", "Dijital Şablon Setleri", "Kurumsal E-Mail"] }
  },
  {
    slug: "meta-reklam-yonetimi",
    title: "Meta Reklam Yönetimi",
    eyebrow: "Performans Reklamı",
    summary: "Facebook ve Instagram reklamları için hedef kitle, piksel ve dönüşüm odaklı yönetim.",
    heroIcon: "all_inclusive",
    kind: "consulting",
    content: [
      { heading: "Meta Reklamları ile Hedef Kitlenize Stratejiyle Ulaşın", body: "Sosyofox, reklam bütçenizi maliyet değil, markanızı büyüten ölçülebilir bir yatırım aracına dönüştürür." },
      { heading: "Veri Odaklı Reklam ve Hedefleme Stratejileri", body: "Detaylı hedef kitle analizi, conversion API, retargeting ve A/B testleri reklam sürecinin merkezine alınır." },
      { heading: "Şeffaf Raporlama ve Stratejik Danışmanlık", body: "ROAS, CAC ve kampanya performansı anlaşılır şekilde raporlanır." }
    ],
    bullets: ["Instagram kampanyaları", "Facebook kampanyaları", "Retargeting ve lookalike kitle", "A/B test ve kreatif optimizasyon"],
    form: { ...sharedAgencyForm, services: ["Instagram", "Facebook", "Twitter", "YouTube"] }
  },
  {
    slug: "google-ads-reklam-yonetimi",
    title: "Google Ads Reklam Yönetimi",
    eyebrow: "Arama Reklamları",
    summary: "Arama, YouTube ve yeniden pazarlama kampanyaları için ROI odaklı reklam yönetimi.",
    heroIcon: "travel_explore",
    kind: "consulting",
    content: [
      { heading: "Google Ads ile Üst Sıralarda Sonuç Alın", body: "Sosyofox, Google Ads kampanyalarınızı sadece tıklama değil, doğrudan ROI odaklı yönetir." },
      { heading: "Google Ads Performans Yönetimi", body: "Anahtar kelime yapılandırması, negatif kelime yönetimi, kalite puanı optimizasyonu ve dönüşüm takibi birlikte yürütülür." },
      { heading: "Çok Kanallı Reklam ve Yeniden Pazarlama", body: "Arama ağı, Performance Max, YouTube, Gmail ve remarketing kampanyaları tek stratejide kurgulanır." }
    ],
    bullets: ["Anahtar kelime planlama", "Negatif kelime optimizasyonu", "Kalite puanı yönetimi", "Performans ve dönüşüm raporu"],
    form: { ...sharedAgencyForm, services: ["Arama Ağı", "Performance Max", "YouTube", "Remarketing"] }
  },
  {
    slug: "tiktok-reklam-yonetimi",
    title: "TikTok Reklam Yönetimi",
    eyebrow: "Viral Kampanya",
    summary: "TikTok için trend, kreatif ve performans odaklı reklam yönetimi.",
    heroIcon: "music_note",
    kind: "consulting",
    content: [
      { heading: "TikTok ile Markanızı Keşfet Sayfasına Taşıyın", body: "Sosyofox, TikTok'un dinamik algoritmasına uygun yüksek performanslı reklam kampanyaları yönetir." },
      { heading: "Algoritma Odaklı ve Kreatif Reklam Stratejileri", body: "Trend analizi, TikTok Pixel, Spark Ads ve A/B testleri kampanya performansına göre şekillendirilir." },
      { heading: "Hedef Kitle ve Bütçe Yönetimi", body: "Hassas hedefleme, yeniden pazarlama ve bütçe optimizasyonu günlük takip edilir." }
    ],
    bullets: ["Trend ve içerik analizi", "TikTok Pixel kurulumu", "Spark Ads yönetimi", "ROAS ve metrik analizi"],
    form: { ...sharedAgencyForm, services: ["TikTok Reklam", "Spark Ads", "Pixel Kurulumu", "Kreatif Test"] }
  }
] as const;

export type AgencyPage = (typeof agencyPages)[number];

export function getAgencyPage(slug: string) {
  return agencyPages.find((page) => page.slug === slug);
}
