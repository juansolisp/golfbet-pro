import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take: pageSize,
        include: { holes: { orderBy: { number: 'asc' } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.course.count(),
    ]);

    return {
      items: courses,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async search(query: string) {
    return this.prisma.course.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { state: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { holes: { orderBy: { number: 'asc' } } },
      take: 20,
    });
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { holes: { orderBy: { number: 'asc' } } },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}
