import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor( @InjectRepository(User) private usersRepository: UsersRepository,)
    {
           super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
           }) 
    }

    async validate(payload: JwtPayload): Promise<User>{
        const { username } = payload;
        const user: User = await this.usersRepository.findOne({ where: { username }});

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }
}

// Note: Passport automatically creates a user object, based on the value we return from the validate() method, and assigns it to the Request object as req.user