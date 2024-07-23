import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  value: {
    email: string | null;
    photos: string[];
  };
};

const initialState: UserState = {
  value: { email: null, photos: [] },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateEmail: (state, action: PayloadAction<string>) => {
      state.value.email = action.payload;
    },
    addPhoto: (state, action: PayloadAction<string>) => {
      state.value.photos.push(action.payload);
    },
    removePhoto: (state, action: PayloadAction<string>) => {
      state.value.photos = state.value.photos.filter((data) => data !== action.payload);
    },
    removeAll: (state, action : PayloadAction<string>) => {
      state.value.photos = [];
    }
  },
});

export const { updateEmail, addPhoto, removePhoto, removeAll} = userSlice.actions;
export default userSlice.reducer;
