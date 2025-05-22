import { InputModeOptions, KeyboardTypeOptions, StyleProp, TextStyle, View, Text, Pressable, Platform, TextInput } from 'react-native'
import React, { forwardRef, useState } from 'react'
import { ErrorMessage, useFormikContext } from 'formik'
import { FontAwesome } from '@expo/vector-icons'
import colors from '@/config/colors'

interface FormFieldProps {
  name: string
  label?: string
  style?: StyleProp<TextStyle>
  onChangeText?: (event: { target: { name: string, value: string } }) => void
  icon?: string
  inputMode?: InputModeOptions
  placeholder?: string
  keyboardType?: KeyboardTypeOptions | undefined
  secureTextEntry?: boolean
}

const FormField = forwardRef<TextInput, FormFieldProps>(({
  name,
  style,
  keyboardType,
  placeholder,
  onChangeText,
  inputMode = 'text',
  label,
  secureTextEntry
}, ref): JSX.Element => {
  const { setFieldValue } = useFormikContext()
  const [showPassword, setShowPassword] = useState(false)

  const handleTextChange = (value: string): void => {
    setFieldValue(name, value)
      .then(() => {
        if (typeof onChangeText === 'function') {
          onChangeText({ target: { name, value } })
        }
      })
      .catch(error => {
        console.error('Error while setting field value:', error)
      })
  }

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword)
  }

  return (
    <View>
      <Text style={{ fontSize: 14, fontStyle: 'normal', fontWeight: '500', marginBottom: 5 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          ref={ref}
          onChangeText={handleTextChange}
          style={{
            width: '100%',
            height: 40,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.gray,
            paddingHorizontal: 7
          }}
          inputMode={inputMode}
          placeholder={placeholder}
          placeholderTextColor='#C0C0C0'
          keyboardType={keyboardType}
          autoCorrect={false}
          autoCapitalize='none'
          secureTextEntry={!showPassword && secureTextEntry}
          textContentType='oneTimeCode'
        />
        {secureTextEntry !== undefined && (
          <Pressable onPress={togglePasswordVisibility} style={{ position: 'absolute', right: Platform.OS === 'web' ? 25 : 20, top: 10, zIndex: 100, width: 40, height: 30, flexDirection: 'row', justifyContent: 'center' }}>
            <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={18} color='black' />
          </Pressable>
        )}
      </View>
      <ErrorMessage name={name}>
        {msg => <Text style={{ color: 'red', fontSize: 12 }}>{msg}</Text>}
      </ErrorMessage>
    </View>
  )
})

export default FormField
