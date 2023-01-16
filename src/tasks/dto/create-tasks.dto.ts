import { IsNotEmpty } from "class-validator";

export class CreateTaskDto{
    @IsNotEmpty()                       // This is a validator via dependency injection
    title: string;

    @IsNotEmpty()
    description: string;
}