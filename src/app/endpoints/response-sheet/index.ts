import { jwtConfig } from '@/gcs_auth'
import { sheets } from '@googleapis/sheets'
import { JWT } from 'google-auth-library'
import { Endpoint, PayloadHandler, PayloadRequest } from 'payload'

const handler: PayloadHandler = async (req: PayloadRequest) => {
  if (
    req.headers.get(process.env.PAYLOAD_ENDPOINTS_HEADER as string) !==
    process.env.PAYLOAD_ENDPOINTS_VALUE
  )
    return Response.json({ message: 'Unauthorized' }, { status: 401 })

  const {
    payload,
    payload: { logger },
    user,
  } = req
  try {
    const auth = new JWT({
      ...jwtConfig,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
    })

    // google sheet instance
    const sheetInstance = await sheets({ version: 'v4', auth })

    const { data } = await sheetInstance.spreadsheets.values.get({
        auth,
        spreadsheetId: process.env.PAYLOAD_GOOGLE_SHEET_ID,
        range: `${process.env.PAYLOAD_SHEET_NAME}!A:AB`,
      }),
      { values: records } = data

    const schema = records?.at(0) ?? []

    const childLogger = logger.child(schema)
    childLogger.info('The Schema: ')

    logger.info('About to sync google form responses with user data.')

    for (const record of records?.slice(1) ?? []) {
      const transactionID = (await payload.db.beginTransaction()) ?? ''
      try {
        const potentialUser = (
          await payload.find({
            req: { ...req, transactionID },
            collection: 'users',
            where: { email: { equals: record[1] } },
            depth: 0,
          })
        ).docs?.at(0)

        if (potentialUser) {
          // Find the row index based on the matching valuevalueToMatch
          const rowIndex = records?.findIndex((row) => row[2] === potentialUser.fullName) ?? -1

          if (rowIndex === -1) {
            logger.info('No matching row found.')
            await payload.db.rollbackTransaction(transactionID)
            continue
          }

          // Create the request body to delete the row
          const requestBody = {
            requests: [
              {
                deleteDimension: {
                  range: {
                    dimension: 'ROWS',
                    startIndex: rowIndex,
                    endIndex: rowIndex + 1,
                    sheetId: 1,
                  },
                },
              },
            ],
          }

          // Execute the batch update request
          await sheetInstance.spreadsheets.batchUpdate({
            spreadsheetId: process.env.PAYLOAD_GOOGLE_SHEET_ID,
            requestBody,
          })

          logger.info('Row deleted successfully.')

          await payload.db.rollbackTransaction(transactionID)
          continue
        }

        logger.info(`Syncing data for ${record[2]}.`)
        const newUser = await payload.create({
          collection: 'users',
          req: { ...req, transactionID },
          data: {
            email: record[1],
            fullName: record[2],
            phoneNumber: record[3],
            gender: record[6].toLowerCase().replace(' (mwanaume)', ''),
            roles: ['user'],
            password: 'test',
          },
          depth: 0,
        })

        await payload.create({
          req: { ...req, transactionID },
          collection: 'campApplications',
          data: {
            targetGroup: record[5],
            nationality: record[7],
            churchOrganisationName: record[8],
            churchLocation: record[9],
            otherDenomination: record[11],
            howDidYouLearnAboutUs:
              record[12] === ''
                ? null
                : record[12]
                    .replace(' (Nilijulishwa na mtu)', '')
                    .replace(' (Matangazo ya Kanisa)', '')
                    .replace(' (Mitandao ya kijamii)', ''),
            expetationsFromConference: record[13],
            additionalInformation: record[15],
            arrivalDate: record[16],
            departureDate: record[17],
            participatesInSinging:
              record[18].replace(' (Ndiyo)', '').replace(' (Hapana)', '') ?? 'Undecided',
            typeOfGroup:
              record[19] === ''
                ? null
                : record[19]
                    .replace(' (Uimbaji/programu ya kikundi)', '')
                    .replace(' (Uimbaji/programu kutoka kwa mtu mmoja)', ''),
            preferredComunication: record[20],
            user: newUser.id,
            validAppication: false,
          },
          depth: 0,
        })

        await payload.db.commitTransaction(transactionID)

        logger.info(`Successfully synced data for ${record[2]}.`)
      } catch (error: any) {
        const errorLogger = logger.child(error)
        errorLogger.error(`An error occurred while creating an account for ${record[2]}`)
        logger.error(record)

        await payload.db.rollbackTransaction(transactionID)
      }
    }

    logger.info('Done creating user accounts and application form responses from Google form data.')

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
