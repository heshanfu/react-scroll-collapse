import { ADD_TO_EXPAND_QUEUE } from '../const';

const addToExpandQueue = itemId => ({
  type: ADD_TO_EXPAND_QUEUE,
  payload: {
    itemId,
  },
});

export default addToExpandQueue;
