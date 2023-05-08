import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authapi from '../api/auth'
import * as userapi from '../api/user'

const initialState = {
    currentUser: null,
    status: 'idle',
    error: false,
};

export const signUpUser = createAsyncThunk(
    'users/signUpUser',
    async (newUser) => {
        try{
        const response = await authapi.createUser(newUser)
        return response.data
        } catch (error) {
            throw new Error(error);
        }
    }
)

export const logInUser = createAsyncThunk(
    'users/logInUser',
    async (curUser) => {
        try{
        const response = await authapi.logInUser(curUser)
        return response.data
        } catch (error) {
            throw new Error(error);
        }
    }
)

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (updatedUser) => {
        // console.log(updatedUser)
        const { _id , ...body } = updatedUser;
        const response = await userapi.updateUser(body, _id)
        return response.data
    }
)


export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId) => {
        await userapi.deleteUser(userId)
        return userId
    }
)

export const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.loading = 'idle';
            state.error = false;
        },
        refreshCurUser: (state, action) => {
            state.currentUser = action.payload;
            // console.log('dididi',action.payload)
            state.loading = 'idle';
            state.error = false;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(logInUser.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(logInUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Add any fetched posts to the array
                state.currentUser = action.payload
                // console.log(state.currentUser)
            })
            .addCase(logInUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.currentUser = action.payload
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'idle'
                const temp = state.currentUser
                state.currentUser = {...temp, ...action.payload}
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.currentUser = null
            })
    },
});

export const { logout, refreshCurUser } =
    userSlice.actions;

export const selectUserProfile = state => state.users.currentUser

export default userSlice.reducer;
