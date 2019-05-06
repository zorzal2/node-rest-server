import { StartServer, ServerConfig, ServerError } from '../src';

test('check imports types', () => {
    expect(StartServer).toBeInstanceOf(Function);
    expect(ServerConfig).toBeInstanceOf(Object);
    expect(ServerError).toBeInstanceOf(Object);
});
