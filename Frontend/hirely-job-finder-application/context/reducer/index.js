import { combineReducers } from 'redux';
import userReducer from './userReducer';
import commonReducer from './commonReducer';
import jobReducer from './jobReducer'

const rootReducer = combineReducers({
    commonReducer,
    userReducer,
    jobReducer
});

export default rootReducer;
