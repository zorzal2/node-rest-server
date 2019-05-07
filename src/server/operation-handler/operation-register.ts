import logger from '@zorzal2/logger';
import Express from 'express';
import { Handler, InterceptHandler } from './model/handlers';

let serverLog = logger.create('server-app:request-handler');

type Request = Express.Request;
type Response = Express.Response;
type NextFunction = Express.NextFunction;
type ExpressRouter = Express.Router;

type validOperation = 'get' | 'post' | 'put' | 'delete' | 'patch';

type RequestContext = {
    request: Request;
    response: Response;
    args: any;
    headers: any;
    cookies: any;
};

class OperationRegister {
    constructor(private router: ExpressRouter, private pathsRecord: any) {
    }

    public createInterceptorRegister = () =>
            (paths: string[], interceptHandler: InterceptHandler) => {
                const expressPath = this.getPath(paths);
                serverLog.debug(`Inteceptor("${expressPath}")`);

                this.router.use(expressPath, (req: Request, res: Response, next: NextFunction) =>
                        interceptHandler.call(this.getContext(req, res), next).catch(next));
            }

    public createOperationRegister = <T extends Handler>
            (method: validOperation, successfulStatus: number, withBody: boolean) =>
                    (paths: string[], handler: T) => {
                        const expressPath = this.getPath(paths);
                        const params = this.getParams(paths);
                        this.recordPath(expressPath, method);

                        this.router[method](
                                expressPath,
                                (req: Request, res: Response, next: NextFunction) => {
                                    handler.call(this.getContext(req, res), ...this.getParamsValues(req, params, withBody))
                                    .then((result: any) => {
                                        serverLog.info(
                                                `Request(path="${req.originalUrl}", body=${JSON.stringify(req.body)}) => ` +
                                                `Response(status=${successfulStatus}, body=${JSON.stringify(result)})`);

                                        res.status(successfulStatus).json({ data: result });
                                    })
                                    .catch(next);
                                }
                        );
                    }

    private getExpressPath = (paths: string[]) => paths.map((p, idx) => p.startsWith('$') ? ':var' + idx : p);
    private getParams = (paths: string[]) => this.getExpressPath(paths).filter(p => p.startsWith(':')).map(p => p.slice(1));
    private getPath = (paths: string[]) => '/' + this.getExpressPath(paths).join('/');
    private getParamsValues = (req: Request, params: string[], withBody: boolean) =>
            (withBody ? [req.body] : []).concat(params.map(param => req.params[param]))
    private getContext = (req: Request, res: Response): RequestContext => {
        return {
            request: req
            , response: res
            , args: req.query
            , headers: req.headers
            , cookies: req.cookies
        };
    }
    private recordPath = (path: string, method: validOperation) => {
        serverLog.debug(`Handler(${method.toUpperCase()}, "${path}")`);
        this.pathsRecord[path] = this.pathsRecord[path] === undefined ? [] : this.pathsRecord[path];
        this.pathsRecord[path].push(method);
    }
}

export {
    OperationRegister,
    RequestContext,
    validOperation,
    Handler
};
