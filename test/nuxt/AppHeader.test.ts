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
    const session = useState('nuxt-session', () => null)
    const authReady = useState('nuxt-auth-ready', () => true)
    session.value = null
    authReady.value = true
  })

  function signInAsGithubUser() {
    const session = useState('nuxt-session', () => null)
    session.value = {
      user: {
        id: 1,
        login: 'octocat',
        name: 'The Octocat',
        avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
        email: 'octocat@github.com',
      },
      loggedInAt: new Date(),
    }
  }

  it('renders the app name from config', async () => {
    const { appName } = useAppConfig()
    const wrapper = await mountHeader()
    expect(wrapper.text()).toContain(appName)
  })

  it('renders the app logo icon', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.html()).toContain('mdi-rocket-launch')
  })

  it('renders "Sign in with GitHub" button when logged out', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.text()).toContain('Sign in with GitHub')
  })

  it('does not render user avatar when logged out', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.find('[aria-label="User menu"]').exists()).toBe(false)
  })

  it('renders user avatar button when logged in', async () => {
    signInAsGithubUser()
    const wrapper = await mountHeader()
    expect(wrapper.find('[aria-label="User menu"]').exists()).toBe(true)
  })

  it('does not render sign-in button when logged in', async () => {
    signInAsGithubUser()
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

  it('links sign-in to the GitHub OAuth route', async () => {
    const wrapper = await mountHeader()
    const signInLink = wrapper.find('a[href="/auth/github"]')
    expect(signInLink.exists()).toBe(true)
    expect(signInLink.text()).toBe('Sign in with GitHub')
  })

  it('renders the GitHub avatar when available', async () => {
    signInAsGithubUser()
    const wrapper = await mountHeader()
    expect(wrapper.find('[aria-label="The Octocat GitHub avatar"]').exists()).toBe(true)
  })
})
