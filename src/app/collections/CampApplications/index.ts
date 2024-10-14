import { CollectionConfig } from 'payload'
import { admins } from '../../access'
import { nationality } from '../../fields/nationality'
import { user } from '../../fields/user'
import { adminsAndApplicant } from '../Users/access/adminsAndApplicant'

export const CampApplications: CollectionConfig = {
  slug: 'campApplications',
  access: {
    create: admins,
    read: adminsAndApplicant,
    update: adminsAndApplicant,
    delete: () => false,
  },
  fields: [
    {
      name: 'targetGroup',
      type: 'select',
      required: true,
      defaultValue: '26-35',
      options: ['17-', '18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
    },
    nationality,
    { name: 'churchOrganisationName', type: 'text', required: true },
    { name: 'churchLocation', type: 'text', required: true },
    { name: 'otherDenomination', type: 'text' },
    {
      name: 'howDidYouLearnAboutUs',
      type: 'radio',
      defaultValue: 'Referral from others',
      options: [
        { label: 'Referral from others', value: 'Referral from others' },
        { label: 'Social media', value: 'Social media' },
        { label: 'Church announcements', value: 'Church Announcements' },
      ],
    },
    { name: 'expetationsFromConference', type: 'textarea' },
    { name: 'additionalInformation', type: 'textarea' },
    {
      name: 'arrivalDate',
      type: 'date',
      required: true,
      label: 'Expected date of arrival at the meeting venue.',
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MMM/yyyy',
        },
      },
    },
    {
      name: 'departureDate',
      type: 'date',
      required: true,
      label: 'Expected date of departure from the meeting venue.',
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MMM/yyyy',
        },
      },
    },
    {
      name: 'participatesInSinging',
      label: 'Would you like to participate in singing? / Any performance?',
      type: 'radio',
      defaultValue: 'No',
      options: ['Yes', 'No', 'Undecided'],
    },
    {
      name: 'typeOfGroup',
      label: 'Is it a solo or group performance?',
      type: 'select',
      defaultValue: 'Solo performance',
      options: ['Solo performance', 'Group performance', ''],
    },
    {
      name: 'preferredComunication',
      label: 'How would you like to receive additional information about the event?',
      type: 'radio',
      defaultValue: 'WhatsApp',
      options: ['WhatsApp', 'Email'],
    },
    {
      name: 'proofOfPayment',
      type: 'relationship',
      relationTo: 'proofOfPayment',
    },
    { name: 'validAppication', type: 'checkbox', defaultValue: 'false' },
    { name: 'invalidApplicationReason', type: 'textarea' },
    user,
  ],
}
