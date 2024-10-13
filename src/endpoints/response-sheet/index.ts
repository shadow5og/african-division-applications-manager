import { jwtConfig } from '@/gcs_auth'
import { sheets } from '@googleapis/sheets'
import { JWT } from 'google-auth-library'
import { Endpoint, PayloadHandler } from 'payload'

const handler: PayloadHandler = async (req) => {
  const {
    payload,
    payload: { logger },
    user,
  } = req
  try {
    const auth = new JWT({
      ...jwtConfig,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
    })

    // google sheet instance
    const sheetInstance = await sheets({ version: 'v4', auth })

    const { data: values } = await sheetInstance.spreadsheets.values.get({
        auth,
        spreadsheetId: process.env.PAYLOAD_GOOGLE_SHEET_ID,
        range: `${process.env.PAYLOAD_SHEET_NAME}!A:AB`,
      }),
      { values: records } = values

    const schema = records?.at(0) ?? []

    const childLogger = logger.child(schema)
    childLogger.info('The Schema: ')

    for (const record of records?.slice(1) ?? []) {
      try {
        // const user = await payload.find({
        //   collection: 'users',
        //   where: { email: { equals: record[1] } },
        //   depth: 0,
        // })

        // if (!user)
        const newUser = await payload.create({
          collection: 'users',
          data: {
            // createdAt: record[0],
            email: record[1],
            fullName: record[2],
            phoneNumber: record[3],
            gender: record[6].toLowerCase().replace(' (mwanaume)', ''),
            role: 'user',
            password: 'test',
          },
        })

        logger.info(newUser)
      } catch (error: any) {
        const errorLogger = logger.child(error)
        errorLogger.error(`An error occurred while creating an account for ${record[2]}`)
      }
    }

    return Response.json({ message: 'Success' })
  } catch (err) {
    logger.error(err)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

export const syncResponses: Endpoint = {
  path: '/sync-responses',
  method: 'get',
  handler,
}
