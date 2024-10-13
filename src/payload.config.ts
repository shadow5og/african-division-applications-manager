import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { gcsStorage } from '@payloadcms/storage-gcs'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { CampApplications } from './app/collections/CampApplications'
import { ProofOfPayment } from './app/collections/ProofOfPayment'
import Users from './app/collections/Users'
import endpoints from './endpoints'
import authClient from './gcs_auth'

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
    push: process.env.NODE_ENV !== 'development',
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  endpoints,
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
