
import * as types from '../types/type'

const INITIAL_STATE = {
  loading: false,
  currentUserDetail: null,
  error: null,
  isUserLoggedIn: false,
  recruiterDetails: null,
  loadingRecruiterDetai: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_USER_DETAIL_LOADING:
      return { ...state, loading: true, error: null };

    case types.GET_USER_DETAIL_SUCCESS:

      return { ...state, loading: false, currentUserDetail: action.payload, isUserLoggedIn: true };

    case types.GET_USER_DETAIL_ERROR:
      return { ...state, loading: false, error: action.payload };
    case types.GET_RECRUITER_DETAIL_LOADING:
      return { ...state, loadingRecruiterDetai: true, error: null };

    case types.GET_RECRUITER_DETAIL_SUCCESS:
      return { ...state, loadingRecruiterDetai: false, recruiterDetails: action.payload };

    case types.GET_RECRUITER_DETAIL_ERROR:
      return { ...state, loadingRecruiterDetai: false, error: action.payload };
    case types.LOG_OUT:
      return {
        loading: false,
        currentUserDetail: null,
        error: null,
        isUserLoggedIn: false,
        loadingRecruiterDetai: false
      };
    default:
      return state;
  }
}

