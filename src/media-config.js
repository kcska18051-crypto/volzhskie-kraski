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
  maxFileBytes: 10 * 1024 * 1024,
};

// All five approved illustrations are examples of requests, not technical applicability claims.
export { surfaceFrames } from './surface-config.js?v=15';

/** Real company media only. Empty slots are shown solely in ?company=review. */
export const companyGallery=[
  {
    "id": "process-1",
    "title": "Получение заказа",
    "type": "image",
    "src": "/assets/company-process-01.webp",
    "mobileSrc": "/assets/company-process-01-mobile.webp",
    "alt": "Получение заказа",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-2",
    "title": "Закупка сырья",
    "type": "image",
    "src": "/assets/company-process-02.webp",
    "mobileSrc": "/assets/company-process-02-mobile.webp",
    "alt": "Закупка сырья",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-3",
    "title": "Разработка материала",
    "type": "image",
    "src": "/assets/company-process-03.webp",
    "mobileSrc": "/assets/company-process-03-mobile.webp",
    "alt": "Разработка материала",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-4",
    "title": "Приготовление пигментных паст",
    "type": "image",
    "src": "/assets/company-process-04.webp",
    "mobileSrc": "/assets/company-process-04-mobile.webp",
    "alt": "Приготовление пигментных паст",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-5",
    "title": "Составление эмалей",
    "type": "image",
    "src": "/assets/company-process-05.webp",
    "mobileSrc": "/assets/company-process-05-mobile.webp",
    "alt": "Составление эмалей",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-6",
    "title": "Колеровка и нанесение эмалей",
    "type": "image",
    "src": "/assets/company-process-06.webp",
    "mobileSrc": "/assets/company-process-06-mobile.webp",
    "alt": "Колеровка и нанесение эмалей",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-7",
    "title": "Контроль цветовых характеристик",
    "type": "image",
    "src": "/assets/company-process-07.webp",
    "mobileSrc": "/assets/company-process-07-mobile.webp",
    "alt": "Контроль цветовых характеристик",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-8",
    "title": "Прием материала",
    "type": "image",
    "src": "/assets/company-process-08.webp",
    "mobileSrc": "/assets/company-process-08-mobile.webp",
    "alt": "Прием материала",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-9",
    "title": "Фасовка и упаковка",
    "type": "image",
    "src": "/assets/company-process-09.webp",
    "mobileSrc": "/assets/company-process-09-mobile.webp",
    "alt": "Фасовка и упаковка",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-10",
    "title": "Отгрузка",
    "type": "image",
    "src": "/assets/company-process-10.webp",
    "mobileSrc": "/assets/company-process-10-mobile.webp",
    "alt": "Отгрузка",
    "position": "center",
    "approved": true,
    "enabled": true
  },
  {
    "id": "process-11",
    "fullSrc": "/assets/company-process-11-full.webp",
    "title": "Готовый продукт",
    "type": "image",
    "src": "/assets/company-process-11.webp",
    "mobileSrc": "/assets/company-process-11-mobile.webp",
    "alt": "Готовый продукт",
    "position": "center",
    "approved": true,
    "enabled": true
  }
];
