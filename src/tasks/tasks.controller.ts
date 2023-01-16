import { Body, Controller, Get, Post, Param, Delete, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { updateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

console.log("Hello from task controller");

@Controller('tasks')
@UseGuards(AuthGuard())         // This is a built-In guard that kicks of the Passport-strategy and does the defined functions.
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    async getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    async getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task>{
        return this.tasksService.getTasksById(id, user);
    }
    
    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task>{         // as a response we want to return the task created.
        return this.tasksService.createTask(createTaskDto, user);  
    }

    @Delete('/:id')
    async deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void>{
        this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    async updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: updateTaskStatusDto, @GetUser() user: User): Promise<Task>{
        return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status, user);
    }
}