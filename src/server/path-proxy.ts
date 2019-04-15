import { Express as ExpressApp } from 'express'
import Proxify from '../utils/proxify'
import { PathHandler, RequestHandler } from './handlers'


export function CreateProxyPathHandler(app: ExpressApp, path: string) : PathHandler {
    return Proxify((<PathHandler> new Function()) , {
        get: <PropertyKey extends keyof PathHandler>
                (target: PathHandler,property: PropertyKey,reciver: any) : PathHandler[PropertyKey] => {

            if (!(property in target)) {
                const isPathParam = property.toString().startsWith('$')
                console.log((isPathParam? 'declare param: ' : 'create path: ') + property)
                const newPath = path + (isPathParam ? '/:' : '/') + (isPathParam ? property.toString().split('$')[1] : property)
                target[property] = CreateProxyPathHandler(app, newPath )
            }
                    
            return target[property]
        },
        apply: (target: PathHandler, thisArg: any, argArray?: any): RequestHandler => {
            return new RequestHandler(app, path)
        }
    })
}