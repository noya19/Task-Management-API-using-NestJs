# Guards in Nestjs

- A guard at its core is a class that implements the **CanActivate** interface and is annotated with the **@Injectable()** decorator.

- The **core responsibility** of a gaurd is to determine whether a request will be handled by the route handler or not, depending upon certain conditions like permissions, roles, etc. This is often referred as **Authorization.**

#### How is it effective against typical Express applications that uses middleware for authorization ?

- Middleware by its nature is dumb, it doesn't know which handler will be executed after calling the **next()** function.

- But Nest guards have access to the \***\*ExecutionContext\*\*** instance, and thus know exactly what is going to be executed next.

- It can insert processing logic at exactly the right point in the request response cycle.

> Note: Guards are executed after all middlewares but before any interceptor or pipe.

## AUTHORIZATION GUARD

An authorization guard ensures that a route is available only when two conditions are satisfied:

- The user is authenticated i.e. a user is logged in ( and a valid JWT token is attached to the request object.)
- The user has permissions to access the requested Route.

The guard will extract and validate the token, and use the information to determine whether the request can be proceeded or not.

#### DEFINING A GUARD IN NESTJS

While defining a guard we have to keep the following things in mind:

- The guard has to provide implementation for the **_canActivate function_** which is available by implementing the **CanActivate** interface.
- This function has to return a Boolean value , indicating
  - if **_true_**, the request is allowed.
  - if **_false_**, the request is denied.
- The Boolean can be return in the form of a Promise or an Observable.

> auth.guard.ts

```typescript
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolen | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

The canActivate function takes only one argument which is the ExecutionContext.

> So, what is the ExecutionContext class?

A NestJs application can run in different contexts namley HTTP Server based, microservices, WebSockets application contexts. The ExecutionContext class which extends ArgumentsHost class helps us to determine the context in which the current application is running and also reveals some methods that helps us to interact with it.
Some of them used here are:

- **switchToHttp()**: this method helps to switch to a HTTP Server based context.
- **getRequest()**: this method retrieves the request object
  > Note: getRequest() method is only available for HTTP Server based context. Read about the other contexts [here](https://docs.nestjs.com/fundamentals/execution-context).

> Note: The logic in validateRequest() can be simple or complex according to one's needs. But it should return a Boolean.

## BINDING GUARDS

- A guard can bind globally, to a controller or to a method.( Global Scope, controller scope or method scope).
- A guard is setup using the **@UseGaurds()** decorator. This decorator takes a single argument or a comma separated list of arguments denoting the guards.

> UserController.ts

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGaurd } form '/auth.guard'

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  @Get()
  findAllUser(): string {
    return 'This action returns all users';
  }
}
```

- As we passed the AuthGuard into the decorator _@UseGuard()_, the framework automatically instantiates the guard, enabling it for dependency injection. We can also pass in-place instances:

```typescript
@Controller("users")
@UseGuards(new AuthGuard())
export class UserController {}
```

- The following construct attaches the guard to each and every handler declared by the controller.
- If we want to use a guard at a method level we have to apply the @UseGuard() decorator before a method.

#### GLOBAL GUARDS

Guards can be applied globally to the entire application using the **useGlobalGuard()** method of the Nest Application instance.

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalGuard(new AuthGuard());
```

Global guards apply for every controller and every route handler.

In terms of dependency injection, global guards registered from outside of any module cannot inject dependencies since this is done outside the context of any module. In order to solve this issue, you can set up a guard directly from any module using the following construction:

```typescript
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

## ROLE BASED AUTHENTICATION

Nest provides an easy way to apply permission schemes for different routes with the helps of the [execution context](https://docs.nestjs.com/fundamentals/execution-context).
e.g. Some routes in an application should be available only to the 'admin' role and other routes to the normal 'user'.

- Nest has the ability to supply custom metadata to the route handlers using the @SetMetadata() decorator. We apply roles to the handler using this method.
  > we use the same example as before i.e. the UserController.ts

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGaurd } form '/auth.guard'

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  @Get()
  @SetMetadata('roles',['admin'])					// Line 1
  findAllUser(): string {
    return 'This action returns all users';
  }
```

- With the code above, we have attached ' roles' metadata ( _roles_ is a key, _['admin']_ is a particular value) to **findAllUser()** method.

- While the above construction using the **SetMetadata()** method works, it is always great to follow the convention of creating a custom roles decorator. This approach makes it more readable, reusable and strongly typed.

> roles.decorator.ts

```typescript
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

- Now we can use our custom **Roles** decorator to pass out metadata.

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGaurd } form '/auth.guard';
import { Roles } from '/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  @Get()
  @Roles('admin')					// Line 1
  findAllUser(): string {
    return 'This action returns all users';
  }
```

> Question: How does the guard ( in this e.g. the AuthGuard ) determine which handler is going to be executed next ?

> Question: How does the guard access the roles from the metadata to provide authorization ?

- As we mentioned earlier, the guards in Nestjs are intelligent ( since they have access to the execution context) and they know which handler will be called next.

- The **getHandler()** function of the [executionContext](https://docs.nestjs.com/fundamentals/execution-context#executioncontext-class) class returns the reference to the handler that will be executed next in the request pipeline.

  > eg. suppose we make a **get** request to the **'/users'** route ( refer to our example above ). Now, **context.getHandler()** will return a refernce to the handler about to be invoked ( in our example the **findAllUser()** method ).

- Now to access the custom metadata, we use the _Reflector_ helper class that is provided out of the box by Nestjs. It can be injected into a class in a normal way.

```typescript
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard {
  constructor(private reflector: Reflector) {}
}
```

- Now to read the handler metadata, use the **get()** method

```
const roles = this.reflector.get<string[]>('roles', context.getHandler());
```

- The **reflector.get** method accepts two arguments: a metadata _key_ and a context to retrieve the metadata from.

- In this example, context.getHandler() gives a reference to the findAllUser() handler ( as explained above ) and 'roles' is a key for the required metadata from that handler.

#### PUTTING IT ALL TOGETHER

The AuthGuard that we defined above just returned true for all cases, allowing every request to proceed. Now we use the Reflector class provided by nest to verify the roles permitted for different routes. We put all the information that we learned above to compile this guard.

```typescript
import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate{
	constructor(private reflector: Reflector){}

	canActivate( context: ExecutionContext): boolen | Promise<boolean>Observable<boolean> {
		 const roles = this.reflector.get<string[]>('roles', context.getHandler());
		 if( !roles ){							// Comment: No roles means all authenticated users are allowed
			 return true;
		 }

		 const request = context.switchToHttp().getRequest();
		 const user = request.user;				// Get the role from the user
		 return matchRoles(roles, user.roles); 	// check with the defined role to determine if user is authorized to access the route. ( return boolean)
	}
}
```

> Note:
> In the node.js world, it's common practice to attach the authorized user to the request object. Thus, in our sample code above, we are assuming that `request.user` contains the user instance and allowed roles.

> [Reflection and metadata](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata) section of the `Execution Context` contains more information about utilizing `Reflector` in a context-sensitive way.

- If a user with insufficient privileges request an endpoint ( i.e. a guard return a **false** value ), Nest automatically throws a **ForbiddenException** error. The response returned is:

```js
{
	"statusCode": 403,
	"message": "Forbidden resource",
	"error": "Forbidden"
}
```

- If we want to throw a different error response, we should throw our own specific exception.

```typescript
throw new UnauthorizedException();
```

- Any exception thrown by a guard will be handled by the [exceptions layer](https://docs.nestjs.com/exception-filters) (global exceptions filter and any exceptions filters that are applied to the current context).
