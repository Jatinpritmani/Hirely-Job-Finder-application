import { SET_CURRENT_USER_DETAIL } from "../types/type";
import { store } from '../store';
import * as types from '../types/type'
import apiRequest from "../../components/api";
import { USER_DETAIL } from "../../components/apiConstants";
import { setCurrentUserType } from "./commonActioin";



export const getUserDetail = userId => {
    return async dispatch => {
        dispatch({
            type: types.GET_USER_DETAIL_LOADING,
        });
        let data = {
            "user_id": userId
        }
        try {
            let response = await apiRequest("POST", USER_DETAIL, data);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                dispatch(({
                    type: types.GET_USER_DETAIL_SUCCESS,
                    payload: response?.data
                }))
                dispatch(setCurrentUserType(response?.data?.user_type))

            }
            else {
                dispatch(({
                    type: types.GET_USER_DETAIL_ERROR,
                    payload: response
                }))
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            dispatch(({
                type: types.GET_USER_DETAIL_ERROR,
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


