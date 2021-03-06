import Express from 'express';
import logger from '@zorzal2/logger';
import { ServerError, AppError } from '../server-error';

let serverLog = logger.create('server-app:error-handler');

type Request = Express.Request;
type Response = Express.Response;
type NextFunction = Express.NextFunction;
type CommonError = Error & { stack: string };
type ApplicationError = AppError & CommonError;

const isError = (err: any): err is CommonError => {
    return err instanceof Error;
};

const isAppError = (err: any): err is ApplicationError => {
    return err instanceof AppError;
};

function handlerCommonError(err: Error): AppError {
    return ServerError.internalServerError.new(undefined, err);
}

function handlerUnknowObject(obj: any): AppError {
    return ServerError.internalServerError.new(obj);
}

function ErrorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    const serverError: AppError =
            isAppError(err) ? err :
            isError(err) ? handlerCommonError(err) :
            handlerUnknowObject(err);

    const errorStatus = ServerError.statusOf(serverError);

    serverLog.info(
            `Request(path="${req.originalUrl}", body=${JSON.stringify(req.body)}) => ` +
            `Error(status=${errorStatus}, body=${JSON.stringify(serverError)})`);

    return res.status(errorStatus).send(serverError);
}

export {
    ErrorHandlerMiddleware
};
