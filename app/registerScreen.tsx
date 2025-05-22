import React, { useContext, useState } from 'react'
import { StyleSheet, Pressable, View, Text, Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import * as Yup from 'yup'
import FormField from '@/components/FormField'
import Form from '@/components/Form'
import Button from '@/components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TopNavBar from '@/components/TopNavBar'
import colors from '@/config/colors'
import { setSessionStorage } from '@/helpers/storageHelper'
import { router } from 'expo-router'
import { Amplify } from 'aws-amplify'
import awsExports from '@/aws-exports'
import { deriveMasterKeyNative } from '@/helpers/crypto'
import TopNavBarMobile from '@/components/TopNavBarMobile'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthContext from '@/auth/context'
import { signUp } from 'aws-amplify/auth'

Amplify.configure(awsExports)

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Full Name'),
  email: Yup.string().email().required().label('Email'),
  password: Yup.string().min(8).required().label('Password'),
  confirmPassword: Yup.string()
    .required()
    .oneOf(
      [Yup.ref('password')],
      'Password confirmation must match the password'
    )
    .label('Confirm Password')
})

const RegisterForm = (): JSX.Element => {
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [showDropDown, setShowDropDown] = useState(false)
  const [error, setError] = useState('')
  const { setUserSub } = useContext(AuthContext)

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordHint: ''
  })

  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  })

  const handlePasswordChange = (event: { target: any }): any => {
    const { name, value } = event.target
    setFormValues({ ...formValues, [name]: value })

    if (value.trim() !== '') {
      const updatedRequirements = {
        length: value.length >= 8 && value.length <= 12,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[!@#$%^&*]/.test(value)
      }
      setRequirements(updatedRequirements)

      const allRequirementsMet = Object.values(updatedRequirements).every(
        (req) => req
      )

      setShowDropDown(!allRequirementsMet)
    } else {
      setShowDropDown(false)
    }
  }

  const onSubmit = async (formValues: any): Promise<void> => {
    try {
      if (!agreementChecked) {
        setError('Please check the Terms and Privacy Policy.')
        return
      }
      setFormValues({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        passwordHint: ''
      })

      const { email, password } = formValues

      const masterKey = await deriveMasterKeyNative(password, email)
      setSessionStorage('masterKey', masterKey.toString())
      setSessionStorage('email', email)

      const updatedFormValues = {
        ...formValues,
        password: masterKey.toString()
      }

      const registerResponse = await signUp({
        username: updatedFormValues.email,
        password: updatedFormValues.password
      })
      if (registerResponse?.userId !== undefined) {
        setUserSub(registerResponse.userId)
        router.push('/verificationScreen')
      } else {
        throw new Error('Registration response is missing UserSub')
      }
    } catch (error) {
      console.error('Registration failed: ', error)
      setError('Registration failed. Please try again.')
    }
  }

  const toggleAgreement = (): void => {
    setAgreementChecked(!agreementChecked)
  }

  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      {Platform.OS === 'web'
        ? (
          <TopNavBar fromRegister />
          )
        : (
          <View style={{ height: 100, zIndex: 101 }}>

            <TopNavBarMobile />
          </View>
          )}

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: Platform.OS === 'web' ? 0 : 40 }}
        >
          <Form
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              passwordHint: ''
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <View style={styles.container}>
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontStyle: 'normal',
                    fontWeight: '700'
                  }}
                >
                  Create an account
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: '400'
                  }}
                >
                  Let’s get started by signing up for our app.
                </Text>
                <View style={styles.inputField}>
                  <FormField
                    name='name'
                    placeholder='Your Full Name'
                    label='Full Name'
                  />
                </View>
                <View style={styles.inputField}>
                  <FormField
                    name='email'
                    placeholder='Email address'
                    label='Email Address'
                  />
                </View>
                <View style={[styles.inputField1]}>
                  <FormField
                    name='password'
                    placeholder='Master Password'
                    label='Master Password'
                    secureTextEntry
                    onChangeText={handlePasswordChange}
                  />
                </View>
                {showDropDown && (
                  <View
                    style={{
                      backgroundColor: colors.white,
                      zIndex: 100,
                      position: 'absolute',
                      bottom: Platform.OS === 'ios' ? 0 : -20,
                      padding: Platform.OS === 'web' ? 25 : 15,
                      borderWidth: 1,
                      borderRadius: 12,
                      borderColor: colors.gray,
                      width: '100%'
                    }}
                  >
                    <Text style={{ fontSize: 17, fontWeight: '500' }}>
                      Minimum Requirement for password:
                    </Text>
                    <View style={{ marginTop: 24 }}>
                      <View style={styles.checkItem}>
                        {!requirements.length
                          ? (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.danger}
                            />
                            )
                          : (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.success}
                            />
                            )}
                        <Text style={styles.checkText}>
                          Passwords should have a minimum length, often ranging
                          from 8 to 12 characters
                        </Text>
                      </View>
                      <View style={styles.checkItem}>
                        {!requirements.uppercase
                          ? (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.danger}
                            />
                            )
                          : (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.success}
                            />
                            )}
                        <Text style={styles.checkText}>
                          Include at least one uppercase letter
                        </Text>
                      </View>
                      <View style={styles.checkItem}>
                        {!requirements.lowercase
                          ? (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.danger}
                            />
                            )
                          : (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.success}
                            />
                            )}
                        <Text style={styles.checkText}>
                          Include at least one lowercase letter
                        </Text>
                      </View>
                      <View style={styles.checkItem}>
                        {!requirements.number
                          ? (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.danger}
                            />
                            )
                          : (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.success}
                            />
                            )}
                        <Text style={styles.checkText}>
                          Include at least one numerical digit
                        </Text>
                      </View>
                      <View style={styles.checkItem}>
                        {!requirements.specialChar
                          ? (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.danger}
                            />
                            )
                          : (
                            <MaterialIcons
                              name='check'
                              size={18}
                              color={colors.success}
                            />
                            )}
                        <Text style={styles.checkText}>
                          Include at least one special character (e.g., !, @, #,
                          $, %, etc.)
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                <View style={styles.inputField}>
                  <FormField
                    name='confirmPassword'
                    placeholder='Confirm Master Password'
                    label='Confirm Password'
                    secureTextEntry
                  />
                </View>
                <View style={styles.inputField}>
                  <FormField
                    name='passwordHint'
                    placeholder='Your Password Hint'
                    label='Password Hint'
                  />
                </View>
                <View
                  style={{
                    marginBottom: 15,
                    marginTop: 15,
                    flexDirection: 'row'
                  }}
                >
                  <Pressable onPress={toggleAgreement}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderWidth: 1,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: agreementChecked
                          ? colors.success
                          : 'transparent'
                      }}
                    >
                      {agreementChecked && (
                        <MaterialIcons
                          name='check'
                          size={18}
                          color={colors.white}
                        />
                      )}
                    </View>
                  </Pressable>
                  <Text style={styles.agreementText}>
                    By completing this form, I agree to the Terms and Privacy
                    Policy
                  </Text>
                </View>
                <Button>
                  <Text
                    style={{ color: 'white', fontSize: 14, fontWeight: '500' }}
                  >
                    Create
                  </Text>
                </Button>
              </View>
              <Text style={styles.error}>{error}</Text>
            </View>
          </Form>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Platform.OS === 'web' ? 66 : 20,
    paddingHorizontal: Platform.OS === 'web' ? 79 : 49,
    backgroundColor: colors.white,
    borderRadius: 8,
    ...Platform.select({
      web: {},
      default: { flex: 1 }
    })
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%'
  },
  inputField1: {
    marginTop: 18,
    position: 'relative'
  },
  errorText: {
    color: colors.danger,
    marginBottom: 10
  },
  inputField: {
    marginTop: 18
  },
  agreementText: {
    marginBottom: 10,
    marginLeft: 10,
    maxWidth: 300
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },
  buttonText: {
    color: colors.white
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: colors.white
  },
  checkText: {
    marginLeft: 5,
    flex: 1,
    flexWrap: 'wrap'
  },
  error: {
    color: colors.danger,
    marginTop: 10
  }
})

export default RegisterForm
