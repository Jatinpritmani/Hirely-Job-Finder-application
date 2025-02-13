import { SET_CURRENT_USER_DETAIL } from "../types/type";
import * as types from '../types/type'

const INITIAL_STATE = {
  loading: false,
  currentUserDetail: null,
  error: null,
  isUserLoggedIn: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_USER_DETAIL_LOADING:
      return { ...state, loading: true, error: null };

    case types.GET_USER_DETAIL_SUCCESS:
      return { ...state, loading: false, currentUserDetail: action.payload, isUserLoggedIn: true };

    case types.GET_USER_DETAIL_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

