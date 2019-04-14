export default function proxify<T extends object>(target: T, handler: ProxyHandler<T>) : T {
    return new Proxy(target, handler);
}