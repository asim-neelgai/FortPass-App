import { createContext } from 'react'

interface AuthContextType {
  authData: string
  setAuthData: (authData: string) => void
  emailAddress: string
  setEmailAddress: (emailAddress: string) => void
  userSub: string
  setUserSub: (userSub: string) => void
}

const defaultAuthValue: AuthContextType = {
  authData: '',
  setAuthData: () => {},
  emailAddress: '',
  setEmailAddress: () => {},
  userSub: '',
  setUserSub: () => {}

}

const AuthContext = createContext<AuthContextType>(defaultAuthValue)

export default AuthContext
