import { Exclude } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.enum"

@Entity()                                    // This makes typeORM aware that Task Class in an entity
export class Task{
    @PrimaryGeneratedColumn('uuid')         // This means that 'id' is the primary key and it uses uuid library to generate random id's
    id: string;

    @Column()
    title: string;
    
    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne( () => User, (user) => user.tasks, { eager: false} )
    // @Exclude( { toPlainOnly: true} )  
    @JoinColumn()          // this mean when we output the task as a response don't show the user property( keep-- 
    user: User;                                 // ---it hidden ) . It is like setDefault: false in mongoose schema           
}