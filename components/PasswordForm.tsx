import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Form from './Form'
import * as Yup from 'yup'
import FormField from './FormField'
import Button from './Button'
import colors from '@/config/colors'
import TextareaField from './TextFieldArea'

// interface FormValues {
//   url: string
//   name: string
//   username: string
//   password: string
//   notes: string
// }

const validationSchema = Yup.object().shape({
  url: Yup.string().url().required().label('URL'),
  name: Yup.string().required().label('Name'),
  username: Yup.string().required().label('Username'),
  password: Yup.string().required().label('Password'),
  notes: Yup.string().label('Notes')
})

// const initialValues: FormValues = {
//   url: '',
//   name: '',
//   username: '',
//   password: '',
//   notes: ''
// }

const PasswordForm = (): JSX.Element => {
  const handleSubmit = (values: any): any => {
    console.log(values, 'values')
  }

  return (
    <View style={styles.container}>
      <Form
        initialValues={{
          url: '',
          name: '',
          username: 'secret.username',
          password: '',
          notes: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Text style={styles.heading}>Login Details</Text>
        <View style={styles.form}>
          <View style={styles.inputField}>

            <FormField
              label='URL' name='url' placeholder='URL'
            />
          </View>
          <View style={styles.inputField}>

            <FormField placeholder='Name' label='Name' name='name' />
          </View>
          <View style={styles.inputField}>

            <FormField placeholder='Username' label='Username' name='username' />
          </View>
          <View style={styles.inputField}>

            <FormField placeholder='Password' secureTextEntry label='Password' name='password' />
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
    backgroundColor: colors.white
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
  buttonContainer: {
    marginTop: 16,
    width: 120
  }
})

export default PasswordForm
