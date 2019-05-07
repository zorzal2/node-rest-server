import context from '@zorzal2/context';
import logger from '@zorzal2/logger';
import Express from 'express';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Compression from 'compression';
import { OperationManager } from './operation-handler/operation-manager';
import { OperationRegister, RequestContext } from './operation-handler/operation-register';
import { ErrorHandlerMiddleware } from './middleware/error-handler.middleware';
import { headersMiddleware, pageNotFoundMiddleware } from './middleware/common.middleware';

let serverLog = logger.create('server-app:server');

class ServerConfig {
    port?: number;
}

const defaultConf: ServerConfig  = { port: 7000 };

function StartServer(conf: ServerConfig = defaultConf): OperationManager {
    const pathsRecord = {};
    const serverRoutes = Express.Router();
    const app = Express();
    app.use(BodyParser.json());
    app.use(Compression());
    app.use(CookieParser());
    app.use(context.middleware);
    app.use(headersMiddleware);
    app.use(serverRoutes);
    app.use(pageNotFoundMiddleware(pathsRecord));
    app.use(ErrorHandlerMiddleware);
    app.listen(conf.port);

    serverLog.info(`Server started!!! - On port :${conf.port}`);
    return new OperationManager(new OperationRegister(serverRoutes, pathsRecord));
}

const $id = '$id';

export {
    StartServer,
    ServerConfig,
    RequestContext,
    $id
};
