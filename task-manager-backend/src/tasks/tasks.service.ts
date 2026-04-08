import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { Project } from '../projects/project.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async create(projectId: number, data: CreateTaskDto) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const task = this.taskRepo.create({
      ...data,
      project,
    });

    const saved = await this.taskRepo.save(task);

    return {
      message: 'Task created successfully',
      data: saved,
    };
  }

  async findAll() {
    const tasks = await this.taskRepo.find({ relations: ['project'] });

    return {
      message: 'Tasks fetched successfully',
      data: tasks,
    };
  }

  async findByProject(projectId: number) {
    const tasks = await this.taskRepo.find({
      where: { project: { id: projectId } },
    });

    return {
      message: 'Tasks fetched successfully',
      data: tasks,
    };
  }

  async update(id: number, data: UpdateTaskDto) {
    await this.taskRepo.update(id, data);

    return {
      message: 'Task updated successfully',
    };
  }

  async delete(id: number) {
    await this.taskRepo.delete(id);

    return {
      message: 'Task deleted successfully',
    };
  }
}
