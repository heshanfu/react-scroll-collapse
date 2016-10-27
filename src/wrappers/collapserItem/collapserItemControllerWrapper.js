import React, {PropTypes, Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {addItem, removeItem} from '../../actions';

import selectors from '../../selectors';
const {nextItemIdSelector} = selectors.collapserItem;
const {ifNotFirstSec} = selectors.utils;

/*
  collapserItemControllerWrapper is a HoC that is used to manage the dynamic generation of
  an itemId, and parentCollapserId the CollapserItemController uses to select it's state from
  redux.. and communicate with the sagas.

*/
export const collapserItemControllerWrapper = (CollapserItemController) => {

  class WrappedCollapserItemController extends Component {

    componentWillMount() {
      /*
        If parent supplied itemId / parentCollapserId props - else use values
        autogenerated from redux state.
      */
      /*
        Note that after the first render - the selected nextItemId
        will no longer match (it will be +1 the itemId of the last item
        generated in the first render.)  This is why we can only
        use it in willMount to set the id.
      */
      const {itemId, nextItemId, parentCollapserId, parentScrollerId} = this.props;
      this.itemId = ifNotFirstSec(itemId, nextItemId);
      this.parentCollapserId = ifNotFirstSec(parentCollapserId,
        this.context.parentCollapserId);
      this.parentScrollerId = ifNotFirstSec(parentScrollerId,
        this.context.parentScrollerId);
      /*
        create state slice for this collapserItem in redux store.
      */
      this.addItem();
    }

    componentWillUnmount() {
      this.props.actions.removeItem(this.parentCollapserId, this.itemId);
    }

    addItem() {
      /*
        If you want to allow users to override other collapserItem attrs, do it
        by adding their props as attrs to the item object here.

        isOpenedInit is a prop they can pass into their wrapped component.
        to set a default value for whether or not the item is expanded or not.
      */
      const item = {
        id: this.itemId,
        expanded: this.props.isOpenedInit,
      };
      this.props.actions.addItem(this.parentCollapserId, item);
    }

    render() {
      /*
        Pulling these props out so they don't get passed on.  Ignore linting
        error.
      */
      const {nextItemId, itemId, parentCollapserId, parentScrollerId, actions, isOpenedInit,
        ...otherProps} = this.props;
      if (this.itemId >= 0 && this.parentCollapserId >= 0) {
        return (
          <CollapserItemController
            {...otherProps}
            itemId={this.itemId}
            parentCollapserId={this.parentCollapserId}
            parentScrollerId={this.parentScrollerId}
          />
        );
      }
      return <div />;
    }
  }

  WrappedCollapserItemController.propTypes = {
    actions: PropTypes.object,
    /*
      isOpenedInit: overrides the default isOpened status.
    */
    isOpenedInit: PropTypes.bool,
     /*
      Pass itemId as prop if you want to overwrite automated id generated
      from state and passed automatically in nextItemId.
    */
    itemId: PropTypes.bool,
    nextItemId: PropTypes.number,
    /*
     Pass parentCollapserId as prop if you want to overwrite automated id generated
     from context.parentCollapserId.
   */
    parentCollapserId: PropTypes.number,
    parentScrollerId: PropTypes.number,
  };

  WrappedCollapserItemController.contextTypes = {
    parentCollapserId: React.PropTypes.number,
    parentScrollerId: React.PropTypes.number,
  };

  const mapState = (state) => ({
    nextItemId: nextItemIdSelector(state),
  });

  const mapDispatch = (dispatch) => ({
    actions: bindActionCreators({
      addItem,
      removeItem,
    }, dispatch),
  });

  return connect(mapState, mapDispatch)(WrappedCollapserItemController);
};
