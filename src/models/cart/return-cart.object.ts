import { returnProductObj } from '../product/return.product.object'

export const returnCartObj = {
  product: {
    select: returnProductObj,
  },
  id: true,
  quantity: true,
}
