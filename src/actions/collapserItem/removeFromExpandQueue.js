import { REMOVE_FROM_EXPAND_QUEUE } from '../const';

const removeFromExpandQueue = itemId => ({
  type: REMOVE_FROM_EXPAND_QUEUE,
  payload: {
    itemId,
  },
});

export default removeFromExpandQueue;
