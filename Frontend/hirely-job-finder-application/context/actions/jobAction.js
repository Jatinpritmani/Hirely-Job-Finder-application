
import * as types from '../types/type'
import apiRequest from "../../components/api";
import { GET_ALL_JOBS } from "../../components/apiConstants";



export const getAllJobList = userId => {
    return async dispatch => {
        dispatch({
            type: types.GET_ALL_JOB_LIST_LOADING,
        });
        let data = {
            "user_id": userId
        }
        try {
            let response = await apiRequest("POST", GET_ALL_JOBS, data);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                let jobDetails = response?.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                dispatch(({
                    type: types.GET_ALL_JOB_LIST_SUCCESS,
                    payload: jobDetails
                }))

            }
            else {
                dispatch(({
                    type: types.GET_ALL_JOB_LIST_ERROR,
                    payload: response
                }))
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            dispatch(({
                type: types.GET_ALL_JOB_LIST_ERROR,
                payload: error
            }))
        }
    };
};

export const getAllJobListSearch = data => {
    return async dispatch => {
        dispatch({
            type: types.GET_ALL_SEARCH_JOB_LIST_LOADING,
        });
        try {
            let response = await apiRequest("POST", GET_ALL_JOBS, data);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                dispatch(({
                    type: types.GET_ALL_SEARCH_JOB_LIST_SUCCESS,
                    payload: response?.data
                }))

            }
            else {
                dispatch(({
                    type: types.GET_ALL_SEARCH_JOB_LIST_ERROR,
                    payload: response
                }))
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            dispatch(({
                type: types.GET_ALL_SEARCH_JOB_LIST_ERROR,
                payload: error
            }))
        }
    };
};

export const doLogout = () => {
    return dispatch => {
        dispatch(({
            type: types.LOG_OUT,
        }))
    }
}


