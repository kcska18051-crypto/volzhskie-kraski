/** Replace sources here; never represent demonstration visuals as factory evidence. */
export const media = {
  'hero-poster': {
    desktop: '/assets/hero-poster.webp', mobile: '/assets/hero-mobile.webp',
    alt: 'Художественная иллюстрация: смешивание красной краски в металлической ёмкости',
    position: '70% 50%', mobilePosition: '50% 50%', demonstration: true,
    video: { desktop: null, mobile: null },
  },
  'lkm-production': { desktop: null, mobile: null, alt: 'Производство лакокрасочных материалов', video: { desktop: null, mobile: null } },
  'material-alkyd': { desktop: '/assets/material-alkyd.webp', mobile: '/assets/material-alkyd-mobile.webp', alt: 'Макроиллюстрация: красное покрытие на металлическом образце', demonstration: true },
  'material-acrylic': { desktop: '/assets/material-acrylic.webp', mobile: '/assets/material-acrylic-mobile.webp', alt: 'Макроиллюстрация: тёмно-синее покрытие на металлическом образце', demonstration: true },
  'custom-etalon': { desktop: '/assets/material-alkyd.webp', mobile: '/assets/material-alkyd-mobile.webp', alt: 'Иллюстрация цветового эталона на металле', demonstration: true },
  'application-gates': { desktop: '/assets/application-gates-v4.webp', mobile: '/assets/application-gates-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: металлические ворота', demonstration: true },
  'application-racks': { desktop: '/assets/application-racks-v4.webp', mobile: '/assets/application-racks-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: складские стеллажи', demonstration: true },
  'application-forklift': { desktop: '/assets/application-forklift-v4.webp', mobile: '/assets/application-forklift-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: погрузчик', demonstration: true },
  'application-machinery': { desktop: '/assets/application-machinery-v4.webp', mobile: '/assets/application-machinery-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: промышленный станок', demonstration: true },
  'application-transport': { desktop: '/assets/application-transport-v4.webp', mobile: '/assets/application-transport-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: коммерческий транспорт', demonstration: true },
  'application-railway': { desktop: '/assets/application-railway-v4.webp', mobile: '/assets/application-railway-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: железнодорожный вагон в контексте ремонта', demonstration: true },
  'tolling-production': { desktop: null, mobile: null, alt: 'Технологическая операция с сырьём заказчика', video: { desktop: null, mobile: null } },
  laboratory: { desktop: null, mobile: null, alt: 'Научно-исследовательская лаборатория предприятия' },
  'quality-control': { desktop: null, mobile: null, alt: 'Контроль качественных показателей партии в лаборатории ОТК' },
  'control-samples': { desktop: null, mobile: null, alt: 'Работа с цветовыми эталонами и контроль образцов партии' },
  equipment: { desktop: null, mobile: null, alt: 'Собственные производственные мощности предприятия' },
  team: { desktop: null, mobile: null, alt: 'Специалисты предприятия' },
};

/** No fictional API or legal document. Configure only approved real destinations. */
// Add/remove entries freely. Publish only approved original logos with a real name.
export const partners = Array.from({ length: 8 }, () => ({ name: '', src: null, approved: false }));

export const integration = {
  requestEndpoint: null,
  csrfToken: null,
  privacyUrl: null,
  consentUrl: null,
  maxFileBytes: 10 * 1024 * 1024,
};

// All five approved illustrations are examples of requests, not technical applicability claims.
export { surfaceFrames } from './surface-config.js?v=14';

/** Real company media only. Empty slots are shown solely in ?company=review. */
export const companyGallery=[
 {id:'production',title:'Производство',type:'image',src:null,mobileSrc:null,alt:'Производственные мощности Волжских красок',position:'center',mobilePosition:'center',approved:false,enabled:false},
 {id:'team',title:'Команда',type:'image',src:null,mobileSrc:null,alt:'Специалисты Волжских красок в работе',position:'center',mobilePosition:'center',approved:false,enabled:false},
 {id:'laboratory',title:'Лаборатория разработки',type:'image',src:null,mobileSrc:null,alt:'Лаборатория разработки Волжских красок',position:'center',mobilePosition:'center',approved:false,enabled:false},
 {id:'control',title:'Контроль качества',type:'image',src:null,mobileSrc:null,alt:'Контроль партии в лаборатории Волжских красок',position:'center',mobilePosition:'center',approved:false,enabled:false},
 {id:'video',title:'Видео производства',type:'video',src:null,mobileSrc:null,poster:null,mobilePoster:null,alt:'Видео производственных операций Волжских красок',position:'center',mobilePosition:'center',approved:false,enabled:false},
];
