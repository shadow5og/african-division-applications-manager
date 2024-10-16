import { CollectionConfig } from 'payload'
import { admins } from '../../access'
import { adminsAndApplicant } from './access/adminsAndApplicant'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'fullName',
  },
  access: {
    create: admins,
    read: adminsAndApplicant,
    update: adminsAndApplicant,
    delete: adminsAndApplicant,
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'user'],
      defaultValue: 'user',
    },
    { name: 'phoneNumber', type: 'text', required: true },
    {
      name: 'gender',
      type: 'select',
      required: true,
      defaultValue: 'male',
      options: [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' },
      ],
    },
  ],
}

export default Users
