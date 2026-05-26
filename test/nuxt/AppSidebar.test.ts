import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h, defineComponent } from 'vue'
import { VApp } from 'vuetify/components'
import AppSidebar from '../../components/AppSidebar.vue'

// v-navigation-drawer requires the layout context provided by v-app
function mountSidebar(open = true) {
  return mountSuspended(
    defineComponent({
      render() {
        return h(VApp, null, {
          default: () => h(AppSidebar, { open, 'onUpdate:open': () => {} }),
        })
      },
    }),
  )
}

describe('AppSidebar', () => {
  it('renders all three navigation items', async () => {
    const wrapper = await mountSidebar()
    const html = wrapper.html()
    expect(html).toContain('Summary')
    expect(html).toContain('Usage')
    expect(html).toContain('Budgets')
  })

  it('renders the navigation icons', async () => {
    const wrapper = await mountSidebar()
    const html = wrapper.html()
    expect(html).toContain('mdi-view-dashboard')
    expect(html).toContain('mdi-chart-bar')
    expect(html).toContain('mdi-wallet')
  })

  it('renders with open=false without crashing', async () => {
    const wrapper = await mountSidebar(false)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the Help item', async () => {
    const wrapper = await mountSidebar()
    expect(wrapper.html()).toContain('mdi-help-circle-outline')
  })

  it('passes correct aria-labels to nav items', async () => {
    const wrapper = await mountSidebar()
    const html = wrapper.html()
    expect(html).toContain('aria-label="Summary"')
    expect(html).toContain('aria-label="Usage"')
    expect(html).toContain('aria-label="Budgets"')
  })
})
