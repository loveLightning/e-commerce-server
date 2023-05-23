import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { titleToSlug } from 'src/common/utils/slug'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { PaginationService } from '../pagination/pagination.service'
import { EnumProductSort, GetAllProductDto } from './dtos/get-all-product.dto'
import { ProductDto } from './dtos/product.dto'
import {
  returnFullOfproductObj,
  returnProductObj,
} from './return.product.object'
import { CreateProductDto } from './dtos/create-product.dto'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async getAll(productsDto: GetAllProductDto = {}) {
    const { searchTerm, sort, slug } = productsDto

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

    if (sort === EnumProductSort.HIGH_PRICE) {
      prismaSort.push({ price: 'desc' })
    } else if (sort === EnumProductSort.LOW_PRICE) {
      prismaSort.push({ price: 'asc' })
    } else if (sort === EnumProductSort.NEWEST) {
      prismaSort.push({ createdAt: 'desc' })
    } else {
      prismaSort.push({ createdAt: 'asc' })
    }
    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}

    const prismaSearchSlug: Prisma.ProductWhereInput = slug
      ? {
          slug,
        }
      : {}
    const { perPage, skip } = await this.paginationService.getPagination(
      productsDto,
    )

    const productsCount = await this.prisma.product.count({
      where: {
        ...prismaSearchSlug,
        ...prismaSearchTermFilter,
      },
    })

    const products = await this.prisma.product.findMany({
      where: {
        ...prismaSearchTermFilter,
        category: {
          ...prismaSearchSlug,
        },
      },
      orderBy: prismaSort,
      skip: +skip,
      take: +perPage,
      select: returnProductObj,
    })

    return {
      products,
      length: productsCount,
    }
  }

  async getById(categoryId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: categoryId,
      },
      select: returnFullOfproductObj,
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }

  async getBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug,
      },
      select: returnFullOfproductObj,
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }

  async getByCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        slug: categorySlug,
      },
      select: returnFullOfproductObj,
    })

    if (!products) {
      throw new NotFoundException('Product not found')
    }

    return products
  }

  async getSimilar(categoryId: number) {
    const currentProduct = await this.getById(categoryId)

    if (!currentProduct)
      throw new NotFoundException('Current product not found')

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnProductObj,
    })

    return products
  }

  async createProduct(productPath: string, createProductDto: CreateProductDto) {
    const { category, desc, name, price } = createProductDto

    const existProduct = await this.getByName(name)

    if (existProduct) {
      throw new HttpException('Product already exists', HttpStatus.CONFLICT)
    }

    const product = await this.prisma.product.create<Prisma.ProductCreateArgs>({
      data: {
        description: desc,
        name: name,
        price: +price,
        slug: titleToSlug(name),
        images: [productPath],
        category: {
          connectOrCreate: {
            where: {
              name: category,
            },
            create: {
              name: category,
              slug: titleToSlug(category),
            },
          },
        },
      },
    })
    return product.id
  }

  async updateProduct(productId: number, productDto: ProductDto) {
    const { categoryId, description, images, price, name } = productDto

    const category = await this.prisma.category.count({
      where: {
        id: categoryId,
      },
    })

    if (!category) throw new NotFoundException('Category not found')

    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        description,
        images,
        price,
        name,
        slug: titleToSlug(name),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    })
  }

  async deleteProduct(productId: number) {
    return this.prisma.product.delete({
      where: {
        id: productId,
      },
    })
  }

  private async getByName(name: string) {
    return this.prisma.product.findUnique({
      where: {
        name: name.trim(),
      },
    })
  }
}
