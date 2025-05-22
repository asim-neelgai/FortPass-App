import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native'
import { Formik, FieldArray, FormikProps } from 'formik'
import * as Yup from 'yup'
import Button from '@/components/Button'
import FormField from '@/components/FormField'
import Image from './Image'
import colors from '@/config/colors'

interface EnvVariablesProps {
  id?: string
  handleReload?: () => void
  handleDrawerCloseClicked?: () => void
  className?: string
}
interface CollectionModel {
  collectionId: string
  name: string
}
interface EnvValues {
  name: string
  url: string
  collection: CollectionModel[]
  keyValues: Array<{ key: string, value: string }>
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  url: Yup.string().required('URL is required').url('Invalid URL format')
})

const EnvironmentVariablesForm = ({
  id,
  handleReload,
  handleDrawerCloseClicked,
  className = ''
}: EnvVariablesProps): JSX.Element => {
  const [envrionmentData] = useState<EnvValues>({
    name: '',
    url: '',
    collection: [],
    keyValues: [{ key: '', value: '' }]
  })
  // const [collections, setCollections] = useState<Array<{ name: string, id: string }>>([])
  // const [collectionData, setCollectionData] = useState<CollectionModel[]>([])
  // const [isLoading, setIsLoading] = useState(true)

  const handleSubmit = async (values: EnvValues, { resetForm }: { resetForm: () => void }): Promise<void> => {
    console.log(values, 'values')
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={envrionmentData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }: FormikProps<EnvValues>) => (
          <View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <FormField label='Project Name' name='name' placeholder='Project Name' />
              </View>
              <View style={{ flex: 1 }}>
                <FormField label='Project URL' name='url' placeholder='Project URL' />
              </View>
            </View>
            {/* {collections.length !== 0 && (
              <View style={styles.selectContainer}>
                <MultipleSelect label='Collection' name='collection' data={collections} setData={collectionData} />
              </View>
            )} */}
            <FieldArray name='keyValues'>
              {({ push, remove }) => (
                <View style={styles.keyValuesContainer}>
                  <View style={styles.keyValueLabels}>
                    <Text>Key</Text>
                    <Text style={styles.valueLabel}>Value</Text>
                  </View>
                  {values.keyValues.map((_, index) => (
                    <View key={index} style={styles.keyValueRow}>
                      <TextInput
                        style={styles.input}
                        placeholder='Add Key'
                        value={values.keyValues[index].key}
                        onChangeText={text => {
                          setFieldValue(`keyValues.${index}.key`, text)
                            .catch(error => console.error('Error setting field value:', error))
                        }}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder='Add Value'
                        value={values.keyValues[index].value}
                        onChangeText={text => {
                          setFieldValue(`keyValues.${index}.value`, text)
                            .catch(error => console.error('Error setting field value:', error))
                        }}
                      />
                      {values.keyValues.length === index + 1
                        ? (
                          <TouchableOpacity style={styles.addButton} onPress={() => push({ key: '', value: '' })}>
                            <Image source={require('@/assets/images/add-icon.png')} style={{ width: 48, height: 48 }} />
                          </TouchableOpacity>
                          )
                        : (
                          <TouchableOpacity style={styles.removeButton} onPress={() => remove(index)}>
                            <Image source={require('@/assets/images/delete-icon.png')} style={{ width: 48, height: 48 }} />
                          </TouchableOpacity>
                          )}
                    </View>
                  ))}
                </View>
              )}
            </FieldArray>
            <View style={styles.buttonContainer}>
              <Button>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Save</Text>
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 40
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 40
  },
  keyValuesContainer: {
    marginTop: 24
  },
  keyValueLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  valueLabel: {
    position: 'absolute',
    right: 400
  },
  keyValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16
  },
  input: {
    borderWidth: 0.5,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginRight: 8
  },
  addButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00aaff',
    borderRadius: 24
  },
  removeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff0000',
    borderRadius: 24
  },
  buttonContainer: {
    marginTop: 16,
    width: 120
  }
})

export default EnvironmentVariablesForm
