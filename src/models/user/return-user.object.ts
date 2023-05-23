import { Prisma } from '@prisma/client'

export const returnUserObj: Prisma.UserSelect = {
  id: true,
  email: true,
  password: false,
  name: true,
  avatarPath: true,
  phone: true,
  role: true,
}

export const returnFavoritesObj = {
  id: true,
  name: true,
  price: true,
  images: true,
  slug: true,
}
