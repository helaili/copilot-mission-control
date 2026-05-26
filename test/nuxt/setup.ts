// Polyfill ResizeObserver for Vuetify components in jsdom environment
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
