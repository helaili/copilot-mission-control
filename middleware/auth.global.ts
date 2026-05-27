const PUBLIC_PATHS = ['/', '/auth/']

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.test) {
    return
  }

  const isPublic = PUBLIC_PATHS.some(p =>
    p.endsWith('/') ? to.path.startsWith(p) : to.path === p,
  )

  const { loggedIn, fetch } = useUserSession()

  if (!loggedIn.value) {
    await fetch()
  }

  if (to.path === '/' && loggedIn.value) {
    return navigateTo('/usage')
  }

  if (!isPublic && !loggedIn.value) {
    return navigateTo('/auth/github', { external: true })
  }
})
