import { TouchableOpacity } from 'react-native'
import React, { ReactNode, useState } from 'react'
import { useFormikContext } from 'formik'
import colors from '@/config/colors'

interface ButtonProps {
  children: ReactNode
  onPress?: () => void
  loading?: boolean
  disabled?: boolean
}

export default function Button ({
  children,
  onPress,
  loading = false,
  disabled = false
}: ButtonProps): React.ReactElement {
  const { handleSubmit } = useFormikContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleButtonPressed = (): void => {
    setIsLoading(true)
    Promise.resolve(handleSubmit())
      .then(() => {
        if (onPress != null) {
          onPress()
        }
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      })
  }

  const isDisabled = isLoading || disabled

  return (
    <TouchableOpacity
      onPress={handleButtonPressed}
      style={{
        backgroundColor: colors.primary,
        maxWidth: '100%',
        height: 48,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isDisabled ? 0.6 : 1
      }}
      disabled={isDisabled}
    >
      {children}
    </TouchableOpacity>
  )
}
