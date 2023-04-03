import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { GetAllProductDto } from './dtos/get-all-product.dto'
import { ProductDto } from './dtos/product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAll(queryDto)
  }

  @Get('simular/:id')
  async getSimular(@Param('id') id: string) {
    return this.productService.getSimilar(+id)
  }

  @Get('by-slug/:slug')
  async gteBySlug(@Param('slug') slug: string) {
    return this.productService.getBySlug(slug)
  }

  @Get('by-category/:categorySlug')
  async getByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.getByCategory(categorySlug)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct() {
    return this.productService.createProduct()
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param('id') productId: string,
    @Body() productDto: ProductDto,
  ) {
    return this.productService.updateProduct(+productId, productDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(+id)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    return this.productService.getById(+id)
  }
}
