import { DimItem } from 'app/inventory/item-types';
import { RootState } from 'app/store/types';
import { emptyArray } from 'app/utils/empty';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { getInventoryWishListRolls, InventoryWishListRolls } from './wishlists';

export const wishListsSelector = (state: RootState) => state.wishLists;

export const wishListsLastFetchedSelector = (state: RootState) =>
  wishListsSelector(state).lastFetched;

export const wishListsByHashSelector = createSelector(wishListsSelector, (wls) =>
  _.groupBy(wls.wishListAndInfo.wishListRolls?.filter(Boolean), (r) => r.itemHash)
);

export const wishListRollsForItemHashSelector = (itemHash: number) => (state: RootState) =>
  wishListsByHashSelector(state)[itemHash] ?? emptyArray();

export const hasWishListSelector = createSelector(
  wishListsByHashSelector,
  (wishlists) => !_.isEmpty(wishlists)
);

/** Returns a memoized function to look up wishlist by item, which is reset when the wishlist changes. Prefer wishListSelector */
export const wishListFunctionSelector = createSelector(
  wishListsByHashSelector,
  (wishlists): ((item: DimItem) => InventoryWishListRolls | undefined) => {
    // Cache of inventory item id to roll. For this to work, make sure vendor/collections rolls have unique ids.
    const cache = new Map<string, InventoryWishListRolls | undefined>();
    return (item: DimItem) => {
      if (!($featureFlags.wishLists && wishlists && item.wishListEnabled)) {
        return undefined;
      }
      if (cache.has(item.id)) {
        return cache.get(item.id);
      }
      const rolls = getInventoryWishListRolls(item, wishlists);
      cache.set(item.id, rolls);
      return rolls;
    };
  }
);

/**
 * A reverse-curried selector that is easier to use in useSelector. This will re-render the component only when
 * this item's wishlist state changes.
 *
 * @example
 *
 * useSelector(wishListSelector(item))
 */
export const wishListSelector = (item: DimItem) => (state: RootState) =>
  wishListFunctionSelector(state)(item);
