import React from 'react'
import { View, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native'
import Image from './Image'
import colors from '@/config/colors'

interface SearchFieldProps extends TextInputProps {
  style?: object
}

const SearchField: React.FC<SearchFieldProps> = ({ style, ...props }) => {
  return (
    <View style={[styles.container, style]}>
      <Image source={require('../assets/images/fi-rr-search.png')} style={{ height: 20, width: 20, marginRight: 10 }} />
      <TextInput
        style={styles.input}
        placeholder='Search my vault...'
        placeholderTextColor='#888'
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 17,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    height: 48,
    width: Platform.OS === 'web' ? 305 : 180
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 8
  }
})

export default SearchField
