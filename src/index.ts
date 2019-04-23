import _default from '@zorzal2/context';
import logger from '@zorzal2/logger';
import { StartServer, RequestContext } from './server/server';
import { NextFunction } from 'connect';

const Context = _default;

const appLog = logger.create('app');

let load = (id) => id;
let save = (some) => some;
let update = (id, some) => some;

const server  = StartServer();

server
    .intercept(function name1(this: RequestContext, next: NextFunction) {
        appLog.info(Context.get('XHeaders'));
        next();
    });



server.get.users.$id(function(this: RequestContext, id: string) {
    return load(id);
});
server.add.users.$id(function(body) { return save(body); });
server.update.users.$id(function(body, id) { return update(id, body); });
server.remove.users.$id(function(id) { return load(id); });

server.get.users.$userId.phones.$phoneId(function(userId, phoneId) {
    appLog.info('phone list by : ' + userId);
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

server.get.game.$gameId.player.$playerId.score.$scoreId(async function(gameId, playerId) {
    return {
        gameId,
        playerId,
        score: []
    };
});


