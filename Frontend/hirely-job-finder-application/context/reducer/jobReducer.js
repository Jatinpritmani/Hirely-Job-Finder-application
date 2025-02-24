import * as types from '../types/type'

const INITIAL_STATE = {
    loading: false,
    allJobList: null,
    searchedJobs: null,
    error: null,
    searchLoading: false,
    searchError: null
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_ALL_JOB_LIST_LOADING:
            return { ...state, loading: true, error: null };

        case types.GET_ALL_JOB_LIST_SUCCESS:

            return { ...state, loading: false, allJobList: action.payload };

        case types.GET_ALL_JOB_LIST_ERROR:
            return { ...state, loading: false, error: action.payload };

        case types.GET_ALL_SEARCH_JOB_LIST_LOADING:
            return { ...state, searchLoading: true, searchError: null };

        case types.GET_ALL_SEARCH_JOB_LIST_SUCCESS:

            return { ...state, searchLoading: false, searchedJobs: action.payload };

        case types.GET_ALL_SEARCH_JOB_LIST_ERROR:
            return { ...state, searchLoading: false, searchError: action.payload };
        case types.LOG_OUT:
            return {
                loading: false,
                allJobList: null,
                searchedJobs: null,
                error: null,
                searchLoading: false,
                searchError: null
            };
        default:
            return state;
    }
}

