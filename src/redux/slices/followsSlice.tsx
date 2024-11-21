import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FollowData {
  follower_id: string[];
  following_id: string[];
}

interface FollowState {
  data: FollowData;
}

const initialState: FollowState = {
  data: {
    follower_id: [],
    following_id: [],
  },
};

const followsSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    fetchFollow: (state, action: PayloadAction<{ data: FollowData }>) => {
      state.data = action.payload.data;
    },
    updateFollowing: (
      state,
      action: PayloadAction<{ following_id: string[] }>
    ) => {
      state.data.following_id = action.payload.following_id;
    },
  },
});

export const { fetchFollow, updateFollowing } = followsSlice.actions;
export default followsSlice.reducer;
