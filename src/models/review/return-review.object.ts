import { Prisma } from '@prisma/client'
import { returnUserObj } from '../user/return-user.object'

export const returnReviewObj: Prisma.ReviewSelect = {
  user: {
    select: returnUserObj,
  },
  createdAt: true,
  text: true,
  rating: true,
  id: true,
}
