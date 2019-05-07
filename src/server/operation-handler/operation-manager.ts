import { ProxyPathManager, ProxyTargetType } from './path-proxy';
import { OperationRegister, validOperation } from './operation-register';
import {ListHandler,
        GetHandler,
        CreateHandler,
        ReplaceHandler,
        UpdateHandler,
        RemoveHandler,
        InvokeHandler,
        InterceptHandler } from './model/handlers';

class OperationManager {
    public list: ProxyTargetType<ListHandler>;
    public get: ProxyTargetType<GetHandler>;
    public create: ProxyTargetType<CreateHandler>;
    public replace: ProxyTargetType<ReplaceHandler>;
    public update: ProxyTargetType<UpdateHandler>;
    public remove: ProxyTargetType<RemoveHandler>;
    public invoke: ProxyTargetType<InvokeHandler>;
    public intercept: ProxyTargetType<InterceptHandler>;

    constructor(private operationRegister: OperationRegister) {
        this.list = this.initOperationHandler('get', 200, false);
        this.get = this.initOperationHandler('get', 200, false);
        this.create = this.initOperationHandler('put', 201, true);
        this.replace = this.initOperationHandler('post', 201, true);
        this.update = this.initOperationHandler('patch', 201, true);
        this.remove = this.initOperationHandler('delete', 204, false);
        this.invoke = this.initOperationHandler('post', 200, true);
        this.intercept = this.initInterceptorHandler();
    }

    private initOperationHandler = (method: validOperation, successfulStatus: number, withBody: boolean) => {
        return ProxyPathManager
                .create([], this.operationRegister.createOperationRegister(method, successfulStatus, withBody));
    }

    private initInterceptorHandler = () => {
        return ProxyPathManager.create([], this.operationRegister.createInterceptorRegister());
    }
}

export {
    OperationManager
};
