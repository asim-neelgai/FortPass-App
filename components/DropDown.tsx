import React, { ReactNode, useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Modal,
  Platform,
  Image as RNImage
} from 'react-native'
import colors from '@/config/colors'

interface DropdownProps {
  items?: DropdownItem[]
  buttonTitle?: string
  showIcon?: boolean
}

export interface DropdownItem {
  content?: ReactNode
  icon?: ReactNode
  onPress?: () => void
}

const Dropdown = ({
  items,
  buttonTitle,
  showIcon
}: DropdownProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<TouchableOpacity>(null)

  const openDropdown = (): void => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownPosition({ top: pageY + height, right: Platform.OS === 'web' ? window.innerWidth - pageX - width : 20 })
    })
    setIsOpen(true)
  }

  const closeDropdown = (): void => {
    setIsOpen(false)
  }

  const dropdownContentStyles = StyleSheet.create({
    dropdownContent: {
      position: 'absolute',
      zIndex: 100,
      right: dropdownPosition.right,
      top: dropdownPosition.top,
      backgroundColor: colors.white,
      borderRadius: 8,
      paddingHorizontal: 20,
      width: Platform.OS !== 'web' ? 160 : 220
    }
  })

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity
        style={[styles.button]}
        onPress={openDropdown}
        ref={buttonRef}
      >
        {showIcon !== undefined
          ? (
            <View>
              <RNImage
                source={require('@/assets/images/menu-item.png')}
                style={{ width: 24, height: 24 }}
              />
            </View>
            )
          : (
            <>
              <Text style={styles.buttonText}>{buttonTitle}</Text>
              <RNImage
                source={require('@/assets/images/caret-down.png')}
                style={{ width: 12, height: 12 }}
              />
            </>
            )}
      </TouchableOpacity>

      <Modal
        transparent
        visible={isOpen}
        animationType='none'
        onRequestClose={closeDropdown}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={dropdownContentStyles.dropdownContent}>
                {items?.map((item, index) => (
                  <View
                    key={index}
                    style={styles.item}
                  >
                    <TouchableOpacity
                      style={styles.itemContent}
                      onPress={() => {
                        if (item.onPress != null) {
                          item.onPress()
                        }
                        setIsOpen(false)
                      }}
                    >
                      {item.icon !== undefined && <View style={styles.icon}>{item.icon}</View>}
                      <Text style={styles.content}>{item.content}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    position: 'relative',
    alignItems: 'center'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative'
  },
  buttonText: {
    marginRight: 5
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    paddingVertical: 10
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginRight: 10
  },
  content: {
    flex: 1
  }
})

export default Dropdown
