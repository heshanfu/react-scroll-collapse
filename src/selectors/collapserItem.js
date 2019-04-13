import { createSelector } from 'reselect';
import {
  selector,
  entitiesSelector,
  getNextIdFactory,
  createObjAttrSelector
} from './utils';

export const getItems = entities => selector(entities, 'items');

export const getItemExpanded = item => selector(item, 'expanded', true); // TODO: make default configureable

export const getItemId = item => selector(item, 'id');

export const getItemWaitingForHeight = item => selector(item, 'waitingForHeight');

export const getItemVisible = item => selector(item, 'visible');

export const getItemQueued = item => selector(item, 'queued');

export const selectItemFunc = items => itemId => selector(items, itemId);

export const selectItemExpandedFunc = innerSelectItemFunc => (itemId) => {
  const item = innerSelectItemFunc(itemId);
  return getItemExpanded(item);
};


export const selectItemWaitingForHeightFunc = innerSelectItemFunc => (itemId) => {
  const item = innerSelectItemFunc(itemId);
  return getItemWaitingForHeight(item);
};

export const itemsSelector = createSelector(entitiesSelector, getItems);

export const nextItemIdSelector = getNextIdFactory();

export const itemSelector = createSelector(itemsSelector, selectItemFunc);

export const itemExpandedSelector = createSelector(itemSelector, selectItemExpandedFunc);

export const itemWaitingForHeightSelector = createSelector(
  itemSelector, selectItemWaitingForHeightFunc
);

export const itemVisibleSelector = createObjAttrSelector('visible', itemSelector);

export const itemQueuedSelector = createObjAttrSelector('queued', itemSelector);

/*
export const createObjAttrSelector = (key, objSelector) => {
  const getter = item => selector(item, key);
  const attrSelector = selectorFunc => id => getter(selectorFunc(id));
  return createSelector(objSelector, attrSelector);
};
*/
