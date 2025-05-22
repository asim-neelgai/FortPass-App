import { Platform } from 'react-native'
import SessionStorage from 'react-native-session-storage'

const setSessionStorage = (key: string, value: string): void => {
  if (Platform.OS === 'web') {
    sessionStorage.setItem(key, value)
  } else {
    SessionStorage.setItem(key, value)
  }
}

const getSessionStorage = (key: string): string | null => {
  if (Platform.OS === 'web') {
    return sessionStorage.getItem(key)
  } else {
    return SessionStorage.getItem(key)
  }
}

export { setSessionStorage, getSessionStorage }
