import { LOG_OUT, SET_CURRENT_USER_TYPE, SET_FCM_TOKEN } from "../types/type";


const INITIAL_STATE = {
    current_user_type: '',
    fcm_token: ''
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_CURRENT_USER_TYPE:
            return {
                ...state,
                current_user_type: action.payload,
            };
        case SET_FCM_TOKEN:
            return {
                ...state,
                fcm_token: action.payload,
            };
        case LOG_OUT:
            return {
                current_user_type: ''
            }
        default:
            return state;
    }
}
