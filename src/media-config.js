/** Replace sources here; never represent demonstration visuals as factory evidence. */
export const media = {
  'hero-poster': {
    desktop: '/assets/hero-poster.webp', mobile: '/assets/hero-mobile.webp',
    alt: 'Художественная иллюстрация: смешивание красной краски в металлической ёмкости',
    position: '70% 50%', mobilePosition: '50% 50%', demonstration: true,
    video: { desktop: null, mobile: null },
  },
  'lkm-production': { desktop: null, mobile: null, alt: 'Производство лакокрасочных материалов', video: { desktop: null, mobile: null } },
  'material-alkyd': { desktop: '/assets/material-alkyd-smooth.webp', mobile: '/assets/material-alkyd-smooth-mobile.webp', alt: 'Макроиллюстрация: красное покрытие на металлическом образце', demonstration: true },
  'material-acrylic': { desktop: '/assets/material-acrylic-smooth.webp', mobile: '/assets/material-acrylic-smooth-mobile.webp', alt: 'Макроиллюстрация: тёмно-синее покрытие на металлическом образце', demonstration: true },
  'material-primer': { desktop: '/assets/material-primer-v1.webp', mobile: '/assets/material-primer-v1-mobile.webp', alt: 'Макроиллюстрация матовой серой грунтовки на металле', demonstration: true },
  'material-metallic': { desktop: '/assets/material-metallic-v3.webp', mobile: '/assets/material-metallic-v3-mobile.webp', alt: 'Макроиллюстрация синего покрытия с эффектом металлик под лаком', demonstration: true },
  'custom-etalon': { desktop: '/assets/material-alkyd.webp', mobile: '/assets/material-alkyd-mobile.webp', alt: 'Иллюстрация цветового эталона на металле', demonstration: true },
  'application-gates': { desktop: '/assets/application-gates-v7.webp', mobile: '/assets/application-gates-v7-mobile.webp', alt: 'Иллюстрация применения покрытия: металлические ворота', demonstration: true },
  'application-racks': { desktop: '/assets/application-racks-v4.webp', mobile: '/assets/application-racks-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: складские стеллажи', demonstration: true },
  'application-forklift': { desktop: '/assets/application-forklift-v4.webp', mobile: '/assets/application-forklift-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: погрузчик', demonstration: true },
  'application-machinery': { desktop: '/assets/application-machinery-v4.webp', mobile: '/assets/application-machinery-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: промышленный станок', demonstration: true },
  'application-transport': { desktop: '/assets/application-transport-v4.webp', mobile: '/assets/application-transport-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: коммерческий транспорт', demonstration: true },
  'application-railway': { desktop: '/assets/application-railway-v4.webp', mobile: '/assets/application-railway-v4-mobile.webp', alt: 'Иллюстрация применения покрытия: железнодорожный вагон в контексте ремонта', demonstration: true },
  'application-autorepair': { desktop: '/assets/application-autorepair-v2.webp', mobile: '/assets/application-autorepair-v2-mobile.webp', alt: 'Иллюстрация применения покрытия: синий автомобиль с красными передним бампером и задней дверью', demonstration: true },
  'tolling-production': { desktop: null, mobile: null, alt: 'Технологическая операция с сырьём заказчика', video: { desktop: null, mobile: null } },
  laboratory: { desktop: null, mobile: null, alt: 'Научно-исследовательская лаборатория предприятия' },
  'quality-control': { desktop: null, mobile: null, alt: 'Контроль качественных показателей партии в лаборатории ОТК' },
  'control-samples': { desktop: null, mobile: null, alt: 'Работа с цветовыми эталонами и контроль образцов партии' },
  equipment: { desktop: null, mobile: null, alt: 'Собственные производственные мощности предприятия' },
  team: { desktop: null, mobile: null, alt: 'Специалисты предприятия' },
};

/** No fictional API or legal document. Configure only approved real destinations. */
// Add/remove entries freely. Publish only approved original logos with a real name.
export const partners = [{ name: 'Технопласт', src: '/assets/partner-technoplast.svg?v=2', approved: true }, ...Array.from({ length: 7 }, () => ({ name: '', src: null, approved: false }))];

export const integration = {
  requestEndpoint: null,
  csrfToken: null,
  privacyUrl: null,
  consentUrl: null,
  agreementUrl: null,
  maxFileBytes: 10 * 1024 * 1024,
};

// All five approved illustrations are examples of requests, not technical applicability claims.
export { surfaceFrames } from './surface-config.js?v=15';

/** Real company media only. Empty slots are shown solely in ?company=review. */
export const companyGallery=[
 {id:'team',title:'Люди и лаборатория',type:'image',src:'/assets/company-team-v1.webp',mobileSrc:'/assets/company-team-v1-mobile.webp',alt:'Специалисты Волжских красок работают с лабораторным оборудованием',position:'center 45%',approved:true,enabled:true},
 {id:'color-control',title:'Контроль цвета',type:'image',src:'/assets/company-color-control-v1.webp',mobileSrc:'/assets/company-color-control-v1-mobile.webp',alt:'Измерение цвета образца прибором в лаборатории',position:'center',approved:true,enabled:true},
 {id:'equipment',title:'Производственное оборудование',type:'image',src:'/assets/company-equipment-v1.webp',mobileSrc:'/assets/company-equipment-v1-mobile.webp',alt:'Производственное оборудование и ёмкости на предприятии Волжские краски',position:'center',approved:true,enabled:true},
 {id:'filling',title:'Линия фасовки',type:'image',src:'/assets/company-filling-v1.webp',mobileSrc:'/assets/company-filling-v1-mobile.webp',alt:'Металлическая тара на линии фасовки лакокрасочных материалов',position:'center',approved:true,enabled:true},
];
