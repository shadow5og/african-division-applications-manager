import { jwtConfig } from '@/gcs_auth'
import { drive } from '@googleapis/drive'
import { sheets } from '@googleapis/sheets'
import { JWT } from 'google-auth-library'
import {
  Endpoint,
  PayloadRequest,
  commitTransaction,
  initTransaction,
  killTransaction,
} from 'payload'

const handler = async (req: PayloadRequest) => {
  if (
    req.headers.get(process.env.PAYLOAD_ENDPOINTS_HEADER as string) !==
    process.env.PAYLOAD_ENDPOINTS_VALUE
  )
    return Response.json({ message: 'Unauthorized' }, { status: 401 })

  const {
    payload,
    payload: { logger },
  } = req
  try {
    const auth = new JWT({
      ...jwtConfig,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
    })

    const sheetInstance = await sheets({ version: 'v4', auth }),
      driveInstance = drive({ version: 'v3', auth }),
      driveLinkPrefix = 'https://drive.google.com/open?id='

    const { data: values, data } = await sheetInstance.spreadsheets.values.get({
        auth,
        spreadsheetId: process.env.PAYLOAD_GOOGLE_SHEET_ID,
        range: `${process.env.PAYLOAD_SHEET_NAME}!A:AB`,
      }),
      { values: records } = values

    const schema = records?.at(0) ?? []

    const childLogger = logger.child(schema)
    childLogger.info('The Schema: ')

    logger.info('About to sync google form responses with user data.')

    for (const record of records?.slice(1) ?? []) {
      await initTransaction(req)
      try {
        const potentialUser = (
          await payload.find({
            req: req,
            collection: 'users',
            where: { email: { equals: record[1] } },
            depth: 0,
          })
        ).docs?.at(0)

        if (potentialUser) {
          await killTransaction(req)
          continue
        }

        logger.info(`Syncing data for ${record[2]}.`)
        const newUser = await payload.create({
          collection: 'users',
          req,
          data: {
            email: record[1],
            fullName: record[2],
            phoneNumber: record[3],
            gender: record[6].toLowerCase().replace(' (mwanaume)', '').replace(' (mwanamke)', ''),
            roles: ['user'],
            password: 'test',
          },
          depth: 0,
        })

        await payload.create({
          req,
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
            arrivalDate: formatDateString(record[16]),
            departureDate: formatDateString(record[17]),
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

        // if (record.at(21)?.length) {
        //   const fileId = record[21].replace(driveLinkPrefix, '')
        //   logger.info(`The file ID: ${fileId}`)
        //   const response = await driveInstance.files.get(
        //     {
        //       fileId,
        //       alt: 'media',
        //       acknowledgeAbuse: true,
        //     },
        //     { responseType: 'stream' },
        //   )

        //   const fileBuffer = await streamToBuffer(response.data as NodeJS.ReadStream)

        //   const proofOfPayment = await payload.create({
        //     collection: 'proofOfPayment',
        //     req,
        //     file: {
        //       data: fileBuffer,
        //       mimetype: response.headers['content-type'],
        //       size: fileBuffer.length,
        //       name: newUser.fullName + '-proof of payment',
        //     },
        //     data: { user: newUser.id },
        //   })

        //   await Promise.all([
        //     // @ts-expect-error
        //     await payload.update({
        //       collections: 'users',
        //       where: { id: newUser.id },
        //       data: { proofOfPayment: proofOfPayment.id },
        //       req,
        //     }),
        //     // @ts-expect-error
        //     await payload.update({
        //       collections: 'campApplications',
        //       where: { user: newUser.id },
        //       data: { proofOfPayment: proofOfPayment.id },
        //       req,
        //     }),
        //     ,
        //   ])

        //   // const downloadedFilepath = await new Promise((resolve, reject) => {
        //   //   response.data
        //   //     .on('end', () => {
        //   //       logger.info('Done downloading file.')
        //   //       resolve(filePath)
        //   //     })
        //   //     .on('error', (err) => {
        //   //       logger.error('Error downloading file.')
        //   //       reject(err)
        //   //     })
        //   //     .on('data', (d) => {
        //   //       progress += d.length
        //   //       if (process.stdout.isTTY) {
        //   //         process.stdout.clearLine(1)
        //   //         process.stdout.cursorTo(0)
        //   //         process.stdout.write(`Downloaded ${progress} bytes`)
        //   //       }
        //   //     })
        //   //     .pipe(dest)
        //   // })
        // }

        await commitTransaction(req)

        logger.info(`Successfully synced data for ${record[2]}.`)
      } catch (error: any) {
        const errorLogger = logger.child(error)
        console.error(error)
        errorLogger.error(`An error occurred while creating an account for ${record[2]}`)
        logger.info(record)

        await killTransaction(req)
      }
    }

    logger.info('Done creating user accounts and application form responses from Google form data.')

    return Response.json({ message: 'Success' })
  } catch (err) {
    logger.error(err)
    console.error(err)
    killTransaction(req)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

export const syncResponses: Endpoint = {
  path: '/sync-responses',
  method: 'get',
  handler,
}

async function streamToBuffer(readableStream: NodeJS.ReadStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    readableStream.on('data', (data) => {
      if (typeof data === 'string') {
        // Convert string to Buffer assuming UTF-8 encoding
        chunks.push(Buffer.from(data, 'utf-8'))
      } else if (data instanceof Buffer) {
        chunks.push(data)
      } else {
        // Convert other data types to JSON and then to a Buffer
        const jsonData = JSON.stringify(data)
        chunks.push(Buffer.from(jsonData, 'utf-8'))
      }
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}

function formatDateString(dateString: string) {
  if (dateString.includes('/')) {
    let dateArray = dateString.split('/')
    dateString = dateArray.reverse().join('-')
  }

  return dateString
}
