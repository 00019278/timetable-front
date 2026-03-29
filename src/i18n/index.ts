import { createI18n } from 'vue-i18n'

import uz from './uz/index'
import ru from './ru/index'
import en from './en/index'


const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'uz',
  globalInjection: true,
  locale: 'uz',

  messages: {
    uz,
    ru,
    en,
  }
})

export default i18n
