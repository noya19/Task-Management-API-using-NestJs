import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';    // the main typeORM Module
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { config } from 'typeorm.config';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: [`${process.env.NODE_ENV}.env`] }),
    TasksModule,
    TypeOrmModule.forRoot(config),
    AuthModule,
  ]
})
export class AppModule {}

/*
This is the OLD straight forward way to connect to PostGresDB.
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'task-management',
  autoLoadEntities: true,       // so when we create a entity file eg. tasks.entity.ts to create an entity, typeORM know and loads--
  synchronize: true   // ---all the required entities automatically.
}), */
