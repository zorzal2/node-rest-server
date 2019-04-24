import context from '@zorzal2/context';
import Express from 'express';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Compression from 'compression';
import { RequestContext, RequestHandler } from './handlers';
import { ErrorHandlerMiddleware } from './error-handler';
import { ServerError } from './server-error';

type ExpressApp = Express.Express;

type Router = Express.Router;
const Router = Express.Router;

class ServerConfig {
    port?: number;
}

const headersInterceptor = (req, res, next) => {
    context.set('TxID', req.headers.txid);
    context.set('XHeaders', Object.keys(req.headers)
            .filter(name => name.startsWith('x-'))
            .reduce((xheaders, name) => {
                    xheaders[name] = req.headers[name];
                    return xheaders;
            },      <object> {} ));
    next();
};

const defaultConf: ServerConfig  = { port: 7000 };

function StartServer(conf: ServerConfig = defaultConf): RequestHandler {
    const pathsRecord = {};
    const serverRoutes: Router = Router();
    const app: ExpressApp = Express();
    app.use(BodyParser.json());
    app.use(Compression());
    app.use(CookieParser());
    app.use(context.middleware);
    app.use(headersInterceptor);
    app.use(serverRoutes);
    app.use((req, res, next) => ServerError.throw(ServerError.internalError, { args: pathsRecord }));
    app.use(ErrorHandlerMiddleware);
    app.listen(conf.port);

    return new RequestHandler(serverRoutes, pathsRecord);
}

const $id = '$id';

export {
    StartServer,
    ServerConfig,
    RequestContext,
    $id
};
