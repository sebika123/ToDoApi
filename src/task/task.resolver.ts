import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { TaskResponse } from './dto/task.response.dto';
import { CreateTaskDto } from './dto/task.dto';

@Resolver(() => TaskResponse)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => TaskResponse)
  async createTask(@Args('input') dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  @Query(() => [TaskResponse])
  async listAllTask(): Promise<TaskResponse[]> {
    return this.taskService.findAll();
  }
}
