import {configureStore} from '@reduxjs/toolkit';
import userReducer from './action';

export const store = configureStore({
  reducer:{
    userState:userReducer
  }
});
