import type { PropOptions, PropType } from 'vue-types/dist/types';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

type Prop<T, D = T> = PropOptions<T, D> | PropType<T>;
type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never;
}[keyof T];

type PublicOptionalKeys<T> = Exclude<keyof T, PublicRequiredKeys<T>>;
type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null | true }
    ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? Record<string, any>
      : T extends BooleanConstructor | { type: BooleanConstructor }
        ? boolean
        : T extends Prop<infer V, infer D>
          ? unknown extends V
            ? D
            : V
          : T

declare global {
  type XOR<T, U> = T | U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

  // eslint-disable-next-line @typescript-eslint/ban-types
  export type IxPublicPropTypes<O> = O extends object
    ? { [K in PublicRequiredKeys<O>]: InferPropType<O[K]> } & {
        [K in PublicOptionalKeys<O>]?: InferPropType<O[K]>;
      }
    : { [K in string]: any };

  export type ValueOf<TVal> = TVal extends unknown[]
      ? TVal[number]
      : TVal extends object
        ? TVal[keyof TVal]
        : TVal;

  interface ImportMetaEnv {
    readonly DEV: boolean;
    readonly MODE: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
