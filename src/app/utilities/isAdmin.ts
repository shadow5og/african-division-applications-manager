import { User } from '@/payload-types'

export const isAdmin = (user: User) => !!user?.roles?.includes('admin')
