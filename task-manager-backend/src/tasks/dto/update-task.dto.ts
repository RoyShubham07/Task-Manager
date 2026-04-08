import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { TaskStatus } from '../status.enum';

export class UpdateTaskDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  due_date?: Date;
}
