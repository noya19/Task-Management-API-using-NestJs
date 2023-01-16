import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    // Note since each entity has its own respository defined by default, we could have also written the below sentence like this
    // constructor(@InjectRepository(Task) private taskRepository: Repository<Task>),
    // But we instead decided to break the task to a different class file.
    constructor(@InjectRepository(Task) private tasksRepository: Repository<Task>){}
    
    async getTasks(GetTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
        const { status, search } = GetTasksFilterDto;
        const query = this.tasksRepository.createQueryBuilder('Task').where( { user });

        if(status){
            query.andWhere('Task.status = :status', { status});
        }

        if(search){
            query.andWhere('(LOWER(Task.title) LIKE LOWER(:search) OR LOWER(Task.description) LIKE LOWER(:search))', 
            { search: `%${search}%` })
        }


        const tasks = query.getMany();
        return tasks;
    }
    
    async getTasksById(id: string, user: User): Promise<Task>{      // Error cannot use user object.
       const found = await this.tasksRepository.findOne({ 
            where: { 
                id: id,
                user: user
            } 
        });    // returns null if not found.
       if(!found){
        throw new NotFoundException(`Task with ID: ${id} not found`);
       }
       
       return found;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
        const { title, description } = createTaskDto;
        const task = await this.tasksRepository.create({
            title: title,
            description: description,
            status: TaskStatus.OPEN,
            user: user
        })

        // save the tast
        await this.tasksRepository.save(task);
        return task;
    }

    async deleteTask(id: string, user: User): Promise<void>{            /// Error cannot use the user object
       const result = await this.tasksRepository.delete({ id, user });
       console.log(result);
        if( result.affected === 0){
            throw new NotFoundException(`Task with ID   ${id} not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task>{
        const task = await this.getTasksById(id, user)
        
        // update status
        task.status = status;
        
        // save to DB
        await this.tasksRepository.save(task);

        return task;
        

    }


}


////////////// PREVIOUS CODE
/*
getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskWithFilter(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();

        if(status){
            tasks = tasks.filter( (task) => task.status = status);
        }

        if(search){
            tasks = tasks.filter( (task) => {
                if( task.title.includes(search) || task.description.includes(search) ){
                    return true;
                }else{
                    return false;
                }
            })
        }

        return tasks;
    }
*/