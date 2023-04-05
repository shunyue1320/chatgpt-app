import CryptoJS from 'crypto-js'

const CryptoSecret = '__CRYPTO_SECRET__'

export function encrypt(data: any) {
  const str = JSON.stringify(data)
  // AES 加密算法
  return CryptoJS.AES.encrypt(str, CryptoSecret).toString()
}

export function decrypt(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CryptoSecret)
  const plaintext = bytes.toString(CryptoJS.enc.Utf8)
  if (plaintext)
    return JSON.parse(plaintext)

  return null
}
