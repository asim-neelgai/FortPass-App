import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { ErrorMessage, useFormikContext } from 'formik'
import colors from '@/config/colors'

interface TextareaFieldProps {
  label: string
  name: string
  value?: string
  isDisabled?: boolean
  fieldClassName?: keyof typeof styles
}

const TextareaField = ({
  label,
  name,
  value,
  isDisabled = false,
  fieldClassName
}: TextareaFieldProps): React.ReactElement => {
  const { handleChange, handleBlur, values } = useFormikContext<any>()

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        value={values[name] !== undefined ? values[name] : value}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        editable={!isDisabled}
        style={[
          styles.textarea,
          fieldClassName !== undefined ? styles[fieldClassName] : null
        ]}
        multiline
        numberOfLines={4}
      />
      <ErrorMessage name={name} component={Text} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    marginBottom: 4
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.gray,
    width: '100%',
    height: 80,
    padding: 8
  }
})

export default TextareaField
