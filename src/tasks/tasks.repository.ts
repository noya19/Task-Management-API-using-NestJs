// This is a data mapper technique.
// Not in use currently
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Task } from "./task.entity";

@Injectable()
export class TasksRepository extends Repository<Task>{
}