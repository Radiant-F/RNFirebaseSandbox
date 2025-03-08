import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {type UserType} from '../';
import {defaultPfp} from '../../../utils';

const dateISOString = new Date().toISOString();
export const defaultUser: UserType = {
  uid: '',
  displayName: '',
  email: '',
  anonymous: false,
  photoURL: defaultPfp,
  createdAt: dateISOString,
  updatedAt: dateISOString,
  contacts: {},
  fcmToken: '',
};

type StateType = {
  user: UserType;
};

const initialState: StateType = {
  user: defaultUser,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserType>) {
      state.user = action.payload;
    },
    clearCurrentUser(state) {
      state.user = defaultUser;
    },
  },
});

export const {setCurrentUser, clearCurrentUser} = authSlice.actions;

export default authSlice.reducer;
