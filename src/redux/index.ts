import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authentication/services/authSlice';
import chatReducer from '../features/chat/services/chatSlice';
import socialReducer from '../features/social/services/socialSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    social: socialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
