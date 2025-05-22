import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useMemo, useState } from 'react'
import 'react-native-reanimated'
import AuthContext from '@/auth/context'
import { Amplify } from 'aws-amplify'
import awsConfig from '@/aws-exports'
import VaultContext from '@/auth/vaultContext'

Amplify.configure(awsConfig)

export default function RootLayout (): JSX.Element | null {
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf')
  })
  const [authData, setAuthData] = useState<string>('')
  const [emailAddress, setEmailAddress] = useState<string>('')
  const [userSub, setUserSub] = useState<string>('')
  const [vaultData, setVaultData] = useState<any>(null)

  const authContextValue = useMemo(
    () => ({ authData, setAuthData, emailAddress, setEmailAddress, userSub, setUserSub }),
    [authData, setAuthData, emailAddress, setEmailAddress, userSub, setUserSub]
  )

  const vaultContextValue = useMemo(
    () => ({ vaultData, setVaultData }),
    [vaultData, setVaultData]
  )

  useEffect(() => {
    const loadAsyncData = async (): Promise<void> => {
      try {
        await SplashScreen.preventAutoHideAsync()
        if (loaded) {
          await SplashScreen.hideAsync()
        }
      } catch (error) {
        console.error('Error while loading async data:', error)
      }
    }

    void loadAsyncData()
  }, [loaded])

  if (!loaded) {
    return null
  }
  return (
    <AuthContext.Provider value={authContextValue}>
      <VaultContext.Provider value={vaultContextValue}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='+not-found' />
        </Stack>
      </VaultContext.Provider>
    </AuthContext.Provider>
  )
}
