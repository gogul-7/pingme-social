import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
// import profileSlice from './slices/profileSlice';
// import postsSlice from './slices/postsSlice';
import followsSlice from "./slices/followsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    // profile: profileSlice,
    // posts: postsSlice,
    follows: followsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
