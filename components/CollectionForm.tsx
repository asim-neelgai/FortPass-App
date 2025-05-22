import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import * as Yup from 'yup'
import Button from './Button'
import Form from './Form'
import FormField from './FormField'
import colors from '@/config/colors'

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Collection Name is required')
    .min(2, 'Collection Name must be at least 2 characters')
    .max(50, 'Collection Name must be at most 50 characters')
})

const CollectionForm = (): JSX.Element => {
  const handleSubmit = async (formValues: any): Promise<void> => {
    console.log(formValues, 'values')
  }

  return (
    <View style={styles.container}>
      <Form
        initialValues={{
          name: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Text style={styles.heading}>Create Collection</Text>
        <View style={styles.form}>
          <View style={styles.inputField}>

            <FormField
              label='Collection' name='name' placeholder='Create Collection'
            />
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

export default CollectionForm
