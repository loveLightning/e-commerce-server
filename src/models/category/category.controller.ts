import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { JwtGuard } from '../auth/jwt.guard'
import { CategoryDto } from './category.dto'
import { CategoryService } from './category.service'
import { Roles } from '../auth/roles.decorator'
import { Role } from '@prisma/client'
import { RolesGuard } from '../auth/role.guard'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async update(
    @Param('id') categoryId: string,
    @Body() categoryDto: CategoryDto,
  ) {
    return this.categoryService.update(+categoryId, categoryDto)
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async create(@Body() categoryDto: CategoryDto) {
    return this.categoryService.create(categoryDto)
  }

  @Get()
  async getAll() {
    return this.categoryService.getAll()
  }

  @Get(':id')
  async findById(@Param('id') categoryId: string) {
    return this.categoryService.findById(+categoryId)
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug)
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async delete(@Param('id') categoryId: string) {
    await this.categoryService.delete(+categoryId)
  }
}
