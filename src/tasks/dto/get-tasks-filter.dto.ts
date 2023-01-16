import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto{
    // status?: TaskStatus;  ?: This means the field are optional in typescript but in runtime it won't work since typescript dosen't exist in runtime, so we use the @IsOptional() validator to ensures these fields are optional  
    @IsEnum(TaskStatus)
    @IsOptional()           // this validator ensures that the below field in optional.
    status: TaskStatus

    @IsOptional()
    @IsString()
    search: string;
}