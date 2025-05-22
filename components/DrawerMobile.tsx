import React from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Modal, ScrollView, Text, Platform } from 'react-native'
import Image from './Image'

const { width, height } = Dimensions.get('window')

interface DrawerMobileProps {
  visible: boolean
  onClose: () => void
  children?: React.ReactNode
  title?: React.ReactNode
}

const DrawerMobile: React.FC<DrawerMobileProps> = ({ visible, onClose, children, title }) => {
  return (
    <Modal
      visible={visible}
      animationType='none'
      transparent
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose}>
          <View />
        </TouchableOpacity>
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={require('@/assets/images/close.png')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>
          <ScrollView>
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  drawer: {
    width,
    height,
    backgroundColor: 'white',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 30 : 0
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
  overlayTouchable: {
    flex: 1
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default DrawerMobile
