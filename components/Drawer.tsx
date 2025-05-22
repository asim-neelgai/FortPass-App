import React from 'react'
import { View, TouchableOpacity, ScrollView, StyleSheet, Modal, Text } from 'react-native'
import Image from './Image'
import colors from '@/config/colors'

interface DrawerProps {
  drawerOpen: boolean
  title?: React.ReactNode
  width?: string
  showBackArrow?: boolean
  children?: React.ReactNode
  handleClose?: () => void
  backArrow?: boolean
  handleBackClick?: () => void
  fromLeftNav?: boolean
}

const Drawer = ({
  drawerOpen,
  title,
  width = '50%',
  showBackArrow = false,
  children,
  handleClose,
  backArrow = false,
  handleBackClick,
  fromLeftNav = false
}: DrawerProps): React.ReactNode => {
  if (!drawerOpen) {
    return null
  }

  return (
    <Modal visible={drawerOpen} animationType='none' transparent>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={handleClose}>
          <View style={styles.transparentBackground} />
        </TouchableOpacity>
        <View style={[styles.drawer, { width }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Image source={require('@/assets/images/close.png')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>
          <View style={{ height: 1, width: '100%', backgroundColor: colors.gray, marginTop: 10 }} />
          <ScrollView style={styles.scrollView}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.09)'
  },
  overlayTouchable: {
    flex: 1
  },
  drawer: {
    backgroundColor: colors.white,
    maxHeight: '100%',
    height: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: '500'
  },
  scrollView: {
    padding: 16
  },
  transparentBackground: {
    flex: 1
  }
})

export default Drawer
