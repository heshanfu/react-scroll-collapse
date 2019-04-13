import doEachForNumber from './doEachForNumber';


// from https://stackoverflow.com/a/7557433
export const isElementInViewport = (el) => { //eslint-disable-line
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const calcRatio = (thresholds, numSteps) => (i) => {
  const ratio = i / numSteps;
  thresholds.push(ratio);
};

const buildThresholdList = () => {
  const thresholds = [];
  const numSteps = 1;
  doEachForNumber(numSteps, calcRatio(thresholds, numSteps));
  thresholds.push(0);
  return thresholds;
};

const defaultObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: buildThresholdList()
};

const getObserverOptions = options => ({
  ...defaultObserverOptions,
  options,
});

export const createObserver = (
  handleIntersect = (entries, observer) => console.log('handler fired: entries, observer', entries, observer),
  options,
) => {
  const observer = new IntersectionObserver(handleIntersect, getObserverOptions(options));
  return observer;
};

export const observerManager = (() => {
  const that = {};
  that.observerList = {};
  const obj = {};

  obj.initObserver = (id, options, handleIntersect) => {
    if (that.observerList[id]) {
      return that.observer[id];
    }
    that.observerList[id] = {
      collapserItems: {},
      observer: new IntersectionObserver(handleIntersect, getObserverOptions(options)),
      root: options.root,
    };
    return that.observerList[id];
  };
  obj.getObserverList = () => that.observerList;
  obj.getObserver = id => that.observerList[id];
  return obj;

})();
