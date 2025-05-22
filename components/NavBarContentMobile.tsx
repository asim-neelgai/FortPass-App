import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import colors from '@/config/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

interface NavBarContentMobileProps {
  closeDrawer: () => void
}

const NavBarContentMobile: React.FC<NavBarContentMobileProps> = ({ closeDrawer }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
        <MaterialIcons name='close' size={28} color='black' />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem} onPress={() => {
          router.push('/')
          closeDrawer()
        }}
      >
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Why FortLock?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>FAQ's</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 30, maxWidth: 115 }}>
        <TouchableOpacity style={styles.loginItem} onPress={() => router.push('/loginScreen')}>
          <Text style={styles.menuText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.SignUpItem} onPress={() => router.push('/registerScreen')}>
          <Text style={{ fontSize: 14, color: colors.white }}>Sign Up</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.white,
    zIndex: 100,
    height: 900,
    paddingHorizontal: 30
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 100
  },
  menuItem: {
    marginVertical: 15
  },
  menuText: {
    fontSize: 14,
    color: colors.black
  },
  loginItem: {
    borderWidth: 0.5,
    borderColor: colors.gray,
    borderRadius: 8,
    marginVertical: 15,
    paddingHorizontal: 30,
    paddingVertical: 5,
    padding: 5
  },
  SignUpItem: {
    borderWidth: 0.5,
    borderColor: colors.gray,
    borderRadius: 8,
    marginVertical: 15,
    paddingHorizontal: 30,
    paddingVertical: 5,
    backgroundColor: colors.primary
  }
})

export default NavBarContentMobile
