import { Modal as ModalNative, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

interface ModalProps {
  visible?: boolean
  onDismiss?: any
  children: JSX.Element | JSX.Element[]
  contentContainerStyle?: any
  backDropStyle?: any
}
export default function Modal (props: ModalProps): JSX.Element | null {
  console.log('modal')
  if (props.visible === false || props.visible === undefined) return null
  return (
    <ModalNative animationType='fade' visible={props.visible} transparent>
      <TouchableWithoutFeedback onPress={props.onDismiss}>
        <View style={[styles.backDrop, props.backDropStyle]}>
          <View style={[styles.contentContainer, props.contentContainerStyle]}>
            {props.children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ModalNative>
  )
}

const styles = StyleSheet.create({
  backDrop: {
    flex: 1,
    backgroundColor: 'blue'
  },
  contentContainer: {
    backgroundColor: 'gray'
  }
})
