import React from 'react'
import Image from './Image'

interface HamburgerIconProps {
  onPress?: () => void
  color?: string
  size?: number
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ onPress, color = 'black', size = 30 }) => {
  return (
    <Image
      source={require('../assets/images/fi-rr-menu-burger.png')}
      onPress={onPress}
      style={{ height: 24, width: 24 }}
    />
  )
}

export default HamburgerIcon
