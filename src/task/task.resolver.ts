import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { TaskResponse } from './dto/task.response.dto';
import { CreateTaskDto } from './dto/task.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@Resolver(() => TaskResponse)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

@UseGuards(JwtAuthGuard)
@Mutation(() => TaskResponse)
async createTask(
  @Args('input') dto: CreateTaskDto,
  @Context() ctx,
) {
  const userId = ctx.req.user.sub;
  return this.taskService.create(dto, userId);
}


@UseGuards(JwtAuthGuard)
@Query(() => [TaskResponse])
async listAllTask(@Context() ctx) {
  return this.taskService.findAllForUser(ctx.req.user.sub);
}


  @UseGuards(JwtAuthGuard)
  @Mutation(() => TaskResponse)
  async updateTaskStatus(
    @Args('id') id: string,
    @Args('status') status: string,
      @Context() ctx,
  ): Promise<TaskResponse> {
    return this.taskService.updateStatus(id, status,ctx.req.user.sub);
  }


@UseGuards(JwtAuthGuard)
  @Mutation(() => TaskResponse)
  async deleteTask(@Args('id') id: string,@Context() ctx): Promise<TaskResponse> {
    return this.taskService.delete(id,ctx.req.user.sub);
  }
}
