// Interfaces in typescript help to enforce a shape of an object during compilation, but after compilation they are not preserved.
// Classes in javascript will allow us not only to enforce a structure but also can have methods in them. also they are preserved even after compilation.

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}