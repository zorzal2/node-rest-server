import { jestUtils } from '../../jest-utils';
jest.mock('@zorzal2/context');
jest.mock('@zorzal2/common');

import context from '@zorzal2/context';
import { txid , code } from '@zorzal2/common';

const actualCode = jestUtils.asTypeOf(code, jest.requireActual('@zorzal2/common').code);

const txidMock = jestUtils.asMock(txid);
const codeMock = jestUtils.asMock(code);
const contextMock = jestUtils.asMock(context);

codeMock.complete.mockImplementation(actualCode.complete);

import { pageNotFoundMiddleware, headersMiddleware } from '../../../src/server/middleware/common.middleware';
import { ServerError as ServerErrorType } from '../../../src/server/server-error';

const ServerError = jestUtils.asTypeOf(ServerErrorType, jest.requireActual('../../../src/server/server-error').ServerError);

beforeEach(() => {
    txidMock.create.mockReset();
    contextMock.set.mockReset();
});

test('pageNotFoundMiddleware -> throw error', () => {
    const info = { some: 'info'};
    const expectError = ServerError.notFound.new({ some: 'info' });

    try {
        pageNotFoundMiddleware(info)(undefined, undefined, undefined);
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toEqual(expectError);
        expect(error.info).toEqual(expectError.info);
    }
});

test('headersMiddleware -> get context txid', () => {
    const next = jest.fn(() => { return; });
    const req = {
        headers: {
            'x-txid': 'someId'
        }
    };

    headersMiddleware(req, undefined, next);
    expect(contextMock.set).toBeCalledTimes(2);
    expect(contextMock.set.mock.calls[0]).toEqual(['txid', 'someId']);
    expect(contextMock.set.mock.calls[1]).toEqual(['xheaders', { 'x-txid': 'someId' }]);
    expect(next).toBeCalled();
});

test('headersMiddleware -> set context txid', () => {
    const next = jest.fn(() => { return; });
    const req = {
        headers: {}
    };

    headersMiddleware(req, undefined, next);
    expect(contextMock.set).toBeCalledTimes(2);
    expect(txidMock.create).toBeCalled();
    expect(next).toBeCalled();
});

test('headersMiddleware -> get headers', () => {
    const next = jest.fn(() => { return; });
    const req = {
        headers: {
            'x-txid': 'someId',
            invalidheader1: 'invalid',
            xinvalidheader2: 'invalid',
            'X-INVALIDHEADER': 'invalid',
            'x-validheader': 'valid'
        }
    };

    headersMiddleware(req, undefined, next);
    expect(contextMock.set).toBeCalledWith('txid', 'someId');
    expect(contextMock.set).toBeCalledWith('xheaders', { 'x-txid': 'someId', 'x-validheader': 'valid' });
    expect(next).toBeCalled();
});
