import { Access, User } from 'payload'

export const admins: Access<User> = ({ req: { user } }) => !!user?.roles?.includes('admin')
