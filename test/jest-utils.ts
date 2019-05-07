const jestUtils = {
    asMock: <T>(some: T) =>
        some instanceof Function ? <jest.Mocked<typeof some>> some : <jest.Mocked<T>> some,

    asTypeOf: <T>(someOfType: T, toCast: any) => <T> toCast
};

export {
    jestUtils
};
