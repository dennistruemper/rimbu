import type { RMap } from '../../../collection-types/mod.ts';
import type { HashMap } from '../../../hashed/mod.ts';
import type { SortedMap } from '../../../sorted/mod.ts';

import type { HashMultiSet, MultiSet, SortedMultiSet } from '../../../multiset/main/index.ts';
import type { MultiSetBase } from '../../../multiset/custom/index.ts';

export interface MultiSetCreators {
  /**
   * Returns a new MultiSet context instance based on the given `options`.
   * @typeparam UT - the upper element type for which the context can create instances
   * @param options - an object containing the following properties:<br/>
   * - countMapContext - the map context to use for key to count mapping
   */
  createContext<UT>(options: {
    countMapContext: RMap.Context<UT>;
  }): MultiSet.Context<UT>;
}

export interface HashMultiSetCreators
  extends MultiSetBase.Factory<HashMultiSet.Types> {
  /**
   * Returns a new HashMultiSet context instance based on the given `options`.
   * @typeparam UT - the upper element type for which the context can create instances
   * @param options - (optional) an object containing the following properties:<br/>
   * - countMapContext - (optional) the map context to use for key to count mapping
   */
  createContext<UT>(options?: {
    countMapContext?: HashMap.Context<UT>;
  }): HashMultiSet.Context<UT>;
  /**
   * Returns the default context for HashMultiSet.
   * @typeparam UT - the upper element type for which the context can create instances
   */
  defaultContext<UT>(): HashMultiSet.Context<UT>;
}

export interface SortedMultiSetCreators
  extends MultiSetBase.Factory<SortedMultiSet.Types> {
  /**
   * Returns a new HashMultiSet context instance based on the given `options`.
   * @typeparam UT - the upper element type for which the context can create instances
   * @param options - (optional) an object containing the following properties:<br/>
   * - countMapContext - (optional) the map context to use for key to count mapping
   */
  createContext<UT>(options?: {
    countMapContext?: SortedMap.Context<UT>;
  }): SortedMultiSet.Context<UT>;
  /**
   * Returns the default context for HashMultiSet.
   * @typeparam UT - the upper element type for which the context can create instances
   */
  defaultContext<UT>(): SortedMultiSet.Context<UT>;
}
