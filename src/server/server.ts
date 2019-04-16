import Express from 'express'
import BodyParser from 'body-parser'
import Compression from 'compression'
import { PathHandler, RequestHandler } from './handlers'
import { CreateProxyPathHandler } from './path-proxy'

type ExpressApp = Express.Express


class ServerConfig{
    name: String
    port? : Number
}

const defaultConf: ServerConfig  = { name: 'default-app', port: 7000 }

function StartServer(conf: ServerConfig = defaultConf): PathHandler {    
    const app: ExpressApp = Express()
	app.use(BodyParser.json())
    app.use(Compression())
    app.listen(conf.port)
    return CreateProxyPathHandler(app, []);
}


export {
    StartServer,
    ServerConfig,
    RequestHandler,
}