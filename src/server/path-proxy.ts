import Proxify from '../utils/proxify';
import { PathHandler, OperationHandler, RequestRegister } from './handlers';

const resolveProperty = (property: string, position: number) =>
    property.startsWith('$') ? [ ':' + position ] : [ property ];

export const CreateProxyPathHandler =
        <T extends OperationHandler>(paths: string[], onExcecute: RequestRegister<T>): PathHandler<T> =>
                Proxify((<PathHandler<T>> new Function()), {
                    get: <PropertyKey extends keyof PathHandler<T>>
                            (target: PathHandler<T>,
                             property: PropertyKey,
                             reciver: any): PathHandler<T>[PropertyKey] =>
                                    property in target ?
                                        target[property] :
                                        CreateProxyPathHandler(
                                            paths.concat(resolveProperty(property.toString(), paths.length)),
                                            onExcecute)
                    , apply: (  target: PathHandler<T>,
                                thisArg: any,
                                argArray: T[]): void => onExcecute(paths, argArray[0])
                });
