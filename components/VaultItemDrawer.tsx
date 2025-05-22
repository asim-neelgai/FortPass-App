import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native'
import Drawer from './Drawer'
import colors from '@/config/colors'
import Image from './Image'
import PasswordForm from './PasswordForm'
import SecureNotesForm from './SecureNotesForm'
import BankAccountsForm from './BankAccountsForm'
import PaymentForm from './PaymentForm'
import AddressForm from './AddressForm'
import EnvironmentVariablesForm from './EnvironmentVariablesForm'
import { SafeAreaView } from 'react-native-safe-area-context'
import DrawerMobile from './DrawerMobile'

type ItemType = 'password' | 'secure_notes' | 'bank_accounts' | 'payment_card' | 'addresses' | 'environment_variables'

const typeNormalize = (type: ItemType): string => {
  switch (type) {
    case 'password':
      return 'Password'
    case 'secure_notes':
      return 'Secure Notes'
    case 'bank_accounts':
      return 'Bank Accounts'
    case 'payment_card':
      return 'Payment Cards'
    case 'addresses':
      return 'Addresses'
    case 'environment_variables':
      return 'Env Variables'
    default:
      return type
  }
}

const typeToIcon: Record<ItemType, any> = {
  password: require('@/assets/images/fi-rr-lock.png'),
  secure_notes: require('@/assets/images/fi-rr-notebook.png'),
  bank_accounts: require('@/assets/images/bank-icon.png'),
  payment_card: require('@/assets/images/credit-icon.png'),
  addresses: require('@/assets/images/addresses-icon.png'),
  environment_variables: require('@/assets/images/env-icon.png')
}

const ItemDrawer: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [drawerTitle, setDrawerTitle] = useState<React.ReactNode | null>(null)
  const [selectedType, setSelectedType] = useState<ItemType | null>(null)
  const [drawerWidth, setDrawerWidth] = useState<string>('33%')

  const handleFormClick = (type: ItemType): void => {
    setIsDrawerOpen(true)
    setSelectedType(type)

    const icon = <Image source={typeToIcon[type]} style={{ width: 24, height: 24 }} />

    const title = typeNormalize(type)
    const drawerTitleElement = (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon}
        <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: '500' }}>Add {title}</Text>
      </View>
    )
    setDrawerTitle(drawerTitleElement)
    const drawerWidth = (type === 'environment_variables' ? '60%' : '33%')
    setDrawerWidth(drawerWidth)
  }

  const handleDrawerCloseClicked = (): void => {
    setIsDrawerOpen(false)
  }

  const renderForm = (): React.ReactNode => {
    switch (selectedType) {
      case 'password':
        return <PasswordForm />
      case 'secure_notes':
        return <SecureNotesForm />
      case 'bank_accounts':
        return <BankAccountsForm />
      case 'payment_card':
        return <PaymentForm />
      case 'addresses':
        return <AddressForm />
      case 'environment_variables':
        return <EnvironmentVariablesForm />
      default:
        return null
    }
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => handleFormClick('password')} style={styles.item}>
            <View style={{ gap: 21 }}>
              <Image source={require('@/assets/images/fi-rr-lock.png')} style={styles.image} />
              <Text style={styles.text}>Password</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFormClick('secure_notes')} style={styles.item}>
            <View style={{ gap: 21 }}>
              <Image source={require('@/assets/images/fi-rr-notebook.png')} style={styles.image} />
              <Text style={styles.text}>Secure Notes</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFormClick('bank_accounts')} style={styles.item}>
            <View style={{ gap: 21 }}>
              <Image source={require('@/assets/images/bank-icon.png')} style={styles.image} />
              <Text style={styles.text}>Bank Accounts</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFormClick('payment_card')} style={styles.item}>
            <View style={{ gap: 21 }}>
              <Image source={require('@/assets/images/credit-icon.png')} style={styles.image} />
              <Text style={styles.text}>Payment Cards</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFormClick('addresses')} style={styles.item}>
            <View style={{ gap: 21 }}>
              <Image source={require('@/assets/images/addresses-icon.png')} style={styles.image} />
              <Text style={styles.text}>Addresses</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFormClick('environment_variables')} style={styles.item}>
            <View style={{ gap: 21 }}>
              <Image source={require('@/assets/images/env-icon.png')} style={styles.image} />
              <Text style={styles.text}>Env variables</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {
        (Platform.OS === 'web')
          ? (
            <Drawer
              drawerOpen={isDrawerOpen}
              title={drawerTitle}
              handleClose={handleDrawerCloseClicked}
              width={drawerWidth}
            >
              {renderForm()}
            </Drawer>

            )
          : (
            <DrawerMobile
              visible={isDrawerOpen}
              onClose={handleDrawerCloseClicked}
              title={drawerTitle}
            >
              {renderForm()}
            </DrawerMobile>
            )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 10,
    marginLeft: 7
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    width: Platform.OS === 'web' ? '30%' : '45%',
    marginVertical: 5,
    marginHorizontal: Platform.OS === 'web' ? '1.5%' : '2.5%',
    paddingHorizontal: 35,
    paddingVertical: 30
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600'
  },
  image: {
    height: 40,
    width: 40
  }
})

export default ItemDrawer
