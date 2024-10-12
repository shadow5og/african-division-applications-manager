import { CollectionConfig } from 'payload'
import { user } from '../../fields/user'
import { adminsAndApplicant } from '../CampApplications/access/adminsAndApplicant'
import { assignToApplicant } from './hooks/assignToApplicant'

export const ProofOfPayment: CollectionConfig = {
  slug: 'proofOfPayment',
  upload: {
    adminThumbnail: ({ doc }) => `${process.env.PAYLOAD_GCS_BUCKET_URL}/${doc.filename}`,
    disableLocalStorage: true,
  },
  access: {
    create: adminsAndApplicant,
    read: adminsAndApplicant,
    update: adminsAndApplicant,
    delete: adminsAndApplicant,
  },
  hooks: { beforeChange: [assignToApplicant] },
  fields: [user],
}
