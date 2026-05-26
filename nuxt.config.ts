// https://nuxt.com/docs/api/configuration/nuxt-config
import { APP_NAME } from './constants/app'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: `%s - ${APP_NAME}`,
      title: APP_NAME,
    },
  },
  modules: ['@nuxt/eslint', '@nuxt/test-utils'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
