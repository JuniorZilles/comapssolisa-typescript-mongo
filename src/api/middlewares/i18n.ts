import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: `${__dirname}/resources/locales/{{lng}}/{{ns}}.json`
    },
    fallbackLng: 'en',
    preload: ['en']
  });

export default i18nextMiddleware.handle(i18next);
