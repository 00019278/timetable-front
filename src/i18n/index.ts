import { createI18n } from 'vue-i18n'
import { _language } from '@/stores/base'

import uz from './uz/index.json'
import ru from './ru/index.json'
import en from './en/index.json'


const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  globalInjection: true,
  locale: _language.value,

  messages: {
    uz,
    ru,
    en,
  }
})

export default i18n
