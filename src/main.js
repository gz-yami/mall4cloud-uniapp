import {
  createSSRApp
} from 'vue'
import App from './App.vue'
// 国际化
import { setupI18n } from './lang'
import { setupRouter } from './router'

// 设置默认语言
uni.getSystemInfo({
  success: (res) => {
    uni.setStorageSync('cloudLang', (res.appLanguage.indexOf('zh') !== -1) ? 'zh_CN' : 'en')
  }
})
export function createApp () {
  const app = createSSRApp(App)
  app.use(setupI18n)
  setupRouter(app)
  return {
    app
  }
}
