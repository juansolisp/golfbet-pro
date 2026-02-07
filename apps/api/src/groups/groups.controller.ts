import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(userId, dto);
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    return this.groupsService.findAllForUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.groupsService.findById(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupsService.update(id, userId, dto);
  }

  @Post('join')
  async join(@CurrentUser('id') userId: string, @Body() dto: JoinGroupDto) {
    return this.groupsService.join(userId, dto.inviteCode);
  }

  @Delete(':id/leave')
  async leave(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.groupsService.leave(id, userId);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.groupsService.getMembers(id);
  }
}
