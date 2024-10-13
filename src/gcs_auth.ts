import { JWT } from 'google-auth-library'
import keys from 'key.json'

export const jwtConfig = {
  email: keys.client_email,
  keyFile: process.env.PAYLOAD_GCS_ADC_FILE_NAME,
  key: keys.private_key,
  scopes: [process.env.PAYLOAD_GCS_SCOPES as string],
}

const authClient = new JWT(jwtConfig)

export default authClient
