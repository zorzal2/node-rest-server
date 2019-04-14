import Express from 'express'
import { CreatePathHandler } from './path-proxy';

type ExpressApp = Express.Express
type Request = Express.Request
type Response = Express.Response
type NextFunction = Express.NextFunction

interface Transaction{
    req: Request
    res: Response
}

interface ListHandler{
    (transaction: Transaction) : any
}

interface GetHandler{
    (id: String, transaction: Transaction) : any
}

interface AddHandler{
    (body: Object, transaction: Transaction) : any
}

interface UpdateHandler{
    (id: string, body: Object, transaction: Transaction) : any
}

interface RemoveHandler{
    (id: String, transaction: Transaction) : any
}

interface InterceptHandler{
    (transaction: Transaction, next: NextFunction) : any
}

interface RequestHandlerCreator<F, T> {
    (handler : F): T
}

interface PathHandler {
    [key: string] : RequestHandler
    _handler: RequestHandler
}

class RequestHandler {

    public _: PathHandler

    constructor(protected app: ExpressApp, protected path: string, protected identifier?: string){

    }

    list: RequestHandlerCreator<ListHandler, RequestHandler> = (listHandler: ListHandler): RequestHandler => {
        console.log('register list : ' + this.path)
        this.app.get(this.path, (req, res) => {
            return res.send(listHandler({ req, res}))
        })
        return this
    }
    get: RequestHandlerCreator<GetHandler, RequestHandler> = (getHandler: GetHandler): RequestHandler => {
        console.log('register get : ' + this.path + '/:' + this.identifier)
        this.app.get(this.path + '/:' + this.identifier , (req, res) => {
            return res.send(getHandler(req.params[this.identifier], { req, res}))
        })
        return this
    }
    add: RequestHandlerCreator<AddHandler, RequestHandler>= (addHandler: AddHandler): RequestHandler => {
        this.app.put(this.path, (req, res) => {
            return res.send(addHandler(req.body, { req, res}))
        })
        return this
    }
    update: RequestHandlerCreator<UpdateHandler, RequestHandler>= (updateHandler: UpdateHandler): RequestHandler => {
        this.app.post(this.path + '/:'+  this.identifier, (req, res) => {
            return res.send(updateHandler(req.params[this.identifier], req.body, { req, res}))
        })
        return this
    }
    remove: RequestHandlerCreator<RemoveHandler, RequestHandler>= (removeHandler: RemoveHandler): RequestHandler => {
        this.app.delete(this.path + '/:'+  this.identifier, (req, res) => {
            return res.send(removeHandler(req.params[this.identifier], { req, res}))
        })
        return this
    }
    intercept: RequestHandlerCreator<InterceptHandler, RequestHandler>= (interceptHandler: InterceptHandler): RequestHandler => {
        console.log('register intercept : ' + this.path)
        this.app.use(this.path, (req, res, next) => {
            return interceptHandler({req, res}, next)
        })
        return this
    }

    create(_parent: PathHandler,  _name: string, ): RequestHandler{
        const pathSeparator = this.path[this.path.length - 1] == '/' ?  '' : '/:' + this.identifier + '/'
        const newPath = this.path + pathSeparator + _name
        const newHandler = new RequestHandler(this.app, newPath, _name+'Id')
        newHandler._ = CreatePathHandler(newHandler)
        return newHandler
    }
}

export {
    PathHandler,
    RequestHandler
}