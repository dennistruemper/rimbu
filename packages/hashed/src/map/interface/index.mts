import type { RMap } from '@rimbu/collection-types';
import type { RMapBase } from '@rimbu/collection-types/map-custom';
import type { Stream, Streamable } from '@rimbu/stream';
import type { Eq } from '@rimbu/common';

import type { HashMapCreators } from '#hashed/map-custom';
import type { Hasher } from '../../common/index.mjs';
import { createHashMapContext } from '#hashed/map-custom';

/**
 * A type-invariant immutable Map of key type K, and value type V.
 * In the Map, each key has exactly one value, and the Map cannot contain
 * duplicate keys.
 * See the [Map documentation](https://rimbu.org/docs/collections/map) and the [HashMap API documentation](https://rimbu.org/api/rimbu/hashed/map/HashMap/interface)
 * @typeparam K - the key type
 * @typeparam V - the value type
 * @note
 * - The `HashMap` uses the context's `hasher` instance to hash keys for performance.<br/>
 * - The `HashMap` uses the context's `eq` function to determine equivalence between keys.
 * @example
 * ```ts
 * const m1 = HashMap.empty<number, string>()
 * const m2 = HashMap.of([1, 'a'], [2, 'b'])
 * ```
 */
export interface HashMap<K, V> extends RMapBase<K, V, HashMap.Types> {}

export namespace HashMap {
  /**
   * A non-empty type-invariant immutable Map of key type K, and value type V.
   * In the Map, each key has exactly one value, and the Map cannot contain
   * duplicate keys.
   * See the [Map documentation](https://rimbu.org/docs/collections/map) and the [HashMap API documentation](https://rimbu.org/api/rimbu/hashed/map/HashMap/interface)
   * @note
   * - The `HashMap` uses the context's `hasher` instance to hash keys for performance.<br/>
   * - The `HashMap` uses the context's `eq` function to determine equivalence between keys.
   * @typeparam K - the key type
   * @typeparam V - the value type
   * @example
   * ```ts
   * const m1 = HashMap.empty<number, string>()
   * const m2 = HashMap.of([1, 'a'], [2, 'b'])
   * ```
   */
  export interface NonEmpty<K, V>
    extends RMapBase.NonEmpty<K, V, HashMap.Types>,
      Omit<HashMap<K, V>, keyof RMapBase.NonEmpty<any, any, any>>,
      Streamable.NonEmpty<readonly [K, V]> {
    stream(): Stream.NonEmpty<readonly [K, V]>;
  }

  /**
   * A context instance for a `HashMap` that acts as a factory for every instance of this
   * type of collection.
   * @typeparam UK - the upper key type bound for which the context can be used
   */
  export interface Context<UK> extends RMapBase.Context<UK, HashMap.Types> {
    readonly typeTag: 'HashMap';

    /**
     * A `Hasher` instance used to hash the map keys.
     */
    readonly hasher: Hasher<UK>;
    /**
     * An `Eq` instance used to check key equivalence.
     */
    readonly eq: Eq<UK>;
  }

  /**
   * A mutable `HashMap` builder used to efficiently create new immutable instances.
   * See the [Map documentation](https://rimbu.org/docs/collections/map) and the [HashMap.Builder API documentation](https://rimbu.org/api/rimbu/hashed/HashMap/Builder/interface)
   * @typeparam K - the key type
   * @typeparam V - the value type
   */
  export interface Builder<K, V>
    extends RMapBase.Builder<K, V, HashMap.Types> {}

  /**
   * Utility interface that provides higher-kinded types for this collection.
   */
  export interface Types extends RMap.Types {
    readonly normal: HashMap<this['_K'], this['_V']>;
    readonly nonEmpty: HashMap.NonEmpty<this['_K'], this['_V']>;
    readonly context: HashMap.Context<this['_K']>;
    readonly builder: HashMap.Builder<this['_K'], this['_V']>;
  }
}

const _defaultContext: HashMap.Context<any> = createHashMapContext();

export const HashMap: HashMapCreators = Object.freeze({
  ..._defaultContext,
  createContext: createHashMapContext,
  defaultContext<UK>(): HashMap.Context<UK> {
    return _defaultContext;
  },
});
