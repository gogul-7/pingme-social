import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Post {
  id: string;
  caption: string;
  user_id: string;
  image_url?: string;
  likes: number;
  tagged_users?: string[];
}

interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<{ posts: Post[] }>) => {
      state.isLoading = false;
      state.posts = action.payload.posts;
    },
    fetchPostsFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    addPost: (state, action: PayloadAction<{ post: Post }>) => {
      state.posts.push(action.payload.post);
    },
    editPost: (
      state,
      action: PayloadAction<{ id: string; updatedPost: Partial<Post> }>
    ) => {
      const { id, updatedPost } = action.payload;
      const index = state.posts.findIndex((post) => post.id === id);
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...updatedPost };
      }
    },
    deletePost: (state, action: PayloadAction<{ id: string }>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload.id);
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPost,
  editPost,
  deletePost,
} = postsSlice.actions;

export default postsSlice.reducer;
