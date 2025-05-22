import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Form from './Form'
import * as Yup from 'yup'
import FormField from './FormField'
import Button from './Button'
import TextareaField from './TextFieldArea'

// interface SecureFormValues {
//   name: string
//   collection: object
//   notes: string
// }
// interface CollectionModel {
//   collectionId: string
//   name: string
// }

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  notes: Yup.string().label('Notes')
})

// const initialValues: SecureFormValues = {
//   name: '',
//   collection: [],
//   notes: ''
// }

const SecureNotesForm = (): JSX.Element => {
  const handleSubmit = (values: any): any => {
    console.log(values, 'll')
    // Handle form submission
  }

  return (
    <View style={styles.container}>
      <Form
        initialValues={{
          name: '',
          collection: '',
          notes: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Text style={styles.heading}>Secure Note Details</Text>
        <View style={styles.form}>

          <View style={styles.inputField}>

            <FormField placeholder='Name' label='Name' name='name' />
          </View>
          <View style={styles.inputField}>

            <TextareaField label='Notes' name='notes' />

          </View>

        </View>
        <View style={styles.buttonContainer}>
          <Button>
            <Text
              style={{ color: 'white', fontSize: 14, fontWeight: '500' }}
            >
              Save
            </Text>
          </Button>
        </View>
      </Form>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff'
  },
  heading: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 20
  },
  form: {
    marginBottom: 20
  },
  inputField: {
    marginTop: 18
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 16,
    width: 120
  }
})

export default SecureNotesForm
