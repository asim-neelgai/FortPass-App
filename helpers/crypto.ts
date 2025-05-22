import CryptoJS from 'crypto-js'

export const deriveMasterKeyNative = async (password: string, email: string): Promise<Uint8Array> => {
  const encoder = new TextEncoder()
  // const passwordBuffer = encoder.encode(password)

  const saltWordArray = CryptoJS.lib.WordArray.create(encoder.encode(email))

  const iterations = 1000 // I have set iterations count to 1000 cause in mobile device it takes too much time for hashing process, this can be optimized later
  // const hash = 'sha256'

  try {
    const derivedKey = await CryptoJS.PBKDF2(password, saltWordArray, { keySize: 256 / 32, iterations, hasher: CryptoJS.algo.SHA256 })
    return new Uint8Array(derivedKey.words)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deriving master key: ' + error.message)
    } else {
      throw new Error('Error deriving master key: ' + String(error))
    }
  }
}
