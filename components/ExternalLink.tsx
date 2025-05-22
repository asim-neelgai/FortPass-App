import { Link } from 'expo-router'
import { openBrowserAsync } from 'expo-web-browser'
import React, { ComponentProps } from 'react'
import { Platform, GestureResponderEvent } from 'react-native'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

export function ExternalLink ({ href, ...rest }: Props): JSX.Element {
  const handlePress = async (event: GestureResponderEvent | React.MouseEvent<HTMLAnchorElement, MouseEvent>): Promise<void> => {
    if (Platform.OS !== 'web') {
      event.preventDefault()
      await openBrowserAsync(href)
    }
  }

  return (
    <Link
      target='_blank'
      rel='noreferrer'
      {...rest}
      href={href}
      onPress={(event: GestureResponderEvent | React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        handlePress(event).catch((error) => {
          console.error('Failed to open browser:', error)
        })
      }}
    />
  )
}
