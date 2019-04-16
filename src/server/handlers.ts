import Express from 'express'

type ExpressApp = Express.Express
type Request = Express.Request
type Response = Express.Response
type NextFunction = Express.NextFunction

type ListHandler = (...params: string[]) => any
type GetHandler = (...params: string[]) => any
type AddHandler = (body: Object, ...params: string[]) => any
type UpdateHandler = (body: Object, ...params: string[]) => any
type RemoveHandler = (...params: string[]) => any
type InterceptHandler = (next: NextFunction) => any

interface RequestMethodHandler<F> {
    (handler : F): RequestHandler
}

interface Handler{
    (body: Object, ...params: string[])
}

class RequestHandler {

    private params: string[];
    private path: string;

    constructor(protected app: ExpressApp, protected paths: string[]){
        this.params = paths
                .filter(path => path.startsWith(':'))
                .map(path => path.split(':')[1])
        this.path = paths.join('/');
    }

    private getParams(req: Request): string[] {
        return this.params.map(param => req.params[param]).filter(val => val != null)
    }

    private getContext(req: Request, res: Response) {
        return { 
            request: req,
            response: res,
            query: req.query,
            headers: req.headers,
            cookies: req.cookies
        }
    }

    private registerHandler<method extends keyof ExpressApp>(method: method, handler: Handler) {
        console.log(`Handler('${this.path}','${method.toUpperCase()}')`)
        this.app[method](this.path, (req, res) => {
            return res.send(handler.call(this.getContext(req, res), req.body, this.getParams(req)))
        })
        return this
    }

    list: RequestMethodHandler<ListHandler> = (listHandler: ListHandler): RequestHandler => {
        return this.registerHandler('get', (body, params) => listHandler.call(this, params))
    }
    get: RequestMethodHandler<GetHandler> = (getHandler: GetHandler): RequestHandler => {
        return this.registerHandler('get', (body, params) => getHandler.call(this, params))
    }
    add: RequestMethodHandler<AddHandler>= (addHandler: AddHandler): RequestHandler => {
        return this.registerHandler('put', (body, params) => addHandler.call(this, body))
    }
    update: RequestMethodHandler<UpdateHandler>= (updateHandler: UpdateHandler): RequestHandler => {
        return this.registerHandler('post', (body, params) => updateHandler.call(this, body, params))
    }
    remove: RequestMethodHandler<RemoveHandler>= (removeHandler: RemoveHandler): RequestHandler => {
        return this.registerHandler('delete', (body, params) => removeHandler.call(this, params))
    }
    intercept: RequestMethodHandler<InterceptHandler>= (interceptHandler: InterceptHandler): RequestHandler => {
        console.log(`Interceptor('${this.path}')`)
        this.app.use(this.path, (req, res, next) => {
            return interceptHandler.call(this.getContext(req, res), next)
        })
        return this
    }
}

interface PathHandler {
    [key: string] : PathHandler
    (): RequestHandler
}

export {
    PathHandler,
    RequestHandler
}