import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/post'

const initialState = {
  postslist: [],
  curPosts: null,
  userPosts: [],
  status: 'idle',
  error: null
};

export const fetchRandomPosts = createAsyncThunk(
    'posts/fetchRandomPosts',
    async () => {
        const response = await api.fetchRandomPosts()
        return response.data
    }
)

export const fetchUserPosts = createAsyncThunk(
    'posts/fetchPostById',
    async () => {
        const response = await api.fetchMyOwnedPosts()
        return response.data
    }
)

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    async (initialPost) => {
        const response = await api.createPost(initialPost)
        return response.data
    }
)

export const deleteMyPost = createAsyncThunk(
    'posts/deleteMyPost',
    async (postId) => {
        await api.deletePost(postId)
        return postId
    }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: (state, action) => {
        state.postslist.push(action.payload)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRandomPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchRandomPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.postslist = action.payload
      })
      .addCase(fetchRandomPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        console.log('after fetchRandomPosts failure', state.error)
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.userPosts = action.payload
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.status = 'idle'
        state.postslist.push(action.payload)
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        console.log('after addNewPost failure', state.error)
      })
      .addCase(deleteMyPost.fulfilled, (state, action) => {
        state.status = 'idle'
        state.userPosts = state.userPosts.filter(post => post._id !== action.payload)
      })
      .addCase(deleteMyPost.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        console.log('after deleteMyPost failure', state.error)
      })
  },
});

// export const { groupAdded } = groupsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.postslist

export const selectUserPosts = state => state.posts.userPosts

export const selectPostById = (state, postId) => state.posts.postslist.find(post => post._id === postId)
