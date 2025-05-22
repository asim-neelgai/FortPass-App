import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import Form from './Form'
import * as Yup from 'yup'
import FormField from './FormField'
import Button from './Button'
import TextareaField from './TextFieldArea'

// interface AddressValues {
//   name: string
//   gender: string
//   company: string
//   firstAddress: string
//   secondAddress: string
//   city: string
//   state: string
//   postalCode: string
//   phoneNumber: string
//   collection: object
//   notes: string
// }

// interface CollectionModel {
//   collectionId: string
//   name: string
// }

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  gender: Yup.string().required().label('Gender'),
  company: Yup.string().required().label('Company'),
  firstAddress: Yup.string().required().label('Address 1'),
  secondAddress: Yup.string().required().label('Address 2'),
  city: Yup.string().label('City'),
  state: Yup.string().label('State'),
  postalCode: Yup.string().label('Postal Code'),
  phoneNumber: Yup.string()
    .matches(/^\d{1,10}$/, 'Phone number can be at most 10 numeric digits')
    .required()
    .label('Phone'),
  notes: Yup.string().label('Notes')
})

// const initialValues: AddressValues = {
//   name: '',
//   gender: '',
//   company: '',
//   firstAddress: '',
//   secondAddress: '',
//   city: '',
//   state: '',
//   postalCode: '',
//   phoneNumber: '',
//   collection: [],
//   notes: ''
// }

const AddressForm = (): JSX.Element => {
  const handleSubmit = (): any => {
    // Handle form submission
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Form
          initialValues={{
            name: '',
            gender: '',
            company: '',
            firstAddress: '',
            secondAddress: '',
            city: '',
            state: '',
            postalCode: '',
            phoneNumber: '',
            collection: '',
            notes: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Text style={styles.heading}>Address Details</Text>
          <View style={styles.form}>

            <View style={styles.inputField}>

              <FormField label='Name' name='name' placeholder='Your Name' />

            </View>
            <View style={styles.inputField}>

              <FormField label='Company' name='company' placeholder='Your Company' />

            </View>
            <View style={styles.inputField}>

              <FormField label='Address 1' name='firstAddress' placeholder='Address 1' />

            </View>
            <View style={styles.inputField}>

              <FormField label='Address 2' name='secondAddress' placeholder='Address 2' />

            </View>
            <View style={styles.inputField}>

              <FormField label='City' name='city' placeholder='Your City' />

            </View>
            <View style={styles.inputField}>

              <FormField label='State' name='state' placeholder='Your State' />

            </View>
            <View style={styles.inputField}>

              <FormField label='Postal Code' name='postalCode' placeholder='Your Code' />

            </View>
            <View style={styles.inputField}>
              <FormField label='Phone Number' name='phoneNumber' placeholder='Your Phone Number' />

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
      </ScrollView>
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

export default AddressForm
