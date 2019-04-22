import logger from '@zorzal2/logger';
import { StartServer, RequestContext } from './server/server';
import { NextFunction } from 'connect';

const appLog = logger.create('app');

let load = (id) => id;
let save = (some) => some;
let update = (id, some) => some;

const serverApp  = StartServer();

const server = serverApp.server;
const app = serverApp.app;

server
    .intercept(function name1(this: RequestContext, next: NextFunction) {
        appLog.debug(`Request: '${this.request.originalUrl}' with : Headers `,  this.headers);
        next();
    });



server.get.users.$id(function(id) { return load(id); });
server.add.users.$id(function(body) { return save(body); });
server.update.users.$id(function(body, id) { return update(id, body); });
server.remove.users.$id(function(id) { return load(id); });

server.get.users.$userId.phones.$phoneId(function(userId, phoneId) {
    console.log('phone list by : ' + userId);
    return {
        userId,
        phoneId
    };
});

server.list.game.$gameId.player.$playerId.score(function(gameId: string, playerId: string) {
    return [{
        gameId,
        playerId,
        score: []
    }];
});

server.get.game.$gameId.player.$playerId.score.$scoreId(function(gameId, playerId) {
    return {
        gameId,
        playerId,
        score: []
    };
});


