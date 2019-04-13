import { SET_VISIBLE } from '../const';

const setVisible = (visible, itemId) => ({
  type: SET_VISIBLE,
  payload: {
    itemId,
    visible
  },
});

export default setVisible;
