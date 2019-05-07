import { jestUtils } from '../../jest-utils';
import { OperationRegister } from '../../../src/server/operation-handler/operation-register';
import { ProxyPathManager } from '../../../src/server/operation-handler/path-proxy';
import { OperationManager } from '../../../src/server/operation-handler/operation-manager';

const proxy = () => ({});
jest.mock(
    '../../../src/server/operation-handler/path-proxy',
    () => ({
        ProxyPathManager: {
            create: jest.fn(() => proxy)
        }
    }) );

const operation = () => ({});
const interceptor = () => ({});
jest.mock(
    '../../../src/server/operation-handler/operation-register',
    () => ({
        OperationRegister: function() {
            return {
                createOperationRegister: jest.fn(() => operation),
                createInterceptorRegister: jest.fn(() => interceptor)
            };
        }
    }) );

const OperationRegisterMock = jestUtils.asMock(new OperationRegister(null, null));
const ProxyPathManagerMock = jestUtils.asMock(ProxyPathManager);

test('verify init', () => {

    const requestHandler = new OperationManager(OperationRegisterMock);
    expect(requestHandler.create).toBe(proxy);
    expect(requestHandler.list).toBe(proxy);
    expect(requestHandler.get).toBe(proxy);
    expect(requestHandler.remove).toBe(proxy);
    expect(requestHandler.invoke).toBe(proxy);
    expect(requestHandler.replace).toBe(proxy);
    expect(requestHandler.update).toBe(proxy);
    expect(requestHandler.intercept).toBe(proxy);

    expect(ProxyPathManagerMock.create).toBeCalledTimes(8);
    expect(ProxyPathManagerMock.create).toHaveBeenNthCalledWith(1, [], operation);
    expect(ProxyPathManagerMock.create).toHaveBeenNthCalledWith(2, [], operation);
    expect(ProxyPathManagerMock.create).toHaveBeenNthCalledWith(3, [], operation);
    expect(ProxyPathManagerMock.create).toHaveBeenNthCalledWith(4, [], operation);
    expect(ProxyPathManagerMock.create).toHaveBeenNthCalledWith(5, [], operation);
    expect(ProxyPathManagerMock.create).toHaveBeenNthCalledWith(6, [], operation);
    expect(ProxyPathManagerMock.create).toHaveBeenNthCalledWith(7, [], operation);
    expect(ProxyPathManagerMock.create).toHaveBeenNthCalledWith(8, [], interceptor);

    expect(OperationRegisterMock.createOperationRegister).toBeCalledTimes(7);
    expect(OperationRegisterMock.createOperationRegister).toHaveBeenNthCalledWith(1, 'get', 200, false);
    expect(OperationRegisterMock.createOperationRegister).toHaveBeenNthCalledWith(2, 'get', 200, false);
    expect(OperationRegisterMock.createOperationRegister).toHaveBeenNthCalledWith(3, 'put', 201, true);
    expect(OperationRegisterMock.createOperationRegister).toHaveBeenNthCalledWith(4, 'post', 201, true);
    expect(OperationRegisterMock.createOperationRegister).toHaveBeenNthCalledWith(5, 'patch', 201, true);
    expect(OperationRegisterMock.createOperationRegister).toHaveBeenNthCalledWith(6, 'delete', 204, false);
    expect(OperationRegisterMock.createOperationRegister).toHaveBeenNthCalledWith(7, 'post', 200, true);
    expect(OperationRegisterMock.createInterceptorRegister).toHaveBeenCalled();

});





