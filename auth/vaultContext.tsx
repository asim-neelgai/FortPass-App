import { createContext } from 'react'

interface VaultContextType {
  vaultData: any
  setVaultData: (data: any) => void
}

const defaultVaultValue: VaultContextType = {
  vaultData: null,
  setVaultData: () => {}
}

const VaultContext = createContext<VaultContextType>(defaultVaultValue)

export default VaultContext
