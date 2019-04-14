import Proxify from '../utils/proxify'
import { PathHandler, RequestHandler } from './handlers'


export function CreatePathHandler(requestHandler: RequestHandler) : PathHandler{
    const proxyPathHandler: PathHandler =
            Proxify({ 
                _handler: requestHandler
            }, {
                get: <PropertyKey extends keyof PathHandler>
                        (target: PathHandler,property: PropertyKey,reciver: any) : PathHandler[PropertyKey] => {

                    if (!(property in target)) {
                        console.log('creating : ' + property)
                        target[property] = target._handler.create(proxyPathHandler, property.toString())
                    }
                            
                    return target[property]
                }
            })

    return proxyPathHandler;
}