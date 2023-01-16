import { IsString, Matches, matches, Max, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
            {
                message:  'password has to follow the rules: Passwords will contain at least 1 upper case letter. Password will contain at least 1 lower case letter. Passwords will contain at least 1 number or special character.'
            })
    password: string;
}



/*
Here is a regular expression so that the password follows the following rules.

Passwords will contain at least 1 upper case letter
Passwords will contain at least 1 lower case letter
Passwords will contain at least 1 number or special character
There is no length validation (min, max) in this regex!

Regular expression for JavaScript:
/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/


So, we use the Matches(regex, {error message}) function provided by the class-validator library to match the password to this expression

*/