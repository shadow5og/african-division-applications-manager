import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { JWT } from 'google-auth-library'
import keys from 'key.json'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { CampApplications } from './app/collections/CampApplications'
import { ProofOfPayment } from './app/collections/ProofOfPayment'
import Users from './app/collections/Users'

// const keys = JSON.parse(process.env.PAYLOAD_GCS_CREDENTIALS as string)

const authClient = new JWT({
  email: keys.client_email,
  keyFile: process.env.PAYLOAD_GCS_ADC_FILE_NAME,
  key: keys.private_key,
  scopes: [process.env.PAYLOAD_GCS_SCOPES as string],
})

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, ProofOfPayment, CampApplications],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    gcsStorage({
      collections: {
        proofOfPayment: true,
      },
      bucket: process.env.PAYLOAD_GCS_BUCKET as string,
      options: {
        projectId: process.env.PAYLOAD_GCS_PROJECT_ID,
        authClient,
      },
      acl: 'Public',
    }),
  ],
})
