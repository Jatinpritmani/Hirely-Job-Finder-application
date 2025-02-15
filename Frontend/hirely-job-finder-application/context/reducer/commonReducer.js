import { LOG_OUT, SET_CURRENT_USER_TYPE } from "../types/type";


const INITIAL_STATE = {
    current_user_type: '',
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_CURRENT_USER_TYPE:
            return {
                ...state,
                current_user_type: action.payload,
            };
        case LOG_OUT:
            return {
                current_user_type: ''
            }
        default:
            return state;
    }
}
