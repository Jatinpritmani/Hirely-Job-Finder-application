import { SET_CURRENT_USER_TYPE, SET_FCM_TOKEN } from '../types/type';

export const setCurrentUserType = userType => {
    return dispatch => {
        dispatch({
            type: SET_CURRENT_USER_TYPE,
            payload: userType,
        });
    };
};

export const setFcmTOken = token => {
    return dispatch => {
        dispatch({
            type: SET_FCM_TOKEN,
            payload: token,
        });
    };
};