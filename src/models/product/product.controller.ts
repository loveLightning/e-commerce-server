import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { JwtGuard } from '../auth/jwt.guard'
import { GetAllProductDto } from './dtos/get-all-product.dto'
import { ProductDto } from './dtos/product.dto'
import { ProductService } from './product.service'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/role.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { storage } from 'src/common/utils/storage'
import { CreateProductDto } from './dtos/create-product.dto'
import { Role } from '@prisma/client'
import { Response } from 'express'

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

  @Get('products/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads/products' })
  }

  @Post()
  @UseGuards(JwtGuard)
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', storage('products')))
  async createProduct(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    console.log(createProductDto)

    const productPath = file ? file.filename : null

    return this.productService.createProduct(productPath, createProductDto)
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateProduct(
    @Param('id') productId: string,
    @Body() productDto: ProductDto,
  ) {
    return this.productService.updateProduct(+productId, productDto)
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(+id)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(+id)
  }
}
