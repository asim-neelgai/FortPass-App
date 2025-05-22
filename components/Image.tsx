import React from 'react'
import { View, Image as ImageNative, StyleSheet, ImageSourcePropType, ImageStyle } from 'react-native'

interface ImageProps {
  source: ImageSourcePropType
  style?: ImageStyle
  onPress?: () => void
}

const Image: React.FC<ImageProps> = ({ source, style }) => {
  return (
    <View style={styles.container}>
      <ImageNative source={source} style={[styles.image, style]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'cover'
  }
})

export default Image
