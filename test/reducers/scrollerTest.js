import expect from 'expect';
import * as reducers from '../../src/reducers/scroller';
import * as types from '../../src/actions/const';


const scrollerCollapsersIdArrayReducerAddCollapser = () => {
  const stateBefore = [0];
  const stateAfter = [0, 1];
  const action = {
    type: types.ADD_COLLAPSER,
    payload: {
      collapser: {
        id: 1,
      },
    },
  };
  Object.freeze(stateBefore);
  Object.freeze(action);
  expect(
    reducers.scrollerCollapsersIdArrayReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const scrollerIdReducerAddScroller = () => {
  const stateBefore = null;
  const stateAfter = 0;
  const action = {
    type: types.ADD_SCROLLER,
    payload: {
      scroller: {
        id: 0,
      },
    },
  };
  Object.freeze(action);
  expect(
    reducers.scrollerIdReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const offsetTopReducer = () => {
  const stateBefore = 0;
  const stateAfter = 500;
  const action = {
    type: types.SCROLL_TO,
    payload: {
      offsetTop: 500,
    },
  };
  Object.freeze(action);
  expect(
    reducers.offsetTopReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const scrollTopReducer = () => {
  const stateBefore = 0;
  const stateAfter = 500;
  const action = {
    type: types.SCROLL_TO,
    payload: {
      scrollTop: 500,
    },
  };
  Object.freeze(action);
  expect(
    reducers.scrollTopReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const scrollersReducerAddScroller = () => {
  const stateBefore = {};
  const stateAfter = {
    0: {
      offsetTop: 0,
      scrollTop: 0,
      id: 0,
      collapsers: [],
    },
  };
  const action = {
    type: types.ADD_SCROLLER,
    payload: {
      scroller: {
        id: 0,
      },
    },
  };
  Object.freeze(stateBefore);
  Object.freeze(action);
  expect(
    reducers.scrollersReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const scrollersReducerAddCollapser = () => {
  const stateBefore = {
    0: {
      offsetTop: 0,
      scrollTop: 0,
      id: 0,
      collapsers: [],
    },
  };
  const stateAfter = {
    0: {
      offsetTop: 0,
      scrollTop: 0,
      id: 0,
      collapsers: [0],
    },
  };
  const stateAfterSecond = {
    0: {
      offsetTop: 0,
      scrollTop: 0,
      id: 0,
      collapsers: [],
    },
  };
  const action = {
    type: types.ADD_COLLAPSER,
    payload: {
      collapser: {
        id: 0,
      },
      scrollerId: 0,
    },
  };
  const actionSecond = {
    type: types.ADD_COLLAPSER,
    payload: {
      collapser: {
        id: 1,
      },
      collapserId: 0,
    },
  };
  Object.freeze(stateBefore);
  Object.freeze(action);
  Object.freeze(actionSecond);
  expect(
    reducers.scrollersReducer(stateBefore, action)
  ).toEqual(stateAfter);
  expect(
    reducers.scrollersReducer(stateBefore, actionSecond)
  ).toEqual(stateAfterSecond);
};

const scrollersAddScroller = () => {
  const stateBefore = [];
  const stateAfter = [0];
  const stateAfterSecond = [0, 1];
  const action = {
    type: types.ADD_SCROLLER,
  };
  Object.freeze(stateBefore);
  Object.freeze(stateAfter);
  Object.freeze(action);
  expect(
    reducers.scrollers(stateBefore, action)
  ).toEqual(stateAfter);
  expect(
    reducers.scrollers(stateAfter, action)
  ).toEqual(stateAfterSecond);
};

describe('react-scroll-collapse', () => {
  describe('reducers', () => {
    describe('scroller', () => {

      describe('function: scrollerCollapsersIdArray', () => {
        describe('type: ADD_COLLAPSER', () => {
          it('adds the collapser id', () => {
            scrollerCollapsersIdArrayReducerAddCollapser();
          });
        });
      });

      describe('function: scrollerIdReducer', () => {
        describe('type: ADD_SCROLLER', () => {
          it('returns the scrollerId', () => {
            scrollerIdReducerAddScroller();
          });
        });
      });

      describe('function: offsetTop', () => {
        describe('type: SCROLL_TO', () => {
          it('sets offsetTop to 500', () => {
            offsetTopReducer();
          });
        });
      });

      describe('function: scrollTop', () => {
        describe('type: SCROLL_TO', () => {
          it('sets scrollTop to 500', () => {
            scrollTopReducer();
          });
        });
      });

      describe('function: scrollersReducer', () => {
        describe('type: ADD_SCROLLER', () => {
          it('adds the scroller object to state under id', () => {
            scrollersReducerAddScroller();
          });
        });
        describe('type: ADD_COLLAPSER', () => {
          it('adds the collapser as a child if scroller id provided', () => {
            scrollersReducerAddCollapser();
          });
        });
      });

      describe('function: scrollers', () => {
        describe('type: ADD_SCROLLER', () => {
          it('adds next id to arr', () => {
            scrollersAddScroller();
          });
        });
      });

    });
  });
});