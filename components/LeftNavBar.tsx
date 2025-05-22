import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableHighlight } from 'react-native'
import Image from './Image'
import { VaultTypes } from '@/enums/enums'
import colors from '@/config/colors'
import Drawer from './Drawer'
import OrganizationForm from './OrganizationForm'

interface LeftNavBarProps {
  items: string[]
  onSelect: (item: string) => void
}
type VaultData = {
  [key in VaultTypes]: { icon: React.ReactNode, href: string }
}
const LeftNavBar: React.FC<LeftNavBarProps> = ({ items, onSelect }) => {
  const vaultData: VaultData = {
    [VaultTypes.AllVault]: { icon: <Image source={require('@/assets/images/fi-rr-home.png')} style={{ width: 20, height: 20 }} />, href: '/vault' },
    [VaultTypes.MyVault]: { icon: <Image source={require('@/assets/images/fi-rr-user.png')} style={{ width: 20, height: 20 }} />, href: '/vault' }
  }
  const [showOrganizationForm, setShowOrganizationForm] = useState(false)

  const drawerTitleElement = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image source={require('@/assets/images/fi-rr-building.png')} style={{ width: 24, height: 24 }} />
      <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: '500' }}>Create Organization</Text>
    </View>
  )
  const handleOrganizationPressed = (): any => {
    setShowOrganizationForm(!showOrganizationForm)
  }
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: 50, marginTop: 15 }}>
        <Image source={require('@/assets/images/logo-secondary.png')} style={{ width: 148, height: 49 }} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Vault Menu</Text>
          {Object.entries(vaultData).map(([type, { icon, href }]) => (
            <TouchableHighlight key={type}>
              <View style={styles.menuItem}>

                <View>{icon}</View>
                <Text style={styles.menuText}>{type}</Text>
              </View>
            </TouchableHighlight>
          ))}

          {/* Render organizations */}
          <ScrollView style={styles.organizationScrollView} />

          <ScrollView style={styles.collectionScrollView}>
            <Text style={{ color: 'white', textTransform: 'uppercase', marginBottom: 15 }}>Collections</Text>
            <Text style={{ color: 'white' }}>Fort Lock</Text>

          </ScrollView>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleOrganizationPressed}>
        <Image source={require('@/assets/images/add.png')} style={{ width: 20, height: 20 }} />
        <Text style={styles.addButtonLabel}>New Organization</Text>
      </TouchableOpacity>

      <Drawer
        drawerOpen={showOrganizationForm}
        handleClose={() => setShowOrganizationForm(false)}
        width='33%'
        title={drawerTitleElement}
      >
        <OrganizationForm />
      </Drawer>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 21,
    paddingVertical: 21
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 12
  },
  menuContainer: {
    flex: 1
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.white,
    textTransform: 'uppercase'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  menuText: {
    fontSize: 16,
    color: colors.white
  },
  organizationScrollView: {
    maxHeight: 200,
    marginTop: 30,
    marginBottom: 20
  },
  collectionScrollView: {
    maxHeight: 200
  },
  settingText: {
    marginLeft: 'auto',
    color: 'blue'
  },
  addButton: {
    backgroundColor: colors.darkblue,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    alignItems: 'center',
    width: '100%',
    borderRadius: 12,
    marginVertical: 20,
    maxWidth: '100%'
  },
  addButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '400'
  }
})
export default LeftNavBar
