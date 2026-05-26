declare module '#auth-utils' {
  interface User {
    id: number
    login: string
    name: string
    avatarUrl: string
    email?: string
  }

  interface UserSession {
    loggedInAt?: Date
  }
}

export {}
