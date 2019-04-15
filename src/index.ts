import { StartServer } from './server/server'

let load = (id) => id;
let save = (some) => some;
let update = (id, some) => some;

const serverApp = StartServer()

/*
serverApp()
    .intercept(function(transaction, next){
        console.log("Intercept :" + transaction.req.originalUrl)
        next();
    });
*/

serverApp
    .users

serverApp()
        .list(() => [])

serverApp
    .users
        .$id()
            .get((transaction, id: String) => load(id))
            .add((transaction, body: any) => save(body))
            .update((transaction, id: String, body: any) => update(id, body))

serverApp.users.$userId.phones.$phoneId()
    .get((userId, phoneId) => {
        console.log('phone list by : '+ userId)
        return {
            userId,
            phoneId
        }
    })

serverApp.game.$gameId.player.$playerId.score()
    .list((gameId, playerId) => {
        return {
            gameId,
            playerId,
            score: []
        }
    })

serverApp.game.$gameId.player.$playerId.score.$scoreId()
    .get((gameId, playerId) => {
        return {
            gameId,
            playerId,
            score: []
        }
    })


serverApp.vuelos.search.$from.$to.prices()
    .list((from, to) => {
        return {
            from,
            to,
            prices: []
        }
    })