import {createSlice} from '@reduxjs/toolkit';

type ThemeType = {
  mode: 'light' | 'dark';
  colors: {
    light: {
      text: string;
      background: string;
      modal: string;
    };
    dark: {
      text: string;
      background: string;
      modal: string;
    };
  };
};

const initialState: ThemeType = {
  mode: 'light',
  colors: {
    light: {
      text: 'black',
      background: 'white',
      modal: 'white',
    },
    dark: {
      text: 'white',
      background: 'black',
      modal: 'grey',
    },
  },
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleThemeMode(state) {
      state.mode = state.mode == 'light' ? 'dark' : 'light';
    },
  },
});

export const {toggleThemeMode} = themeSlice.actions;

export default themeSlice.reducer;
