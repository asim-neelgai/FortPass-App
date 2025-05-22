import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Form from './Form'
import * as Yup from 'yup'
import FormField from './FormField'
import Button from './Button'
import TextareaField from './TextFieldArea'
import DatePicker from './DatePicker'

// interface PaymentValues {
//   name: string
//   cardHolder: string
//   number: string
//   expire: string
//   securityCode: string
//   notes: string
// }

// interface CollectionModel {
//   collectionId: string
//   name: string
// }

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  cardHolder: Yup.string().required().label('Card Holder Name'),
  number: Yup.number().required().label('Number'),
  expire: Yup.string().required().label('Expiration Date'),
  securityCode: Yup.string().required().label('Security Code'),
  notes: Yup.string().label('Notes')
})

// const initialValues: PaymentValues = {
//   name: '',
//   cardHolder: '',
//   number: '',
//   expire: '',
//   securityCode: '',
//   notes: ''
// }

const PaymentForm = (): JSX.Element => {
  const handleSubmit = (values: any): any => {
    console.log(values, 'values')
    // Handle form submission
  }

  return (
    <View style={styles.container}>
      <Form
        initialValues={{
          name: '',
          cardHolder: '',
          number: '',
          expire: '',
          securityCode: '',
          notes: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Text style={styles.heading}>Payment Method Details</Text>
        <View style={styles.form}>

          <View style={styles.inputField}>

            <FormField label='Name' name='name' placeholder='Your Name' />

          </View>
          <View style={styles.inputField}>

            <FormField label='Card Holder Name' name='cardHolder' placeholder='Card Holder' />

          </View>
          <View style={styles.inputField}>

            <FormField label='Number' name='number' placeholder='Your Number' />

          </View>
          <View style={styles.inputField}>

            <DatePicker name='expire' label='Expiration Date' />

          </View>
          <View style={styles.inputField}>

            <FormField label='Security Code' name='securityCode' placeholder='Your Security Code' />

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

export default PaymentForm
