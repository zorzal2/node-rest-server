import Express from 'express'

type ExpressApp = Express.Express
type Request = Express.Request
type Response = Express.Response
type NextFunction = Express.NextFunction

interface Transaction{
    req: Request
    res: Response
}

interface ListHandler{
    (...params: string[]) : any
}

interface GetHandler{
    (...params: string[]) : any
}

interface AddHandler{
    (body: Object, ...params: string[]) : any
}

interface UpdateHandler{
    (body: Object, ...params: string[]) : any
}

interface RemoveHandler{
    (...params: string[]) : any
}

interface InterceptHandler{
    (next: NextFunction) : any
}

interface RequestHandlerCreator<F, T> {
    (handler : F): T
}

class RequestHandler {

    private params: string[];

    constructor(protected app: ExpressApp, protected path: string){
        this.params = path
                .split('/')
                .filter(path => path.startsWith(':'))
                .map(path => path.split(':')[1])
    }

    private getParams(req: Request): string[] {
        return this.params.map(param => req.params[param]).filter(val => val != null)
    }


    list: RequestHandlerCreator<ListHandler, RequestHandler> = (listHandler: ListHandler): RequestHandler => {
        console.log('register list : ' + this.path + ' - ' + this.params.join(','))
        this.app.get(this.path, (req, res) => {
            return res.send(listHandler.call({ req, res}, ...this.getParams(req)))
        })
        return this
    }
    get: RequestHandlerCreator<GetHandler, RequestHandler> = (getHandler: GetHandler): RequestHandler => {
        console.log('register get : ' + this.path + ' - ' + this.params.join(','))
        this.app.get(this.path , (req, res) => {
            return res.send(getHandler.call({ req, res}, ...this.getParams(req)))
        })
        return this
    }
    add: RequestHandlerCreator<AddHandler, RequestHandler>= (addHandler: AddHandler): RequestHandler => {
        this.app.put(this.path, (req, res) => {
            return res.send(addHandler.call({ req, res}, req.body))
        })
        return this
    }
    update: RequestHandlerCreator<UpdateHandler, RequestHandler>= (updateHandler: UpdateHandler): RequestHandler => {
        this.app.post(this.path, (req, res) => {
            //BUG
            return res.send(updateHandler.call({req, res}, req.body, ...this.getParams(req)))
        })
        return this
    }
    remove: RequestHandlerCreator<RemoveHandler, RequestHandler>= (removeHandler: RemoveHandler): RequestHandler => {
        this.app.delete(this.path, (req, res) => {
            return res.send(removeHandler.call({ req, res}, ...this.getParams(req)))
        })
        return this
    }
    intercept: RequestHandlerCreator<InterceptHandler, RequestHandler>= (interceptHandler: InterceptHandler): RequestHandler => {
        console.log('register intercept : ' + this.path)
        this.app.use(this.path, (req, res, next) => {
            return interceptHandler.call({req, res}, next)
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