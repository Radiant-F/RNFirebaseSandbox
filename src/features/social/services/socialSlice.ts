import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type Props = {
  viewablePostIndex: number | null;
};

const initialState: Props = {
  viewablePostIndex: null,
};

export const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setViewablePostIndex(
      state,
      action: PayloadAction<Props['viewablePostIndex']>,
    ) {
      state.viewablePostIndex = action.payload;
    },
  },
});

export const {setViewablePostIndex} = socialSlice.actions;

export default socialSlice.reducer;
