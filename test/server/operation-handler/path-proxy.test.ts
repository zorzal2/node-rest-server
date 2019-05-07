import { ProxyPathManager } from '../../../src/server/operation-handler/path-proxy';

test('common use of proxy', () => {
    const fn = jest.fn(() => { return 10; });
    const proxy: any = ProxyPathManager.create([], fn);

    proxy.first.some.other(5, 34, 'some');
    expect(fn).toBeCalledWith(['first', 'some', 'other'], 5);
});

test('dont override predefinded properties', () => {
    const fn = jest.fn(() => { return 10; });
    const proxy: any = ProxyPathManager.create([], fn);

    expect(proxy.length).toBe(0);
});

