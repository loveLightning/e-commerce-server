import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { titleToSlug } from 'src/common/utils/slug'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { CategoryDto } from './category.dto'
import { returnCategoryObj } from './return-category.object'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async findById(categoryId: number) {
    const category = this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: returnCategoryObj,
    })

    if (!category) throw new NotFoundException('Category not found')

    return category
  }

  async findBySlug(slug: string) {
    const category = this.prisma.category.findUnique({
      where: {
        slug,
      },
      select: returnCategoryObj,
    })

    if (!category) throw new NotFoundException('Category not found')

    return category
  }

  async create(categoryDto: CategoryDto) {
    const { name } = categoryDto
    const slug = titleToSlug(name)

    const existingCategory = await this.findBySlug(slug)

    if (existingCategory) {
      throw new HttpException('Category already exist', HttpStatus.CONFLICT)
    }

    return this.prisma.category.create({
      data: {
        name: name.trim(),
        slug,
      },
    })
  }

  async update(categoryId: number, categoryDto: CategoryDto) {
    const { name } = categoryDto
    const slug = titleToSlug(name)

    const existingCategory = await this.findBySlug(slug)

    if (existingCategory) {
      throw new HttpException('Category already exist', HttpStatus.CONFLICT)
    }
    return this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name.trim(),
        slug: titleToSlug(categoryDto.name),
      },
    })
  }

  async delete(categoryId: number) {
    await this.prisma.product.deleteMany({ where: { categoryId } })
    await this.prisma.category.delete({ where: { id: categoryId } })
  }

  async getAll() {
    return this.prisma.category.findMany({
      select: returnCategoryObj,
    })
  }
}
