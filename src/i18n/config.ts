import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import enTrans from './en/app.json'
import jaTrans from './ja/app.json'
import zhTrans from './zh/app.json'

export const resources = {
  en: { home: enTrans },
  zh: { home: zhTrans },
  ja: { home: jaTrans },
}

i18next.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'en',
  debug: false,
  resources,
  // defaultNS,
})
