import { code, AppError } from '@zorzal2/common';

const statusCodes = {
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    notAcceptable: 406,
    proxyAuthenticationRequired: 407,
    requestTimeout: 408,
    conflict: 409,
    gone: 410,
    lengthRequired: 411,
    preconditionFailed: 412,
    payloadTooLarge: 413,
    URITooLong: 414,
    unsupportedMediaType: 415,
    requestedRangeNotSatisfiable: 416,
    expectationFailed: 417,
    misdirectedRequest: 421,
    unprocessableEntity: 422,
    locked: 423,
    failedDependency: 424,
    upgradeRequired: 426,
    preconditionRequired: 428,
    tooManyRequests: 429,
    requestFieldsTooLarge: 431,
    unavailableForLegalReasons: 451,
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504,
    HTTPVersionNotSupported: 505,
    variantAlsoNegotiates: 506,
    insufficientStorage: 507,
    loopDetected: 508,
    notExtended: 510,
    networkAuthenticationRequired: 511
};

const Codes = code.complete({
    badRequest: {
        message: 'badRequest'
    },
    unauthorized: {
        message: 'unauthorized'
    },
    forbidden: {
        message: 'forbidden'
    },
    notFound: {
        message: 'notFound'
    },
    methodNotAllowed: {
        message: 'methodNotAllowed'
    },
    notAcceptable: {
        message: 'notAcceptable'
    },
    proxyAuthenticationRequired: {
        message: 'proxyAuthenticationRequired'
    },
    requestTimeout: {
        message: 'requestTimeout'
    },
    conflict: {
        message: 'conflict'
    },
    gone: {
        message: 'gone'
    },
    lengthRequired: {
        message: 'lengthRequired'
    },
    preconditionFailed: {
        message: 'preconditionFailed'
    },
    payloadTooLarge: {
        message: 'payloadTooLarge'
    },
    URITooLong: {
        message: 'URITooLong'
    },
    unsupportedMediaType: {
        message: 'unsupportedMediaType'
    },
    requestedRangeNotSatisfiable: {
        message: 'requestedRangeNotSatisfiable'
    },
    expectationFailed: {
        message: 'expectationFailed'
    },
    misdirectedRequest: {
        message: 'misdirectedRequest'
    },
    unprocessableEntity: {
        message: 'unprocessableEntity'
    },
    locked: {
        message: 'locked'
    },
    failedDependency: {
        message: 'failedDependency'
    },
    upgradeRequired: {
        message: 'upgradeRequired'
    },
    preconditionRequired: {
        message: 'preconditionRequired'
    },
    tooManyRequests: {
        message: 'tooManyRequests'
    },
    requestFieldsTooLarge: {
        message: 'requestFieldsTooLarge'
    },
    unavailableForLegalReasons: {
        message: 'unavailableForLegalReasons'
    },
    internalServerError: {
        message: 'internalServerError'
    },
    notImplemented: {
        message: 'notImplemented'
    },
    badGateway: {
        message: 'badGateway'
    },
    serviceUnavailable: {
        message: 'serviceUnavailable'
    },
    gatewayTimeout: {
        message: 'gatewayTimeout'
    },
    HTTPVersionNotSupported: {
        message: 'HTTPVersionNotSupported'
    },
    variantAlsoNegotiates: {
        message: 'variantAlsoNegotiates'
    },
    insufficientStorage: {
        message: 'insufficientStorage'
    },
    loopDetected: {
        message: 'loopDetected'
    },
    notExtended: {
        message: 'notExtended'
    },
    networkAuthenticationRequired: {
        message: 'networkAuthenticationRequired'
    }
});

const ServerError = {
 ...Codes,
 statusOf: (err: AppError) => {
    const validStatus = Object.keys(statusCodes).filter(name => err.code.startsWith(name));
    return validStatus.length > 0 ? statusCodes[validStatus[0]] : statusCodes.internalServerError;
 }
};

export {
    ServerError,
    AppError
};
