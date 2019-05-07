import { jestUtils } from '../../jest-utils';
import Express from 'express';
import logger from '@zorzal2/logger';

let routerMock = jestUtils.asMock(Express.Router());
let pathRecorder: any;
let operationRegister: OperationRegister;
let handlerRegister: Function;

jest.mock('express', () => ({
    Router: () => ({
        use: jest.fn((path: Array<String>, handler: Function) => handlerRegister = handler),
        get: jest.fn((path: Array<String>, handler: Function) => handlerRegister = handler),
        post: jest.fn((path: Array<String>, handler: Function) => handlerRegister = handler),
    })
}));

const logInfo = jest.fn();

jest.mock('@zorzal2/logger', () => ({
    create: () => ({
        info: logInfo,
        debug: () => ({})
    })
}));

import { OperationRegister } from '../../../src/server/operation-handler/operation-register';

const req = {
};
const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res)
};

const next = jest.fn();

beforeEach(() => {
    pathRecorder = {};
    operationRegister = new OperationRegister(<any> routerMock, pathRecorder);
});

test('test create interceptor', () => {
    const register = operationRegister.createInterceptorRegister();
    const handler = jest.fn(() => new Promise(() => 5));
    register(['some', 'path'], handler);

    expect(routerMock.use.mock.calls[0][0]).toBe('/some/path');

    handlerRegister(<any> req, <any> res, <any> next);
    expect(handler).toBeCalledWith(next);
});

test('test create operation', () => {
    const register = operationRegister.createOperationRegister('get', 200, false);
    const handler = { call : jest.fn(() => new Promise(() => 5)) };
    register(['some', 'path'], <any> handler);
    expect(pathRecorder['/some/path']).toEqual(['get']);

    expect(routerMock.get.mock.calls[0][0]).toBe('/some/path');

    handlerRegister(<any> req, <any> res, <any> next);
    expect(handler.call).toBeCalled();
});

