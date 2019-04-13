import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions, itemWrapperActions } from '../../actions';

import selectors from '../../selectors';

const { allChildItemsSelector, areAllItemsExpandedSelector } = selectors.collapser;
const { itemVisibleSelector, itemQueuedSelector } = selectors.collapserItem;

const mergedActions = {
  addToExpandQueue: itemWrapperActions.addToExpandQueue,
  ...collapserWrapperActions,
};

export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    componentDidMount() {
      const { collapserId, watchInitCollapser } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);
    }

    shouldComponentUpdate(nextProps) {

      /*

      shouldComponentUpdate used to prevent unecessary renders caused
      by the allChildItemsSelector returning an array of item objects.  If any
      item changes one of it's properties a re-render is forced on every item
      in the collapser.

      Using the entire item object made the reducers cleaner - and using just
      an array of ids had a similar problem because the selectors were creating
      arrays with distinct object ids even when equivlent.

      */


      const { props } = this;

      return Object.keys(props).some(
        prop => (prop !== 'allChildItems' && props[prop] !== nextProps[prop])
      );

    }

    getOffSetTop = () => this.elem.current.offsetTop;

    expandCollapseAll = () => {
      const {
        addToExpandQueue,
        allChildItems,
        areAllItemsExpanded,
        collapserId,
        expandCollapseAll,
        itemVisible,
        parentScrollerId,
        setOffsetTop,
        watchCollapser,
      } = this.props;
      /*
        This activates a saga that will ensure that all the onHeightReady
        callbacks of nested <Collapse> elements have fired - before dispatching
        a HEIGHT_READY action.  Previously scroller would wait for this.
      */
      watchCollapser(collapserId);

      /*
        setOffsetTop: defines a callback for the saga to call that allows
        the saga to obtain the offsetTop value of the backing instance of this
        component and dispatch that to the redux store.
      */
      setOffsetTop(
        this.getOffSetTop,
        parentScrollerId,
        collapserId,
      );
      let delay = 0;

      allChildItems.forEach((item) => {
        if (!itemVisible(item.id)) {
          addToExpandQueue(item.id);
        }
        setTimeout(() => expandCollapseAll(item, areAllItemsExpanded, item.id), delay);
        delay += 200;
        // expandCollapseAll(item, areAllItemsExpanded, item.id);
      });
    };

    render() {
      const {
        expandCollapseAll,
        setOffsetTop,
        watchCollapser,
        watchInitCollapser,
        allChildItems,
        areAllItemsExpanded,
        ...other
      } = this.props;

      return (
        <WrappedComponentRef
          {...other}
          ref={this.elem}
          expandCollapseAll={this.expandCollapseAll}
          areAllItemsExpanded={areAllItemsExpanded}
        />
      );
    }
  }

  CollapserController.defaultProps = {
    collapserId: null,
    parentCollapserId: null,
  };

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: PropTypes.number.isRequired,

    /* provided by redux */
    addToExpandQueue: PropTypes.func.isRequired,
    areAllItemsExpanded: PropTypes.bool.isRequired, // includes item children of nested collapsers
    allChildItems: PropTypes.array.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    itemVisible: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => ({
    allChildItems: allChildItemsSelector(state)(ownProps.collapserId),
    areAllItemsExpanded: areAllItemsExpandedSelector(state)(ownProps.collapserId),
    itemVisible: itemVisibleSelector(state),
    itemQueued: itemQueuedSelector(state)
  });

  const CollapserControllerConnect = connect(
    mapStateToProps,
    mergedActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
