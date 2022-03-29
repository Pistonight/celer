export type Consumer<T> = (t:T)=>void;
export type BiConsumer<U, V> = (u: U, v: V)=>void;
export type Supplier<T> = ()=>T;
export type MapOf<T> = {[key: string]: T};
export type ReadonlyMapOf<T> = {readonly [key: string]: T};
export type EmptyObject = Record<string, unknown>;
