import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import Drawer from './Drawer'
import Image from './Image'
import DrawerMobile from './DrawerMobile'
import colors from '@/config/colors'
import VaultItemDrawer from './VaultItemDrawer'
import CollectionForm from './CollectionForm'

interface InitialCardProps {
  id?: string
  handleReload?: () => void
}

const InitialCard: React.FC<InitialCardProps> = ({ id, handleReload }): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [openCollectionForm, setOpenCollectionForm] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState('')

  const handleAddItemClicked = (): void => {
    setDrawerTitle('Add Items')
    setIsDrawerOpen(true)
  }

  const handleAddCollectionClicked = (): void => {
    setDrawerTitle('Add Collection')
    setOpenCollectionForm(true)
  }

  const handleDrawerCloseClicked = (): void => {
    setIsDrawerOpen(false)
  }

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/fi-rr-lock.png')} />
      <Text style={styles.title}>All your logins in one secure place.</Text>
      <Text style={styles.subtitle}>Start adding logins to your fort lock vault.</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddItemClicked}>
          <Image source={require('@/assets/images/add.png')} style={{ height: 20, width: 20, marginRight: 8 }} />
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Add Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.collectionButton} onPress={handleAddCollectionClicked}>
          <Image source={require('@/assets/images/fi-rr-folder.png')} style={{ height: 20, width: 20, marginRight: 8 }} />
          <Text style={{ fontSize: 14, fontWeight: '500' }}>Add Collections</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === 'web'
        ? (
          <Drawer
            drawerOpen={isDrawerOpen}
            title={drawerTitle}
            handleClose={handleDrawerCloseClicked}
            width='33%'
          >
            <VaultItemDrawer />
          </Drawer>
          )
        : (
          <DrawerMobile
            visible={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title={drawerTitle}
          >
            <View style={{ marginTop: 80 }}>

              <VaultItemDrawer />
            </View>

          </DrawerMobile>
          )}
      {
        Platform.OS === 'web'
          ? (
            <Drawer
              drawerOpen={openCollectionForm}
              title={drawerTitle}
              handleClose={() => setOpenCollectionForm(false)}
              width='33%'
            >
              <CollectionForm />
            </Drawer>

            )
          : (
            <DrawerMobile
              visible={openCollectionForm}
              onClose={() => setOpenCollectionForm(false)}
              title={drawerTitle}
            >
              <CollectionForm />
            </DrawerMobile>
            )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    width: '100%'
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 12,
    marginVertical: 16,
    fontSize: 24,
    fontWeight: 'bold'
  },
  subtitle: {
    marginBottom: 16,
    fontSize: 16
  },
  buttonContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    width: '100%'
  },
  addButton: {
    width: Platform.OS === 'web' ? 200 : 300,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.primary,
    borderColor: colors.gray,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  collectionButton: {
    width: Platform.OS === 'web' ? 200 : 300,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
})

export default InitialCard
