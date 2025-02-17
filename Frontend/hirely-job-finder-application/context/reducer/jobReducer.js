import * as types from '../types/type'

const INITIAL_STATE = {
    loading: false,
    allJobList: null,
    error: null,
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_ALL_JOB_LIST_LOADING:
            return { ...state, loading: true, error: null };

        case types.GET_ALL_JOB_LIST_SUCCESS:

            return { ...state, loading: false, allJobList: action.payload };

        case types.GET_ALL_JOB_LIST_ERROR:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

