import { ServerError, standarErrors } from '../../src/server/server-error';
test('some', () => {
    const error = new ServerError(standarErrors.internalError, { some: 'info' });
    expect(error.message).toBe('Unhandler Server Error');
    expect(error.code).toBe('internalError');
    expect(error.info).toEqual({
        some: 'info'
    });
});
