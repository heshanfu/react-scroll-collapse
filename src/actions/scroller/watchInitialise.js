import { WATCH_INITIALISE } from '../const';

const watchInitialise = (scrollerId, getScrollTop, getScrollerElem) => ({
  type: WATCH_INITIALISE,
  payload: {
    scrollerId,
    getScrollTop,
    getScrollerElem
  },
});

export default watchInitialise;
