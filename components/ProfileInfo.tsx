import colors from '@/config/colors'
import AuthContext from '@/auth/context'
import React, { useContext } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

interface ProfileInfoProps {
  style?: object
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ style = {} }) => {
  const { emailAddress } = useContext(AuthContext)

  return (
    <View style={[styles.container, style]}>
      {
        Platform.OS === 'web' &&
          <Text style={{ fontSize: 18, fontWeight: 500 }}>{emailAddress}</Text>
      }
      <View style={styles.profileCircle}>
        <Text style={styles.profileInitial}>A</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingLeft: 18
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginLeft: 16
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black
  }
})

export default ProfileInfo
