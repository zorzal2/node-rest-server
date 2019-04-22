import logger from '@zorzal2/logger';
import Express from 'express';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Compression from 'compression';
import { RequestContext, RequestHandler } from './handlers';
import { AppError, isServerError } from './server-error';

let serverLog = logger.create('server-app');

type ExpressApp = Express.Express;
type Request = Express.Request;
type Response = Express.Response;
type NextFunction = Express.NextFunction;

type Router = Express.Router;
const Router = Express.Router;

class ServerConfig {
    name: string;
    port?: number;
}

const defaultConf: ServerConfig  = { name: 'default-app', port: 7000 };

function getOrDefault<T, Prop extends keyof T>
        (target: T, prop: Prop, type: Function, byDefault: T[Prop]): T[Prop] {
    return target[prop] !== undefined && target[prop] instanceof type ? target[prop] : byDefault;
}

function handlerCommonError(err: any): AppError {
    const error = <AppError> err;
    return {
        status: 500,
        code: 'UNHANDLE_EROR',
        message: undefined,
        stack: undefined
    };
}

function StartServer(conf: ServerConfig = defaultConf): any {
    const app: ExpressApp = Express();
    app.use(BodyParser.json());
    app.use(Compression());
    app.use(CookieParser());
    app.listen(conf.port);

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        const serverError: AppError = isServerError(err) ? err : handlerCommonError(err);
        return res.status(serverError.status).send(serverError);
    });

    const pathsRecord = {};
    const serverRoutes: Router = Router();

    app.use(serverRoutes);

    app.use((req, res, next) => {
        res.status(404).send('valid paths : ' + JSON.stringify(pathsRecord));
    });

    return {
        server: new RequestHandler(serverRoutes, pathsRecord),
        app
    };
}


export {
    StartServer,
    ServerConfig,
    RequestContext
};
