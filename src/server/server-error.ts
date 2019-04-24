import { code } from '@zorzal2/common';

const errors = code.complete({
    internalError: {
        status: 500,
        name: 'InternalServerError',
        message: 'Unhandler Server Error',
    },
    badRequest: {
        status: 400,
        name: 'BadRequest',
        message: 'Bad Request',

        pageNotFound: {
            status: 404,
            name: 'PageNotFound',
            message: 'This server cannot have a service for the requested path'
        }
    }
});

type AnyError = {
    name: string;
    message: string;
    status?: number;
    stack?: string;
    code?: string;
    cause?: AnyError;
};

const ServerError = {
    ...errors,
    create: (errorType: AnyError, extraData: object) => {
        const error = new Error();
        return {
            ...error,
            ...errorType,
            ...extraData
        };
    },
    throw: function(errorType: AnyError, extraData: object) {
        throw this.create(errorType, extraData);
    }
};

export {
    ServerError
};
