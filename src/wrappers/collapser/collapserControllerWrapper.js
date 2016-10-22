import React, {PropTypes, Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {addCollapser} from '../../actions';

import selectors from '../../selectors';
const {nextCollapserIdSelector} = selectors.collapser;
const {ifNotFirstSec} = selectors.utils;


export const collapserControllerWrapper = (CollapserController) => {

  class WrappedCollapserController extends Component {

    static propTypes = {
      actions: PropTypes.object,
      nextCollapserId: PropTypes.number.isRequired,

      /*
        Pass the following props if you want to override the autogenerated
        ids.
      */
      collapserId: PropTypes.number,
      parentCollapserId: PropTypes.number,
      parentScrollerId: PropTypes.number,
    }

    /*
      The following relies on the react context api to pass component
      heirarchy information to children.
    */
    static childContextTypes = {
      parentCollapserId: React.PropTypes.number,
      parentScrollerId: React.PropTypes.number,
    }

    static contextTypes = {
      parentCollapserId: React.PropTypes.number,
      parentScrollerId: React.PropTypes.number,
    }

    getChildContext() {
      return {
        parentCollapserId: this.collapserId,
      };
    }

    componentWillMount() {
      const {collapserId, nextCollapserId, parentCollapserId, parentScrollerId} = this.props;

      /*
        If id vals supplied manually through props use those, else use
        auto-generated values.
      */
      this.collapserId = ifNotFirstSec(collapserId, nextCollapserId);
      this.parentCollapserId = ifNotFirstSec(parentCollapserId, this.context.parentCollapserId);
      this.parentScrollerId = ifNotFirstSec(parentScrollerId, this.context.parentScrollerId);

      /*
        create state slice for this collapser in redux store.
      */
      this.addCollapser();
    }

    addCollapser() {
      /*
        If you want to allow users to override other collapser attrs, do it
        by adding their props as attrs to the collapser object here.
      */
      const collapser = {id: this.collapserId};
      this.props.actions.addCollapser(this.parentScrollerId,
        this.parentCollapserId, collapser);
    }

    render() {
      /*
        Pulling these props out so they don't get passed on.  Ignore linting
        error.
      */
      const {actions, collapserId, nextCollapserId, parentCollapserId,
        parentScrollerId, ...other} = this.props;
      if (this.collapserId >= 0 && this.parentScrollerId >= 0) {
        return (
          <CollapserController
            {...other}
            collapserId={this.collapserId}
          />
        );
      }
      return <div />;
    }
  }

  const mapState = (state) => ({
    nextCollapserId: nextCollapserIdSelector(state),
  });

  const mapDispatch = (dispatch) => ({
    actions: bindActionCreators({
      addCollapser,
    }, dispatch),
  });

  return connect(mapState, mapDispatch)(WrappedCollapserController);
};
