import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule], // Note here to register the repository we have to use the actual entity i.e 
  controllers: [TasksController],              //-- Task and not the Repository name, because actually entities have repositories--     
  providers: [TasksService]                    //-- inbuit but for our conviniece we have defined an extra class for it. 
})
export class TasksModule {}
