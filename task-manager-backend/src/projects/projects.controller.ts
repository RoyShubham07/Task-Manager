import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
  } from '@nestjs/common';
  import { ProjectService } from './projects.service';
  
  @Controller('projects')
  export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}
  
    @Post()
    create(@Body() body) {
      return this.projectService.create(body);
    }
  
    @Get()
    findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.projectService.findAll(page, limit);
    }
  
    @Get(':id')
    findOne(@Param('id') id: number) {
      return this.projectService.findOne(id);
    }
  
    @Put(':id')
    update(@Param('id') id: number, @Body() body) {
      return this.projectService.update(id, body);
    }
  
    @Delete(':id')
    delete(@Param('id') id: number) {
      return this.projectService.delete(id);
    }
  }