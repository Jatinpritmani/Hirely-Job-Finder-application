import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducer';


export const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};
// const store = createStore(rootReducer, applyMiddleware(thunk));
// Connect our store to the reducers
export const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
