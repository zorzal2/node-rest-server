import context from '@zorzal2/context';
import logger from '@zorzal2/logger';
import Express from 'express';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Compression from 'compression';
import { RequestHandler, RequestContext } from './request-handler/request-handler';
import { ErrorHandlerMiddleware } from './middleware/error-handler.middleware';
import { headersMiddleware, pageNotFoundMiddleware } from './middleware/common.middleware';

type ExpressApp = Express.Express;

type Router = Express.Router;
const Router = Express.Router;

let serverLog = logger.create('server-app:server');

class ServerConfig {
    port?: number;
}

const defaultConf: ServerConfig  = { port: 7000 };

function StartServer(conf: ServerConfig = defaultConf): RequestHandler {
    const pathsRecord = {};
    const serverRoutes: Router = Router();
    const app: ExpressApp = Express();
    app.use(BodyParser.json());
    app.use(Compression());
    app.use(CookieParser());
    app.use(context.middleware);
    app.use(headersMiddleware);
    app.use(serverRoutes);
    app.use(pageNotFoundMiddleware(pathsRecord));
    app.use(ErrorHandlerMiddleware);
    app.listen(conf.port);

    serverLog.info(`Server start on port :${conf.port}`);

    return new RequestHandler(serverRoutes, pathsRecord);
}

const $id = '$id';

export {
    StartServer,
    ServerConfig,
    RequestContext,
    $id
};
