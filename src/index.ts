import { StartServer } from './server/server'

let load = (id) => id;
let save = (some) => some;
let update = (id, some) => some;


const serverApp = StartServer()

serverApp
    ._handler
        .intercept(function(transaction, next){
            console.log("Intercept :" + transaction.req.originalUrl)
            next();
        });

serverApp
    .users
        .list(() => [])


serverApp
    .users
        .get((id: String) => load(id))
        .add((body: any) => save(body))
        .update((id: String, body: any) => update(id, body))

serverApp.users._.phones.list(() => (userId) => [ 23, 43] )

serverApp.game._.player._.score.list(() => [])