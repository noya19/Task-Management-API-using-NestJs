import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository extends Repository<User>{
}