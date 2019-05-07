import Express from 'express';
type NextFunction = Express.NextFunction;

type ListHandler = (...params: string[]) => Promise<any[]> | any[];
type GetHandler = (...params: string[]) => any;
type RemoveHandler = (...params: string[]) => any;
type CreateHandler = (body: object, ...params: string[]) => any;
type ReplaceHandler = (body: object, ...params: string[]) => any;
type UpdateHandler = (body: object, ...params: string[]) => any;
type InvokeHandler = (body: object, ...params: string[]) => any;
type InterceptHandler = (next: NextFunction) => any;
type Handler = ListHandler | GetHandler | RemoveHandler | CreateHandler | ReplaceHandler| UpdateHandler | InvokeHandler | InterceptHandler;

export {
    Handler,
    ListHandler,
    GetHandler,
    RemoveHandler,
    CreateHandler,
    ReplaceHandler,
    UpdateHandler,
    InvokeHandler,
    InterceptHandler,
};
