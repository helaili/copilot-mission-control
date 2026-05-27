import { describe, expect, it, beforeEach } from 'vitest'

describe('useAuth', () => {
  beforeEach(() => {
    const session = useState('nuxt-session', () => null)
    const authReady = useState('nuxt-auth-ready', () => true)
    session.value = null
    authReady.value = true
  })

  it('reports signed-out state when there is no session user', () => {
    const { isLoggedIn, userName, userLogin, userAvatarUrl } = useAuth()

    expect(isLoggedIn.value).toBe(false)
    expect(userName.value).toBe('GitHub user')
    expect(userLogin.value).toBe('')
    expect(userAvatarUrl.value).toBe('')
  })

  it('maps the Nuxt Auth Utils user session to app auth state', () => {
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

    const { isLoggedIn, userName, userLogin, userAvatarUrl } = useAuth()

    expect(isLoggedIn.value).toBe(true)
    expect(userName.value).toBe('The Octocat')
    expect(userLogin.value).toBe('octocat')
    expect(userAvatarUrl.value).toBe('https://avatars.githubusercontent.com/u/1?v=4')
  })
})
