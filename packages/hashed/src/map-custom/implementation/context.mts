import { RMapBase } from '@rimbu/collection-types/map-custom';
import { Eq } from '@rimbu/common';
import { List } from '@rimbu/list';

import type { HashMap } from '#hashed/map';
import type { MapBlockBuilderEntry, MapEntrySet } from '#hashed/map-custom';

import { Hasher } from '../../common/index.mjs';
import {
  HashMapNonEmptyBase,
  HashMapEmpty,
  HashMapBlock,
  HashMapCollision,
  HashMapBlockBuilder,
} from '#hashed/map-custom';

export class HashMapContext<UK>
  extends RMapBase.ContextBase<UK, HashMap.Types>
  implements HashMap.Context<UK>
{
  readonly blockCapacity: number;
  readonly blockMask: number;
  readonly maxDepth: number;

  readonly _empty: HashMap<any, any>;
  readonly _emptyBlock: HashMapBlock<any, any>;

  constructor(
    readonly hasher: Hasher<UK>,
    readonly eq: Eq<UK>,
    readonly blockSizeBits: number,
    readonly listContext: List.Context
  ) {
    super();

    this.blockCapacity = 1 << blockSizeBits;
    this.blockMask = this.blockCapacity - 1;
    this.maxDepth = Math.ceil(32 / blockSizeBits);

    this._empty = Object.freeze(new HashMapEmpty<any, any>(this));
    this._emptyBlock = Object.freeze(new HashMapBlock(this, null, null, 0, 0));
  }

  readonly typeTag = 'HashMap';

  hash(value: UK): number {
    return this.hasher.hash(value);
  }

  getKeyIndex(level: number, hash: number): number {
    const shift = this.blockSizeBits * level;
    return (hash >>> shift) & this.blockMask;
  }

  isNonEmptyInstance(source: any): source is any {
    return source instanceof HashMapNonEmptyBase;
  }

  readonly builder = <K extends UK, V>(): HashMap.Builder<K, V> => {
    return new HashMapBlockBuilder<K, V>(this as any);
  };

  createBuilder<K extends UK, V>(
    source?: HashMap.NonEmpty<K, V>
  ): HashMap.Builder<K, V> {
    return new HashMapBlockBuilder<K, V>(
      this as any,
      source as HashMapBlock<K, V> | undefined
    );
  }

  isValidKey(key: unknown): key is UK {
    return this.hasher.isValid(key);
  }

  emptyBlock<V>(): HashMapBlock<UK, V> {
    return this._emptyBlock;
  }

  block<V>(
    entries: (readonly [UK, V])[] | null,
    entrySets: MapEntrySet<UK, V>[] | null,
    size: number,
    level: number
  ): HashMapBlock<UK, V> {
    return new HashMapBlock(this, entries, entrySets, size, level);
  }

  collision<V>(
    entries: List.NonEmpty<readonly [UK, V]>
  ): HashMapCollision<UK, V> {
    return new HashMapCollision(this, entries);
  }

  isHashMapBlock<K, V>(obj: MapEntrySet<K, V>): obj is HashMapBlock<K, V> {
    return obj instanceof HashMapBlock;
  }

  isHashMapBlockBuilder<K, V>(
    obj: MapBlockBuilderEntry<K, V>
  ): obj is HashMapBlockBuilder<K, V> {
    return obj instanceof HashMapBlockBuilder;
  }
}

export function createHashMapContext<UK>(options?: {
  hasher?: Hasher<UK>;
  eq?: Eq<UK>;
  blockSizeBits?: number;
  listContext?: List.Context;
}): HashMap.Context<UK> {
  return Object.freeze(
    new HashMapContext(
      options?.hasher ?? Hasher.defaultHasher(),
      options?.eq ?? Eq.defaultEq(),
      options?.blockSizeBits ?? 5,
      options?.listContext ?? List.defaultContext()
    )
  );
}
