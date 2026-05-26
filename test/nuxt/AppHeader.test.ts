import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h, defineComponent } from 'vue'
import { VApp } from 'vuetify/components'
import AppHeader from '../../components/AppHeader.vue'

// v-app-bar requires the layout context provided by v-app
function mountHeader(emits?: Record<string, unknown>) {
  return mountSuspended(
    defineComponent({
      render() {
        return h(VApp, null, { default: () => h(AppHeader, emits) })
      },
    }),
  )
}

describe('AppHeader', () => {
  beforeEach(() => {
    const { logout } = useAuth()
    logout()
  })

  it('renders the app name from config', async () => {
    const { appName } = useAppConfig()
    const wrapper = await mountHeader()
    expect(wrapper.text()).toContain(appName)
  })

  it('renders the app logo icon', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.html()).toContain('mdi-rocket-launch')
  })

  it('renders "Sign in" button when logged out', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.text()).toContain('Sign in')
  })

  it('does not render user avatar when logged out', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.find('[aria-label="User menu"]').exists()).toBe(false)
  })

  it('renders user avatar button when logged in', async () => {
    const { login } = useAuth()
    login()
    const wrapper = await mountHeader()
    expect(wrapper.find('[aria-label="User menu"]').exists()).toBe(true)
  })

  it('does not render sign-in button when logged in', async () => {
    const { login } = useAuth()
    login()
    const wrapper = await mountHeader()
    expect(wrapper.text()).not.toContain('Sign in')
  })

  it('emits toggleDrawer when hamburger is clicked', async () => {
    const onToggle = { onToggleDrawer: vi.fn() }
    const wrapper = await mountHeader(onToggle)
    const hamburger = wrapper.find('[aria-label="Toggle navigation"]')
    await hamburger.trigger('click')
    expect(onToggle.onToggleDrawer).toHaveBeenCalledOnce()
  })

  it('calls login when sign-in button is clicked', async () => {
    const wrapper = await mountHeader()
    const signInBtn = wrapper.findAll('button').find(b => b.text() === 'Sign in')
    expect(signInBtn).toBeDefined()
    await signInBtn!.trigger('click')
    const { isLoggedIn } = useAuth()
    expect(isLoggedIn.value).toBe(true)
  })
})
