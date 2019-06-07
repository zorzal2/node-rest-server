import { StartServer, RequestContext, ServerError, $id} from './index';

const app = StartServer();

app.get.users(() => [ 'jose', 'leo', null, undefined ]);

app.get.users.async(async () => [ 'jose', 'leo', null, undefined ]);

app.get.users.promise(() => new Promise((resolve) => resolve([ 'jose', 'leo', null, undefined ])));
