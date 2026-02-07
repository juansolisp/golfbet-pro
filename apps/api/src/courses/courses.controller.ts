import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  async findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.coursesService.findAll(page || 1, pageSize || 20);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.coursesService.search(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }
}
