import { ProofOfPayment } from '@/payload-types'
import { CollectionBeforeChangeHook } from 'payload'
import { slugify } from '../../../utilities/string'

export const assignToApplicant: CollectionBeforeChangeHook<ProofOfPayment> = async ({
  data, // incoming data to update or create with
  req: { user, payload }, // full express request
  operation, // name of the operation ie. 'create', 'update'
}) => {
  const newData = { ...data }
  let changed = false

  if (operation === 'create' && !data.filename?.includes('/')) {
    const { fullName } = await payload.findByID({
      collection: 'users',
      id: data.user as number,
      depth: 0,
      user,
    })

    const sluggifiedName =
      slugify(fullName) + '-' + (typeof data.user === 'number' ? data.user : data.user?.id)

    await payload.delete({
      collection: 'proofOfPayment',
      where: {
        filename: { contains: sluggifiedName },
      },
      depth: 0,
    })

    newData.filename = `${sluggifiedName}-${newData.filename}`
    newData.url = process.env.PAYLOAD_GCS_BUCKET_URL + '/' + newData.filename
    changed = true
  }

  return changed ? newData : data // Return data to either create or update a document with
}
