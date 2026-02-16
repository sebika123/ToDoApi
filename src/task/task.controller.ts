import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

   @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateTaskDto, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.taskService.create(dto, userId);
  }
}
