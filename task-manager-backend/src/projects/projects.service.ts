import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async create(data: any) {
    const project = this.projectRepo.create(data);
    const saved = await this.projectRepo.save(project);

    return {
      message: 'Project created successfully',
      data: saved,
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [projects, total] = await this.projectRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      message: 'Projects fetched successfully',
      data: projects,
      total,
      page,
    };
  }

  async findOne(id: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      message: 'Project fetched successfully',
      data: project,
    };
  }

  async update(id: number, data: any) {
    await this.projectRepo.update(id, data);

    const updated = await this.findOne(id);

    return {
      message: 'Project updated successfully',
      data: updated.data,
    };
  }

  async delete(id: number) {
    await this.projectRepo.delete(id);

    return {
      message: 'Project deleted successfully',
    };
  }
}