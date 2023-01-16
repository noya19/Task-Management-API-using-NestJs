import { IsEnum } from "class-validator";
import { TaskStatus } from "../task-status.enum";


export class updateTaskStatusDto{
    @IsEnum(TaskStatus)             // this validator ensures thatstatus field only receives values defined in the ENUM:     'TaskStatus
    status: TaskStatus
}