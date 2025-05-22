import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'

export function useThemeColor (
  props: { light?: string, dark?: string },
  colorName: keyof typeof Colors['light'] & keyof typeof Colors['dark']
): string {
  const theme = useColorScheme() ?? 'light'
  const colorFromProps = props[theme]

  if (colorFromProps !== undefined) {
    return colorFromProps
  } else {
    return Colors[theme][colorName]
  }
}
