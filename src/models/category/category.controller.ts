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
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CategoryDto } from './category.dto'
import { CategoryService } from './category.service'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') categoryId: string,
    @Body() categoryDto: CategoryDto,
  ) {
    return this.categoryService.update(+categoryId, categoryDto)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create() {
    return this.categoryService.create()
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return this.categoryService.getAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') categoryId: string) {
    return this.categoryService.findById(+categoryId)
  }

  @Get('/by-slug:slug')
  @UseGuards(JwtAuthGuard)
  async findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') categoryId: string) {
    return this.categoryService.delete(+categoryId)
  }
}
