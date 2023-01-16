import { Task } from "src/tasks/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity() 
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true})        // the option unique: true says that the username has to be unique.
    username: string;

    @Column()
    password: string;

    @OneToMany( () => Task, (task) => task.user, {eager: true} )
    tasks: Task[];
}