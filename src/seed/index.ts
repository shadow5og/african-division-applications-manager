import { Payload } from "payload"

export const seed = async (payload: Payload): Promise<void> => {
    payload.logger.info('Seeding data...')
  
    await payload.create({
      collection: 'users',
      data: {
        fullName: 'Bhungane Nkululeko Mthimkulu',
        email: 'nkuliguy@proton.me',
        password: 'demo',
        gender: 'male',
        phoneNumber: '+27630924050',
        role: 'admin'
      },
    })
  
    // Add additional seed data here
  }