export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        id: user.id,
        login: user.login,
        name: user.name || user.login,
        avatarUrl: user.avatar_url,
        email: user.email ?? undefined,
      },
      loggedInAt: new Date(),
    })

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/auth/error')
  },
})
