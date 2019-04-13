import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { observerManager } from '../../utils/DOMutils';

import { itemWrapperActions } from '../../actions';
import selectors from '../../selectors';

const { itemExpandedSelector, itemVisibleSelector, itemQueuedSelector } = selectors.collapserItem;


/*
  collapserItemWrapper is an HoC that is to be used to wrap components which make use
  of react-collapse components.

  It provides the wrapped component with the props:
    isOpened: boolean - which can be used as the <Collapse> isOpened prop.
    onHeightReady: function - which should be passed into the  <Collapse>
      onHeightReady prop.
    expandCollapse: function - which can be used as an event callback to trigger
      change of state.
*/


export const collapserItemWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserItemRef');

  class CollapserItemController extends Component {

    elem = React.createRef();

    componentDidMount() {
      const { itemId } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserItemRef');
      // console.log('itemWrapper observer', observerManager);
      const observerList = observerManager.getObserverList();
      console.log('itemId: observerList', itemId, observerList);
      this.elem.current.dataset.itemId = itemId;
      setTimeout(this.setObserver, 500);
      // this.observer = createObserver(this.elem.current, this.setVisible);
    }

    componentWillUnmount() {
      this.observer.observer.unobserve(this.elem.current);
    }

    setObserver = () => {
      const { parentScrollerId, itemId } = this.props;
      this.observer = observerManager.getObserver(parentScrollerId);
      this.observer.collapserItems[itemId] = {
        setVisible: this.setVisible
      };
      this.observer.observer.observe(this.elem.current);
    }

    setVisible = (isIntersecting) => {
      const {
        itemId,
        setVisible: setVisibileAction,
        queued,
        removeFromExpandQueue
      } = this.props;
      console.log('itemId, isVisible', itemId, isIntersecting);
      // setTimeout(() => setVisibileAction(isIntersecting, itemId), 100);
      setVisibileAction(isIntersecting, itemId);
      if (queued && isIntersecting) {
        setTimeout(() => {
          this.expandCollapse(false);
          removeFromExpandQueue(itemId);
        }, 0);
        // this.expandCollapse();
        // removeFromExpandQueue(itemId);
      }
    }

    /*
      this.setOffsetTop: defines a callback for the saga to call that allows
        the saga to obtain the offsetTop value of the backing instance of this
        component and dispatch that to the redux store.  The saga grabs the
        offsetTop val once the onHeightReady callback has been
        called for every wrapped <Collapse> element in the Collapser.
    */
    expandCollapse = (scroll = true) => {
      const {
        itemId,
        expandCollapse: expandCollapseAction,
        parentScrollerId,
        parentCollapserId,
        setOffsetTop,
        // setVisible,
        watchCollapser,
      } = this.props;
      watchCollapser(parentCollapserId);
      if (scroll) {
        setOffsetTop(
          () => this.elem.current.offsetTop,
          parentScrollerId,
          parentCollapserId,
        );
      }
      expandCollapseAction(itemId);
    };

    onHeightReady = () => {
      const { itemId, heightReady, parentCollapserId } = this.props;
      heightReady(parentCollapserId, itemId);
    };


    render() {
      const {
        isOpened,
        heightReady,
        expandCollapse,
        setOffsetTop,
        watchCollapser,
        ...other
      } = this.props;
      return (
        <WrappedComponentRef
          {...other}
          isOpened={isOpened}
          expandCollapse={this.expandCollapse}
          onHeightReady={this.onHeightReady}
          ref={this.elem}
        />
      );
    }
  }

  CollapserItemController.defaultProps = {
    expandWhenVisible: true,
  };

  CollapserItemController.propTypes = {
    addToExpandQueue: PropTypes.func.isRequired,
    removeFromExpandQueue: PropTypes.func.isRequired,
    expandWhenVisible: PropTypes.bool,
    isOpened: PropTypes.bool.isRequired,
    itemId: PropTypes.number.isRequired,
    parentCollapserId: PropTypes.number.isRequired,
    parentScrollerId: PropTypes.number.isRequired,
    heightReady: PropTypes.func.isRequired,
    expandCollapse: PropTypes.func.isRequired,
    queued: PropTypes.bool.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    setVisible: PropTypes.func.isRequired,
    // visible: PropTypes.bool.isRequired,
    watchCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => ({
    isOpened: itemExpandedSelector(state)(ownProps.itemId),
    queued: itemQueuedSelector(state)(ownProps.itemId),
    // visible: itemVisibleSelector(state)(ownProps.itemId)
  });

  const CollapserItemControllerConnect = connect(
    mapStateToProps,
    itemWrapperActions,
  )(CollapserItemController);

  return CollapserItemControllerConnect;
};

export default collapserItemWrapper;
