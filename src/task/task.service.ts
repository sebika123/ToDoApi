import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/task.dto';
import { TaskResponse } from './dto/task.response.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(dto: CreateTaskDto): Promise<TaskDocument> {
    const task = new this.taskModel(dto);
    return task.save();
  }

  async findAll(): Promise<TaskResponse[]> {
    const tasks = await this.taskModel.find().exec();

    // Map _id to id for GraphQL
    return tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
    }));
  }
}
