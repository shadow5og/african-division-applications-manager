import { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding data...')

  await Promise.all([
    await payload.create({
      collection: 'users',
      data: {
        fullName: 'Bhungane Nkululeko Mthimkulu',
        email: 'nkuliguy@proton.me',
        password: 'demo',
        gender: 'male',
        phoneNumber: '+27630924050',
        roles: ['admin'],
      },
    }),
    await payload.create({
      collection: 'users',
      data: {
        fullName: 'Test Admin',
        email: 'admin@email.com',
        password: 'test',
        gender: 'female',
        phoneNumber: '+27000000000',
        roles: ['admin'],
      },
    }),
  ])

  // Add additional seed data here
}
