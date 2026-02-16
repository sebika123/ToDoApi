import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/task.dto';
import { TaskResponse } from './dto/task.response.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(dto: CreateTaskDto, userId:string): Promise<TaskDocument> {
    const task = new this.taskModel({
      ...dto,
      userId
    });
    return task.save();
  }

 async findAllForUser(userId: string): Promise<TaskResponse[]> {
  const tasks = await this.taskModel.find({ userId }).exec();

  return tasks.map((task) => ({
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
  }));
}

  async updateStatus(id: string, status: string, userId:string): Promise<TaskResponse> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(
    {_id:id, userId},
      { status },
      { new: true },
    );

    if (!updatedTask) {
      throw new Error('Task not found');
    }

    return {
      id: updatedTask._id.toString(),
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      createdAt: updatedTask.createdAt,
    };
  }

  async delete(id: string, userId:string): Promise<TaskResponse> {
    const deletedTask = await this.taskModel.findByIdAndDelete({_id:id, userId});

    if (!deletedTask) {
      throw new Error('Task not found');
    }

    return {
      id: deletedTask._id.toString(),
      title: deletedTask.title,
      description: deletedTask.description,
      status: deletedTask.status,
      createdAt: deletedTask.createdAt,
    };
  }
}
