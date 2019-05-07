jest.mock('express');

import { StartServer } from '../../src/server/server';
import Express from 'express';

let ExpressAppMock = undefined;

beforeEach(() => {
    const use = jest.fn(() => { return {}; });
    const listen = jest.fn(() => { return {}; });
    ExpressAppMock = { use, listen};

    jest.isMockFunction(Express) ?
            Express.mockReturnValue(ExpressAppMock) :
            fail('Express must be a mock funtion');
});


test('start server without config', () => {
    StartServer();
    expect(ExpressAppMock.use).toBeCalledTimes(8);
    expect(ExpressAppMock.listen).toBeCalledTimes(1);
    expect(ExpressAppMock.listen).toHaveBeenCalledWith(7000);
});


test('start server with config', () => {
    StartServer({ port : 10000 });
    expect(ExpressAppMock.use).toBeCalledTimes(8);
    expect(ExpressAppMock.listen).toBeCalledTimes(1);
    expect(ExpressAppMock.listen).toHaveBeenCalledWith(10000);
});

