import React, { useEffect, useRef, useState } from 'react'
import { TouchableOpacity, StyleSheet, Image, Animated, Dimensions, View, ViewStyle } from 'react-native'
// import HamburgerIcon from '@/components/HamburgerIcon'
import NavBarContentMobile from '@/components/NavBarContentMobile'
import colors from '@/config/colors'
import { router } from 'expo-router'

interface TopNavBarMobileProps {
  onDrawerToggle?: (isOpen: boolean) => void
  style?: ViewStyle
}

const { width } = Dimensions.get('window')

const TopNavBarMobile: React.FC<TopNavBarMobileProps> = ({ onDrawerToggle, style }): JSX.Element => {
  const [menuPressed, setMenuPressed] = useState(false)
  const slideAnim = useRef(new Animated.Value(width)).current

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuPressed ? 0 : width,
      duration: 300,
      useNativeDriver: false
    }).start()
  }, [menuPressed])

  // const openDrawer = (): void => {
  //   setMenuPressed(true)
  //   if (onDrawerToggle != null) {
  //     onDrawerToggle(true)
  //   }
  // }

  const closeDrawer = (): void => {
    setMenuPressed(false)
    if (onDrawerToggle != null) {
      onDrawerToggle(false)
    }
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 155, height: 49 }}
        />

      </TouchableOpacity>
      {/* <TouchableOpacity onPress={openDrawer} style={{ zIndex: 100 }}>
        <HamburgerIcon />
      </TouchableOpacity> */}
      {menuPressed && (
        <>
          <TouchableOpacity style={styles.overlay} onPress={closeDrawer} />
          <Animated.View style={[styles.rightNavMobile, { transform: [{ translateX: slideAnim }] }]}>
            <NavBarContentMobile closeDrawer={closeDrawer} />
          </Animated.View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    maxWidth: '100%',
    maxHeight: '100%',
    flex: 1,
    zIndex: 100
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '90%',
    height: '100%',
    zIndex: 1000,
    backgroundColor: colors.white
  },
  rightNavMobile: {
    position: 'absolute',
    width: '90%',
    height: '100%',
    backgroundColor: colors.white,
    zIndex: 1001,
    top: 0,
    right: 0
  }
})

export default TopNavBarMobile
