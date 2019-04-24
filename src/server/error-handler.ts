import Express from 'express';
import { AppError, code } from '@zorzal2/common';
import { ServerError } from './server-error';

type Request = Express.Request;
type Response = Express.Response;
type NextFunction = Express.NextFunction;

type ServerError = {
    name: string;
    code: string;
    message: string;
    stack: string;
    status: number;
    cause?: object;
    args?: object;
};

const isServerError = (err: any): err is ServerError => {
    return  err.name && err.name instanceof String &&
            err.code && err.code instanceof String &&
            err.status && err.status instanceof Number &&
            err.message && err.message instanceof String &&
            err.stack && err.stack instanceof String;
};

const isAppError = (err: any): err is AppError => {
    return  err.name && err.name instanceof String &&
            err.code && err.code instanceof String &&
            err.message && err.message instanceof String &&
            err.stack && err.stack instanceof String;
};
const isError = (err: any): err is Error => {
    return  err.name && err.name instanceof String &&
            err.message && err.message instanceof String &&
            err.stack && err.stack instanceof String;
};

function handlerAppError(err: AppError): ServerError {
    return <ServerError>{
        ...err,
        status: 500
    };
}

function handlerCommonError(err: Error): ServerError {
    return <ServerError>{
        ...ServerError.internalError,
        ...err,
    };
}

function handlerUnknowObject(err: any): ServerError {
    return ServerError.throw(ServerError.internalError, { cause: err });
}

function ErrorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    const serverError: ServerError = isServerError(err) ? err :
            isAppError(err) ? handlerAppError(err) :
            isError(err) ? handlerCommonError(err) :
            handlerUnknowObject(err);

    return res.status(serverError.status).send(serverError);
}

export {
    ErrorHandlerMiddleware
};
