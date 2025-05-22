import React from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image
} from 'react-native'
import colors from '@/config/colors'
import { router } from 'expo-router'

interface NavigationProps {
  handleScroll?: (sectionId: string) => void
  fromLogin?: boolean
  fromRegister?: boolean
}

const Navigation = ({
  fromLogin = false,
  fromRegister = false
}: NavigationProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <View style={styles.navbarContent}>
          <Pressable onPress={() => router.push('/')}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 155, height: 49 }}
            />
          </Pressable>
          <View style={styles.navLinks}>
            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.navLink}>Home</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.navLink}>Why FortLock?</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.navLink}>FAQ's</Text>
            </Pressable>
          </View>
          <View style={styles.authLinks}>
            {!fromLogin && (
              <Pressable
                style={styles.loginButton}
                onPress={() => router.push('/loginScreen')}
              >
                <Text style={styles.loginText}>Log In</Text>
              </Pressable>
            )}
            {!fromRegister && (
              <Pressable
                style={styles.signUpButton}
                onPress={() => router.push('/registerScreen')}
              >
                <Text style={styles.signUpText}>Sign Up</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 71
  },
  navbar: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    height: '100%'
  },
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 80
  },
  navLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 50
  },
  navLink: {
    color: colors.black,
    fontWeight: '500',
    fontSize: 14
  },
  authLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    gap: 25
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    width: 96,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray
  },
  loginText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '500'
  },
  signUpButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    width: 96,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  signUpText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500'
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8
  }
})

export default Navigation
