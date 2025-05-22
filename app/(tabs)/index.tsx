import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Alert
} from 'react-native'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopNavBar from '@/components/TopNavBar'
import TopNavBarMobile from '@/components/TopNavBarMobile'
import colors from '@/config/colors'
import Button from '@/components/Button'
import Form from '@/components/Form'
import FormField from '@/components/FormField'
import { deriveMasterKeyNative } from '@/helpers/crypto'
import AuthContext from '@/auth/context'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Yup from 'yup'
import { FormikHelpers } from 'formik'
import { signIn, signOut } from 'aws-amplify/auth'
import * as Calendar from 'expo-calendar'

interface FeatureBoxProps {
  title: string
  description: string
  imageSource: number
}

interface FormValues {
  email: string
  password: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label('Email'),
  password: Yup.string().required().label('Password')
})

const Home = (): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleDrawerToggle = (isOpen: boolean): any => {
    setIsDrawerOpen(isOpen)
  }

  const [error, setError] = useState<string>('')
  const { setEmailAddress } = useContext(AuthContext)

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

  async function requestCalendarPermissions () {
    const { status } = await Calendar.requestCalendarPermissionsAsync()
    if (status === 'granted') {
      console.log('Calendar permissions granted')
    } else {
      console.log('Calendar permissions denied')
    }
  }

  // Call this function when your app starts or before trying to access the calendar
  requestCalendarPermissions()

  async function addEventToCalendar (title, startDate, endDate, notes) {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
      console.log('Available calendars:', calendars.map(cal => ({ id: cal.id, title: cal.title, source: cal.source })))

      // Try to find the primary Google calendar
      let selectedCalendar = calendars.find(cal =>
        cal.source && cal.source.type === 'com.google' && cal.isPrimary
      )

      // If no primary Google calendar, just pick the first Google calendar
      if (selectedCalendar == null) {
        selectedCalendar = calendars.find(cal =>
          cal.source && cal.source.type === 'com.google'
        )
      }

      // If still no Google calendar, fall back to the first available calendar
      if (selectedCalendar == null) {
        console.log('No Google calendar found, using first available calendar')
        selectedCalendar = calendars[0]
      }

      if (!selectedCalendar) {
        throw new Error('No calendars available')
      }

      console.log('Selected calendar:', selectedCalendar.title, selectedCalendar.source)

      const eventDetails = {
        title,
        startDate,
        endDate,
        notes,
        timeZone: selectedCalendar.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
      }

      console.log('Adding event with details:', eventDetails)

      const eventId = await Calendar.createEventAsync(selectedCalendar.id, eventDetails)
      console.log(`Event added to calendar "${selectedCalendar.title}" with ID: ${eventId}`)
      return { eventId, calendarTitle: selectedCalendar.title }
    } catch (error) {
      console.error('Error adding event to calendar:', error)
      throw error
    }
  }

  const handleAddToCalendar = async () => {
    const eventTitle = 'My Expo App Event'
    const now = new Date()
    const startDate = new Date(now.getTime() + 1000 * 60 * 60) // 1 hour from now
    const endDate = new Date(now.getTime() + 1000 * 60 * 60 * 2) // 2 hours from now
    const notes = 'This event was added from my Expo app!'

    try {
      const result = await addEventToCalendar(eventTitle, startDate, endDate, notes)
      if (result != null) {
        console.log('Event added successfully')
        Alert.alert('Success', `Event added to calendar "${result.calendarTitle}" for ${startDate.toLocaleString()}`)
      }
    } catch (error) {
      console.error('Failed to add event:', error)
      Alert.alert('Error', 'Failed to add event to calendar. Please try again.')
    }
  }

  return (
    <>
      {
    Platform.OS === 'web'
      ? (

        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={styles.container} scrollEnabled={!isDrawerOpen}>
            <ImageBackground
              source={require('@/assets/images/Rectangle.png')}
              style={styles.background}
            >
              {Platform.OS === 'web'
                ? (
                  <TopNavBar />
                  )
                : (
                  <TopNavBarMobile onDrawerToggle={handleDrawerToggle} />
                  )}
              <View style={styles.background}>
                <View style={styles.introSection}>
                  <Text style={styles.introText}>
                    <Text style={styles.lightText}>Your </Text>
                    <Text style={styles.boldText}>Ultimate</Text>
                    <Text style={styles.lightText}> Password</Text>
                    <Text style={styles.lightText}> Manager</Text>
                  </Text>
                  <Text style={styles.description}>
                    Secure your loved ones, your team, or your entire organization
                    with straightforward security measures, effortless secret
                    sharing, and practical insight reports.
                  </Text>
                  <Link href='/registerScreen' style={{ marginTop: 40 }}>
                    <View style={styles.getStartedButton}>
                      <Text style={styles.getStartedButtonText}>Get Started</Text>
                    </View>
                  </Link>
                  <View style={styles.containerBox}>
                    <Image
                      style={styles.image}
                      source={require('@/assets/images/password.png')}
                    />
                  </View>
                </View>
              </View>
            </ImageBackground>
            <FeatureSection />
            <ImprovementSection />
          </ScrollView>
        </SafeAreaView>
        )
      : (
        <SafeAreaView style={[{ flex: 1 }]}>

          <View style={{ height: 100, zIndex: 101 }}>

            <TopNavBarMobile />
          </View>

          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 40 }}>
              <Form
                initialValues={{
                  email: '',
                  password: ''
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                <View style={styles.containers}>
                  <View>
                    <Text style={styles.titles}>Log in</Text>
                    <Text style={styles.subtitles}>Please sign in to continue</Text>
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
            <TouchableOpacity onPress={handleAddToCalendar}><Text>Click me</Text></TouchableOpacity>
          </KeyboardAwareScrollView>
        </SafeAreaView>
        )
  }

    </>
  )
}

const FeatureSection = (): JSX.Element => (
  <View style={styles.section} id='section1'>
    <Text style={styles.sectionTitle}>What do you get with FortLock?</Text>
    <View style={styles.featureContainer}>
      <FeatureBox
        title='Access & manage passwords everywhere'
        description='Employing a Password Manager allows seamless access across various devices and platforms.'
        imageSource={require('@/assets/images/shareEmail.png')}
      />
      <FeatureBox
        title='Share secrets'
        description='Utilizing robust encryption protocols ensures that sensitive information remains protected.'
        imageSource={require('@/assets/images/shareEmail.png')}
      />
    </View>
    <View style={styles.featureContainer}>
      <FeatureBox
        title='Add and share collection'
        description='Employing a Password Manager allows seamless access across various devices and platforms.'
        imageSource={require('@/assets/images/shareEmail.png')}
      />
      <FeatureBox
        title='Two factor authentication'
        description='Utilizing robust encryption protocols ensures that sensitive information remains protected.'
        imageSource={require('@/assets/images/shareEmail.png')}
      />
    </View>
  </View>
)

const FeatureBox = ({ title, description, imageSource }: FeatureBoxProps): JSX.Element => (
  <View style={styles.featureBox}>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
      <Image style={styles.Image} source={imageSource} />
    </View>
  </View>
)

const ImprovementSection = (): JSX.Element => (
  <View style={styles.improvementContainer}>
    <ImageBackground
      source={require('@/assets/images/Ellipse.png')}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          Improve password security across your organization
        </Text>
        <Text style={styles.cardDescription}>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt. Neque porro quisquam est
        </Text>
        <Link href='/registerScreen' style={styles.link}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Let's Get Started</Text>
          </View>
        </Link>
      </View>
    </ImageBackground>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8
  },
  background: {
    width: '100%',
    textAlign: 'center'
  },
  navigationContainer: {
    marginHorizontal: 24
  },
  introSection: {
    marginHorizontal: 5,
    marginTop: 100,
    flexDirection: 'column',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start'
  },
  introText: {
    fontSize: 36,
    fontWeight: '500'
  },
  lightText: {
    fontWeight: '300'
  },
  boldText: {
    color: colors.primary,
    fontWeight: '700'
  },
  description: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: '400'
  },
  cardDescription: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: '400',
    color: colors.white,
    textAlign: 'center'
  },
  getStartedButton: {
    marginTop: 40,
    backgroundColor: '#2B4EBC',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 16
  },
  Image: {
    width: '100%',
    height: Platform.OS === 'web' ? 300 : 200
  },
  section: {
    paddingVertical: Platform.OS === 'web' ? 100 : 30,
    backgroundColor: colors.white,
    maxWidth: '100%'
  },
  sectionTitle: {
    fontSize: 36,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 65
  },
  featureContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: Platform.OS === 'web' ? 30 : 10,
    marginBottom: 15,
    paddingHorizontal: Platform.OS === 'web' ? 100 : 10,
    width: '100%'
  },
  featureBox: {
    backgroundColor: colors.gray,
    marginBottom: 5,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingTop: 59,
    width: Platform.OS === 'web' ? '50%' : '100%'
  },
  featureContent: {
    justifyContent: 'center'
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  featureDescription: {
    marginVertical: 30,
    fontSize: 16,
    fontWeight: '400'
  },
  containerBox: Platform.select({
    web: {
      width: '100%',
      height: 600,
      marginVertical: 75,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    default: {
      width: '100%',
      marginVertical: 25,
      flexDirection: 'row',
      justifyContent: 'center'
    }
  }),
  image: Platform.select({
    web: { width: '100%', height: '100%', resizeMode: 'contain' },
    default: { width: '100%', height: 200, resizeMode: 'contain' }
  }),
  backgroundImage: {
    width: Platform.OS === 'web' ? 200 : 100,
    height: Platform.OS === 'web' ? 200 : 100,
    zIndex: Platform.OS === 'web' ? 20 : 0
  },
  content: {
    flex: 1,
    paddingVertical: Platform.OS === 'web' ? 97 : 50,
    paddingHorizontal: Platform.OS === 'web' ? 150 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue1,
    borderRadius: 16
  },
  title: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
  },
  link: {
    marginTop: 35
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  buttonText: {
    color: colors.blue1,
    fontSize: 14,
    fontWeight: '600'
  },
  improvementContainer: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'web' ? 100 : 10,
    backgroundColor: colors.white
  },
  containers: {
    paddingVertical: 50,
    paddingHorizontal: 79,
    backgroundColor: colors.white,
    borderRadius: 8,
    ...Platform.select({
      web: {},
      default: { flex: 1 }
    })
  },
  titles: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitles: {
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

export default Home
