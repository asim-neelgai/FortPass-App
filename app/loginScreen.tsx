import Button from '@/components/Button'
import Form from '@/components/Form'
import FormField from '@/components/FormField'
import TopNavBar from '@/components/TopNavBar'
import TopNavBarMobile from '@/components/TopNavBarMobile'
import colors from '@/config/colors'
import { deriveMasterKeyNative } from '@/helpers/crypto'
import { router } from 'expo-router'
import AuthContext from '@/auth/context'
import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Platform
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Yup from 'yup'
import { FormikHelpers } from 'formik'
import { signIn, signOut } from 'aws-amplify/auth'

interface FormValues {
  email: string
  password: string
}

const LoginForm = (): JSX.Element => {
  const [error, setError] = useState<string>('')
  const { setEmailAddress } = useContext(AuthContext)

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required().label('Email'),
    password: Yup.string().required().label('Password')
  })

  useEffect(() => {
    const signOutUser = async (): Promise<void> => {
      try {
        await signOut()
      } catch (signOutError) {
        console.error('Error signing out:', signOutError)
      }
    }
    void signOutUser()
  }, [])

  const onSubmit = async (values: { [key: string]: any }, formikHelpers: FormikHelpers<FormValues>): Promise<void> => {
    try {
      const { email, password } = values
      const masterKey = await deriveMasterKeyNative(password, email)
      const updatedFormValues = {
        email,
        password: masterKey.toString()
      }
      const loginResponse = await signIn({
        username: updatedFormValues.email,
        password: updatedFormValues.password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH'
        }
      })
      if (loginResponse?.isSignedIn) {
        try {
          setEmailAddress(updatedFormValues.email)
          setError('')
          router.push('/dashboardScreen')
        } catch (navigationError) {
          console.error('Navigation failed:', navigationError)
          setError('Navigation to dashboard failed. Please try again.')
        }
      }
    } catch (error) {
      console.log('error', error)
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <SafeAreaView style={[{ flex: 1 }]}>

      {Platform.OS === 'web'
        ? (
          <TopNavBar fromLogin />
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
        <View style={{ flex: 1, justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start', alignItems: 'center', paddingVertical: Platform.OS === 'web' ? 0 : 40 }}>
          <Form
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <View style={styles.container}>
              <View>
                <Text style={styles.title}>Log in</Text>
                <Text style={styles.subtitle}>Please sign in to continue</Text>
                <View>
                  <View style={styles.inputField}>
                    <FormField
                      name='email'
                      placeholder='Email address'
                      label='Email Address'
                    />
                  </View>
                  <View style={styles.inputField}>
                    <FormField
                      name='password'
                      placeholder='Master Password'
                      label='Master Password'
                      secureTextEntry
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginBottom: 15,
                  marginTop: 48,
                  gap: 5
                }}
              >
                <Button>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                    Login
                  </Text>
                </Button>
              </View>
              <Text style={styles.error}>{error}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={styles.signupText}>New to Fort Lock?</Text>
                <Text
                  style={styles.signupLink}
                  onPress={() => router.push('/registerScreen')}
                >
                  Create a new account
                </Text>
              </View>
            </View>
          </Form>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Platform.OS === 'web' ? 66 : 50,
    paddingHorizontal: 79,
    backgroundColor: colors.white,
    borderRadius: 8,
    ...Platform.select({
      web: {},
      default: { flex: 1 }
    })
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  signupText: {
    gap: 10,
    fontSize: 16,
    fontWeight: '400'
  },
  signupLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: '400'

  },
  inputField: {
    marginTop: 18
  }
})

export default LoginForm
