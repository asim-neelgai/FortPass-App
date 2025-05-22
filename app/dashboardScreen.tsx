import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, StyleSheet, Dimensions, Platform, TouchableOpacity, Animated } from 'react-native'
import InitialCard from '@/components/InitialCard'
import ProfileInfo from '@/components/ProfileInfo'
import SearchField from '@/components/SearchField'
import HamburgerIcon from '@/components/HamburgerIcon'
import { SafeAreaView } from 'react-native-safe-area-context'
import LeftNavBar from '@/components/LeftNavBar'
import LeftNavBarMobile from '@/components/LeftNavBarMobile'
import { router } from 'expo-router'
import Dropdown, { type DropdownItem } from '@/components/DropDown'
import Image from '@/components/Image'
import { signOut, fetchAuthSession } from 'aws-amplify/auth'
import axios from 'axios'
import VaultContext from '@/auth/vaultContext'

const { width } = Dimensions.get('window')

const DashBoardScreen = (): JSX.Element => {
  const [menuPressed, setMenuPressed] = useState(false)
  const [userId, setUserId] = useState<string>()
  const { setVaultData } = useContext(VaultContext)
  const slideAnim = useRef(new Animated.Value(-width)).current

  const API_URL = process.env.EXPO_PUBLIC_API_URL ?? ''

  useEffect(() => {
    const checkCurrentUser = async (): Promise<void> => {
      const session = await fetchAuthSession()
      setUserId(session?.userSub)
      if (session.tokens == null) {
        await signOut()
        router.push('/loginScreen')
      }
    }
    void checkCurrentUser()
  }, [])

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      if (userId !== undefined) {
        try {
          const url = `${API_URL}?userId=${userId}`
          const response = await axios.get(url)
          console.log(response.data)
          setVaultData(response.data)
        } catch (error) {
          console.error('Error fetching user info:', error)
        }
      }
    }
    void fetchUserInfo()
  }, [userId])

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuPressed ? 0 : -width,
      duration: 300,
      useNativeDriver: true
    }).start()
  }, [menuPressed])

  const dropdownItems: DropdownItem[] = [
    {
      icon: <Image source={require('@/assets/images/fi-rr-sign-out.png')} style={{ width: 20, height: 20 }} />,
      content: 'Log Out',
      onPress: (): void => {
        (async () => {
          await signOut()
          router.push('/loginScreen')
        })().catch((error) => {
          console.error(error)
        })
      }

    }
  ]

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {Platform.OS === 'web' && (
          <View style={styles.leftNav}>
            <LeftNavBar
              items={[]} onSelect={(item) => {
              }}
            />
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            {Platform.OS !== 'web' && (
              <TouchableOpacity onPress={() => setMenuPressed(true)}>
                <HamburgerIcon />
              </TouchableOpacity>
            )}
            <View style={{ marginLeft: 25 }}>
              <SearchField />

            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8, marginHorizontal: 20 }}>
              <ProfileInfo />
              <Dropdown items={dropdownItems} />
            </View>
          </View>
          <View style={styles.cardContainer}>
            <InitialCard />

          </View>
          <View style={styles.tabContainer} />
        </View>
      </View>

      {Platform.OS !== 'web' && menuPressed && (
        <>
          <TouchableOpacity style={styles.overlay} onPress={() => setMenuPressed(false)} />
          <Animated.View style={[styles.leftNavMobile, { transform: [{ translateX: slideAnim }] }]}>
            <LeftNavBarMobile
              items={[]} onSelect={(item) => {
              }}
            />
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  leftNav: {
    width: '20%',
    height: '100%'
  },
  content: {
    flex: 1,
    height: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'

  },
  tabContainer: {
    borderTopWidth: 2,
    borderTopColor: '#d3d3d3',
    marginTop: 16,
    display: 'none'
  },
  leftNavMobile: {
    position: 'absolute',
    width: '80%',
    height: '103%',
    backgroundColor: 'white',
    zIndex: 1001,
    top: 60
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000
  }
})

export default DashBoardScreen
