import App from './App.vue'
import i18n from "./i18n";
import router from './router'
import { createApp } from 'vue'
import './assets/style/main.css'
import 'element-plus/dist/index.css'
import 'remixicon/fonts/remixicon.css'

import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(i18n);
app.use(router)
app.use(ElementPlus)


app.mount('#app')
