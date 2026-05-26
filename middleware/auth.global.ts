export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.test) {
    return
  }

  if (to.path.startsWith('/auth/')) {
    return
  }

  const { loggedIn, fetch } = useUserSession()

  if (!loggedIn.value) {
    await fetch()
  }

  if (!loggedIn.value) {
    return navigateTo('/auth/github', { external: true })
  }
})
