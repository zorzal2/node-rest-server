interface ProxyTargetType<H extends Function> {
    [key: string]: ProxyTargetType<H>;
    (handler: H): void;
}

const createProxy = <H extends Function, E extends Function> (paths: string[], onExcecute: E): ProxyTargetType<H> =>
        new Proxy((<ProxyTargetType<H>> new Function()), {
            get: <Property extends keyof ProxyTargetType<H>>(
                    target: ProxyTargetType<H>,
                    property: Property,
                    reciver: any): ProxyTargetType<H> =>
                            property in target ?
                                    target[property] :
                                    createProxy<H, E>(  paths.concat([property.toString()]),
                                                        onExcecute)
            , apply: (  target: ProxyTargetType<H>,
                        thisArg: any,
                        argArray: any[]): void => onExcecute(paths, argArray[0])
        });

const ProxyPathManager = {
    create: createProxy
};

export {
    ProxyTargetType,
    ProxyPathManager,
};
