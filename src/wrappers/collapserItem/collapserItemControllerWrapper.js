import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ofBoolTypeOrNothing, ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';

import actions from '../../actions';
import selectors from '../../selectors';

const { nextItemIdSelector } = selectors.collapserItem;
const { ifNotFirstSec } = selectors.utils;

/*
  collapserItemControllerWrapper is a HoC that is used to manage the dynamic generation of
  an itemId, and parentCollapserId the CollapserItemController uses to select it's state from
  redux.. and communicate with the sagas.

*/
export const collapserItemControllerWrapper = (CollapserItemController) => {

  class WrappedCollapserItemController extends Component {

    constructor(props, context) {
      super(props, context);
      console.log('WrappedCollapserItemController: constructor(props, context', props, context);

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
      const { itemId, parentCollapserId, parentScrollerId } = this.props;

      const {
        parentCollapserId: parentCollapserIdContext,
        parentScrollerId: parentScrollerIdContext,
      } = this.context;

      this.itemId = ifNotFirstSec(itemId, nextItemIdSelector());
      this.parentCollapserId = ifNotFirstSec(parentCollapserId, parentCollapserIdContext);
      this.parentScrollerId = ifNotFirstSec(parentScrollerId, parentScrollerIdContext);
      /*
        create state slice for this collapserItem in redux store.
      */
      this.addItem();
    }

    componentWillUnmount() {
      const { removeItem } = this.props;
      removeItem(this.parentCollapserId, this.itemId);
    }

    addItem() {
      /*
        If you want to allow users to override other collapserItem attrs, do it
        by adding their props as attrs to the item object here.

        isOpenedInit is a prop they can pass into their wrapped component.
        to set a default value for whether or not the item is expanded or not.
      */
      const { addItem, isOpenedInit } = this.props;
      const item = {
        id: this.itemId,
        expanded: isOpenedInit,
      };
      addItem(this.parentCollapserId, item, this.itemId);
    }

    render() {
      /*
        Pulling these props out so they don't get passed on.  Ignore linting
        error.
      */
      const {
        addItem,
        removeItem,
        itemId,
        parentCollapserId,
        parentScrollerId,
        isOpenedInit,
        ...rest
      } = this.props;
      if (this.itemId >= 0 && this.parentCollapserId >= 0) {
        return (
          <CollapserItemController
            {...rest}
            itemId={this.itemId}
            parentCollapserId={this.parentCollapserId}
            parentScrollerId={this.parentScrollerId}
          />
        );
      }
      return <div />;
    }
  }

  WrappedCollapserItemController.defaultProps = {
    isOpenedInit: null,
    itemId: null,
    parentCollapserId: null,
    parentScrollerId: null,
  };

  WrappedCollapserItemController.propTypes = {
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,

    /*
      isOpenedInit: overrides the default isOpened status.
    */
    isOpenedInit: ofBoolTypeOrNothing,
    /*
      Pass itemId as prop if you want to overwrite automated id generated
      from state and passed automatically in nextItemId.
    */
    itemId: ofBoolTypeOrNothing,

    /*
     Pass parentCollapserId as prop if you want to overwrite automated id generated
     from context.parentCollapserId.
   */
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: ofNumberTypeOrNothing,
  };

  WrappedCollapserItemController.contextTypes = {
    parentCollapserId: PropTypes.number,
    parentScrollerId: PropTypes.number,
  };

  const mapDispatchToProps = {
    addItem: actions.addItem,
    removeItem: actions.removeItem,
  };

  return connect(undefined, mapDispatchToProps)(WrappedCollapserItemController);
};

export default collapserItemControllerWrapper;
