import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, Platform, Pressable } from 'react-native'
import * as Yup from 'yup'
import Button from '@/components/Button'
import FormField from '@/components/FormField'
import cognitoHelpers from '@/helpers/cognitoHelpers'
import { getSessionStorage } from '@/helpers/storageHelper'
import Form from '@/components/Form'
import TopNavBar from '@/components/TopNavBar'
import colors from '@/config/colors'
import { router } from 'expo-router'
import TopNavBarMobile from '@/components/TopNavBarMobile'
import AuthContext from '@/auth/context'
import { FormikHelpers } from 'formik'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import useQuery from '@/graphQL/hooks/useQuery'
import userProfileQuery from '@/graphQL/query/userProfileQuery'
import vaultQuery from '@/graphQL/query/vaultQuery'
import { confirmSignUp, signIn, signOut } from 'aws-amplify/auth'
import vaultAccessQuery from '@/graphQL/query/vaultAccessQuery'
import { VaultOwnerEnums } from '../enums/enums'

interface FormValues {
  confirmationCode: string
}

const validationSchema = Yup.object().shape({
  confirmationCode: Yup.string().required().label('Confirmation code')
})

const VerificationForm = (): JSX.Element => {
  const [error, setError] = useState<string>('')
  const [sessionEmail, setSessionEmail] = useState<string>('')
  const [timer, setTimer] = useState<number>(0)
  const { userSub } = useContext(AuthContext)
  const createUserQuery = useQuery(userProfileQuery.createUser)
  const createVaultQuery = useQuery(vaultQuery.createVault)
  const createVaultAccessQuery = useQuery(
    vaultAccessQuery.createVaultAccessControl
  )

  useEffect(() => {
    const fetchEmail = async (): Promise<void> => {
      try {
        const email = getSessionStorage('email')
        setSessionEmail(email ?? '')
      } catch (error) {
        console.error('Error retrieving email from session storage: ', error)
      }
    }
    void fetchEmail()
  }, [])

  useEffect(() => {
    let timerId: NodeJS.Timeout
    if (timer > 0) {
      timerId = setTimeout(() => setTimer(timer - 1), 1000)
    }
    return () => clearTimeout(timerId)
  }, [timer])

  const handleFormSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ): Promise<void> => {
    const username = getSessionStorage('email') ?? ''
    const masterKey = getSessionStorage('masterKey') ?? ''
    const confirmationCode = values.confirmationCode

    try {
      const confirmResponse = await confirmSignUp({
        username,
        confirmationCode
      })
      if (!confirmResponse?.isSignUpComplete) {
        throw new Error(
          'Verification failed. Please check the confirmation code and try again.'
        )
      }

      await signInUser(username, masterKey)
      await createUserProfile(username)
      router.push('/dashboardScreen')
      const vaultId = await createVault()
      if (vaultId !== undefined) {
        await createVaultAccess(vaultId)
      } else {
        throw new Error('Failed to create vault. Vault ID is not valid.')
      }
    } catch (error) {
      console.error('Verification failed: ', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Verification failed. Please check the confirmation code and try again.'
      setError(errorMessage)
    }
  }

  const signInUser = async (
    username: string,
    password: string
  ): Promise<void> => {
    await signOut() // Ensure any existing user session is signed out before attempting to sign in a new user
    try {
      await signIn({
        username,
        password,
        options: { authFlowType: 'USER_PASSWORD_AUTH' }
      })
    } catch (error) {
      console.error('Sign in failed:', error)
      throw new Error('Sign in failed. Please try again.')
    }
  }

  const createUserProfile = async (email: string): Promise<void> => {
    try {
      await createUserQuery.request({ id: userSub, email })
    } catch (error) {
      console.error('Failed to create user profile:', error)
      throw new Error('User creation failed. Please try again later.')
    }
  }

  const createVault = async (): Promise<string> => {
    try {
      const res = await createVaultQuery.request({
        owner: VaultOwnerEnums.USER,
        userId: userSub
      })
      return res?.data?.id
    } catch (error) {
      console.error('Failed to create vault:', error)
      throw new Error('Vault creation failed. Please try again later.')
    }
  }

  const createVaultAccess = async (vaultId: string): Promise<void> => {
    try {
      await createVaultAccessQuery.request({
        giverUserId: vaultId,
        accessType: 'VAULT_ITEM', // this accessType is used for initial vaultAccess
        accessTo: 'USER',
        grantedUserId: vaultId,
        operation: 'MANAGE'
      })
    } catch (error) {
      console.error('Failed to create vault access:', error)
      throw new Error('Vault Access creation failed. Please try again later.')
    }
  }

  const handleResendPress = (): void => {
    const username = getSessionStorage('email') ?? ''
    cognitoHelpers
      .resendConfirmationCode(username)
      .then(() => {
        setTimer(59)
      })
      .catch((error) => {
        console.error('Resend failed: ', error)
        setError('Failed to resend confirmation code. Please try again.')
      })
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Form
            initialValues={{ confirmationCode: '' }}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            <View style={styles.container}>
              {error !== '' && <Text style={styles.errorText}>{error}</Text>}
              <View style={styles.header}>
                <Text style={styles.title}>Email Verification</Text>
                <Text style={styles.description}>
                  Please enter the verification code sent to
                </Text>
                <Text style={styles.email}>{sessionEmail}</Text>
              </View>
              <View style={{ marginBottom: 18 }}>
                <FormField
                  name='confirmationCode'
                  placeholder='Verification Code'
                  label='Verification Code'
                />
              </View>
              <Button>
                <Text
                  style={{ color: 'white', fontSize: 14, fontWeight: '500' }}
                >
                  Verify
                </Text>
              </Button>
              {timer === 0
                ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 15,
                      gap: 5,
                      justifyContent: 'center'
                    }}
                  >
                    <Text>Didn't Receive a code?</Text>
                    <Pressable onPress={handleResendPress}>
                      <Text style={styles.hyperlink}>Resend</Text>
                    </Pressable>
                  </View>
                  )
                : (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 15,
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{ color: colors.primary, fontSize: 16 }}>
                      {timer}s
                    </Text>
                  </View>
                  )}
            </View>
          </Form>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'web' ? 70 : 30,
    margin: Platform.OS !== 'web' ? 10 : 2,
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderRadius: 8,
    ...Platform.select({
      web: {},
      default: { flex: 1 }
    })
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10
  },
  description: {
    fontSize: 16,
    marginBottom: 5
  },
  email: {
    fontSize: 16,
    fontWeight: '600'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  errorText: {
    color: colors.danger,
    marginBottom: 10
  },
  hyperlink: {
    color: colors.primary,
    textDecorationLine: 'underline'
  }
})

export default VerificationForm
