import Proxify from '../utils/proxify';
import { PathHandler, OperationHandler, RequestRegister } from './handlers';

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
                                            paths.concat([ property.toString().startsWith('$') ?
                                                            ':' + paths.length :
                                                            property.toString()
                                                        ]),
                                            onExcecute)
                    , apply: (  target: PathHandler<T>,
                                thisArg: any,
                                argArray: T[]): void => onExcecute(paths, argArray[0])
                });
