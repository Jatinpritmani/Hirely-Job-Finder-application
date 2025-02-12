import { SET_CURRENT_USER_TYPE } from '../types/type';

export const setCurrentUserType = userType => {
    return dispatch => {
        dispatch({
            type: SET_CURRENT_USER_TYPE,
            payload: userType,
        });
    };
};
