import { combineReducers } from 'redux';
import userReducer from './userReducer';
import commonReducer from './commonReducer';

const rootReducer = combineReducers({
    commonReducer,
    userReducer,
});

export default rootReducer;
