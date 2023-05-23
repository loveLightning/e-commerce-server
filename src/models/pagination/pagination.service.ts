import { Injectable } from '@nestjs/common'
import { PaginationDto } from './pagination.dto'
import { PaginationTypes } from './pagination.interface'

@Injectable()
export class PaginationService {
  constructor() {}

  async getPagination(
    paginationDto: PaginationDto,
    defaultPerPage: number = 8,
  ): Promise<PaginationTypes> {
    const page = paginationDto.page ?? 1
    const perPage = paginationDto.perPage ?? defaultPerPage

    const skip = (page - 1) * perPage

    return { perPage, skip }
  }
}
