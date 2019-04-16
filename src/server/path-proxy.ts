import { Express as ExpressApp } from 'express'
import Proxify from '../utils/proxify'
import { PathHandler, RequestHandler } from './handlers'

function resolvePath(property: PropertyKey){
    const path =  property.toString()
    const isPathParam = path.startsWith('$')
    return isPathParam ? ':' + path.slice(1) : path
}

export function CreateProxyPathHandler(app: ExpressApp, paths: string[]) : PathHandler {
    return Proxify((<PathHandler> new Function()), {
        get: <PropertyKey extends keyof PathHandler>
                (target: PathHandler, property: PropertyKey,reciver: any) : PathHandler[PropertyKey] => {
            if (!(property in target)) {
                target[property] = 
                    CreateProxyPathHandler(
                        app,
                        paths.concat([resolvePath(property)])
                    )
            }
                    
            return target[property]
        },
        apply: (target: PathHandler, thisArg: any, argArray?: any): RequestHandler => {
            return new RequestHandler(app, paths)
        }
    })
}