import logger from '@zorzal2/logger';
import Express from 'express';
import { CreateProxyPathHandler } from './path-proxy';

let serverLog = logger.create('server-app');

type Request = Express.Request;
type Response = Express.Response;
type NextFunction = Express.NextFunction;
type ExpressRouter = Express.Router;

type ListHandler = (...params: string[]) => Promise<any[]> | any[];
type GetHandler = (...params: string[]) => any;
type RemoveHandler = (...params: string[]) => any;
type AddHandler = (body: object, ...params: string[]) => any;
type UpdateHandler = (body: object, ...params: string[]) => any;
type InvokeHandler = (body: object, ...params: string[]) => any;
type InterceptHandler = (next: NextFunction) => any;
type OperationHandler = ListHandler | GetHandler | RemoveHandler | AddHandler | UpdateHandler | InvokeHandler | InterceptHandler;
type validOperation = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'use' ;

type RequestContext = {
    request: Request;
    response: Response;
    args: any;
    headers: any;
    cookies: any;
};

function some(): RequestContext {
    return <RequestContext>{};
}

type RequestRegister<T extends OperationHandler> = (paths: string[], handler: T) => any;

interface PathHandler<T extends OperationHandler> {
    [key: string]: PathHandler<T>;
    (handler: T): void;
}

class RequestHandler {
    public list: PathHandler<GetHandler>;
    public get: PathHandler<GetHandler>;
    public add: PathHandler<AddHandler>;
    public update: PathHandler<UpdateHandler>;
    public remove: PathHandler<RemoveHandler>;
    public invoke: PathHandler<InvokeHandler>;
    public intercept: PathHandler<InterceptHandler>;

    constructor(private router: ExpressRouter, private pathsRecord: any) {
        this.list = this.initPathHanlder((paths: string[], listHandler: ListHandler) =>
                this.registerHandler('get', this.getPath(paths), this.getParams(paths), this.pathsRecord,
                                     function(body: object, ...params: string[]) { return listHandler.call(this, ...params); }));

        this.get = this.initPathHanlder((paths: string[], getHandler: GetHandler) =>
                this.registerHandler('get', this.getPath(paths), this.getParams(paths), this.pathsRecord,
                                     function(body: object, ...params: string[]) { return getHandler.call(this, ...params); }));

        this.add = this.initPathHanlder((paths: string[], addHandler: AddHandler) =>
                this.registerHandler('put', this.getPath(paths), this.getParams(paths), this.pathsRecord,
                                     function(body: object, ...params: string[]) { return addHandler.call(this, ...params); }));

        this.remove = this.initPathHanlder((paths: string[], removeHandler: RemoveHandler) =>
                this.registerHandler('delete', this.getPath(paths), this.getParams(paths), this.pathsRecord,
                                     function(body: object, ...params: string[]) { return removeHandler.call(this, ...params); }));

        this.update = this.initPathHanlder((paths: string[], updateHandler: UpdateHandler) =>
                this.registerHandler('patch', this.getPath(paths), this.getParams(paths), this.pathsRecord,
                                     function(body: object, ...params: string[]) { return updateHandler.call(this, body, ...params); }));

        this.invoke = this.initPathHanlder((paths: string[], invokeHandler: InvokeHandler) =>
                this.registerHandler('post', this.getPath(paths), this.getParams(paths), this.pathsRecord,
                                     function(body: object, ...params: string[]) { return invokeHandler.call(this, body, ...params); }));

        this.intercept = this.initPathHanlder((paths: string[], interceptHandler: InterceptHandler) =>
                this.registerInterceptor('use', this.getPath(paths), this.pathsRecord,
                                         function(next: NextFunction) { interceptHandler.call(this, next); } ));
    }

    private getParams = (paths: string[]) => paths.filter(p => p.startsWith(':')).map(p => p.slice(1));
    private getPath = (paths: string[]) => '/' + paths.join('/');
    private getParamsValues = (req: Request, params: string[]) => params.map(param => req.params[param]);
    private getContext = (req: Request, res: Response) => <RequestContext> {
        request: req
        , response: res
        , args: req.query
        , headers: req.headers
        , cookies: req.cookies
    }
    private initPathHanlder = <T extends OperationHandler>(onExecute: RequestRegister<T>) =>
            CreateProxyPathHandler<T>([], onExecute)
    private registerHandler = ( method: validOperation,
                                path: string,
                                params: string[],
                                pathsRecord: any,
                                handler: OperationHandler) => {
        pathsRecord[path] = pathsRecord[path] === undefined ? [] : pathsRecord[path];
        pathsRecord[path].push(method);
        serverLog.debug(`Handler(${method.toUpperCase()}, "${path}")`);
        this.router[method](path, async (req: Request, res: Response) => {
            const result = await handler.call(this.getContext(req, res), req.body, ...this.getParamsValues(req, params));
            serverLog.info( `Request(path="${req.originalUrl}", body=${JSON.stringify(req.body)}) => ` +
                            `Response(body=${JSON.stringify(result)})`);
            res.json(result);
        });
    }

    private registerInterceptor = ( method: validOperation,
                                    path: string,
                                    pathsRecord: any,
                                    handler: InterceptHandler) => {
        pathsRecord[path] = pathsRecord[path] === undefined ? [] : pathsRecord[path];
        pathsRecord[path].push(method);
        serverLog.debug(`Interceptor(${method.toUpperCase()}, "${path}")`);
        this.router[method](path, async (req: Request, res: Response, next: NextFunction) =>
                await handler.call(this.getContext(req, res), next));
    }
}

export {
    PathHandler,
    RequestHandler,
    OperationHandler,
    RequestRegister,
    RequestContext
};
