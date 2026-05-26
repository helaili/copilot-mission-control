export const useAuth = () => {
  const isLoggedIn = useState('auth.isLoggedIn', () => false)
  const userName = useState('auth.userName', () => 'Alain Helaili')

  const login = () => { isLoggedIn.value = true }
  const logout = () => { isLoggedIn.value = false }

  return { isLoggedIn, userName, login, logout }
}
