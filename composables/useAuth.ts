export const useAuth = () => {
  const { loggedIn, user, clear } = useUserSession()

  const isLoggedIn = computed(() => loggedIn.value)
  const userName = computed(() => user.value?.name || user.value?.login || 'GitHub user')
  const userLogin = computed(() => user.value?.login || '')
  const userAvatarUrl = computed(() => user.value?.avatarUrl || '')

  const login = () => navigateTo('/auth/github', { external: true })
  const logout = async () => {
    await clear()
    await navigateTo('/auth/github', { external: true })
  }

  return { isLoggedIn, userName, userLogin, userAvatarUrl, login, logout }
}
