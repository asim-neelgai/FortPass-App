import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Form from './Form'
import * as Yup from 'yup'
import FormField from './FormField'
import Button from './Button'
import TextareaField from './TextFieldArea'

// interface BankFormValues {
//   name: string
//   accountType: string
//   pin: string
//   address: string
//   phone: string
//   collection: object
//   notes: string
// }
// interface CollectionModel {
//   collectionId: string
//   name: string
// }

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  accountType: Yup.string().required().label('Account Type'),
  pin: Yup.string().required().label('PIN'),
  address: Yup.string().required().label('Address'),
  phone: Yup.string()
    .matches(/^\d{1,10}$/, 'Phone number can be at most 10 numeric digits')
    .required()
    .label('Phone'),
  notes: Yup.string().label('Notes')
})

// const initialValues: BankFormValues = {
//   name: '',
//   accountType: '',
//   pin: '',
//   address: '',
//   phone: '',
//   collection: [],
//   notes: ''
// }

const BankAccountsForm = (): JSX.Element => {
  const handleSubmit = (): any => {
    // Handle form submission
  }

  return (
    <View style={styles.container}>
      <Form
        initialValues={{
          name: '',
          accountType: '',
          pin: '',
          address: '',
          phone: '',
          collection: '',
          notes: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Text style={styles.heading}>Bank Details</Text>
        <View style={styles.form}>

          <View style={styles.inputField}>

            <FormField label='Bank Name' name='name' placeholder='Your Bank Name' />

          </View>
          <View style={styles.inputField}>

            <FormField label='Account Type' name='accountType' placeholder='Your Account Type' />

          </View>
          <View style={styles.inputField}>

            <FormField label='PIN' name='pin' placeholder='Your PIN' />

          </View>
          <View style={styles.inputField}>

            <FormField label='Address' name='address' placeholder='Your Address' />

          </View>
          <View style={styles.inputField}>

            <FormField label='Phone' name='phone' placeholder='Your Phone' />

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
  buttonContainer: {
    marginTop: 16,
    width: 120
  }
})

export default BankAccountsForm
