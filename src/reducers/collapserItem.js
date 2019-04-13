import { combineReducers } from 'redux';

import {
  ADD_ITEM,
  EXPAND_COLLAPSE,
  EXPAND_COLLAPSE_ALL,
  HEIGHT_READY,
  REMOVE_ITEM,
  SET_VISIBLE,
  ADD_TO_EXPAND_QUEUE,
  REMOVE_FROM_EXPAND_QUEUE
} from '../actions/const';

import {
  checkAttr,
  addToState,
  removeFromState
} from './utils';

import selectors from '../selectors';

const {
  getItemId,
  getItemExpanded,
  getItemVisible,
} = selectors.collapserItem;

export const queuedReducer = (state = false, action) => {
  // const item = checkAttr(action, 'payload');
  switch (action.type) {
    case REMOVE_FROM_EXPAND_QUEUE:
      return false;
    case ADD_TO_EXPAND_QUEUE:
      return true;
    default:
      return state;
  }
};

export const visibleReducer = (state = false, action) => {
  const item = checkAttr(action, 'payload');
  switch (action.type) {
    case SET_VISIBLE:
      return getItemVisible(item);
    default:
      return state;
  }
};

export const expandedReducer = (state = true, action) => {
  const { areAllItemsExpanded, item } = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM: {
      const val = getItemExpanded(item);
      return val !== null ? val : state;
    }
    case EXPAND_COLLAPSE:
      return !state;
    case EXPAND_COLLAPSE_ALL: {
      if (getItemVisible(item)) {
        return !areAllItemsExpanded;
      }
      return state;
    }
    default:
      return state;
  }
};

// handles 'id' attr for item entities.
export const itemIdReducer = (state = null, action) => {
  const { item } = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
      return getItemId(item);
    default:
      return state;
  }
};

export const waitingForHeightReducer = (state = false, action) => {
  const { item, areAllItemsExpanded } = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
    case HEIGHT_READY:
      return false;
    case EXPAND_COLLAPSE:
      return true;
    case EXPAND_COLLAPSE_ALL:
      /*
        If the parent collapser is expanding, but this indivdual
        collapserItem is already expanded, then it is not waiting
        for the onHeightReady callback to fire - return false. Otherwise
        return true.
        note: !(!a && b) === a || !b;
      */
      return areAllItemsExpanded || !getItemExpanded(item);
    default:
      return state;
  }
};

// handle state for individual items.
const itemReducer = combineReducers({
  expanded: expandedReducer,
  id: itemIdReducer,
  queued: queuedReducer,
  visible: visibleReducer,
  waitingForHeight: waitingForHeightReducer,
});

// handles items state
export const itemsReducer = (state = {}, action) => {
  const { itemId } = checkAttr(action, 'payload');
  switch (action.type) {
    case REMOVE_ITEM:
      return removeFromState(state, itemId);
    case ADD_ITEM:
    case HEIGHT_READY:
    case EXPAND_COLLAPSE:
    case EXPAND_COLLAPSE_ALL:
    case SET_VISIBLE:
    case ADD_TO_EXPAND_QUEUE:
    case REMOVE_FROM_EXPAND_QUEUE:
      return addToState(state, action, itemId, itemReducer);
    default:
      return state;
  }
};
