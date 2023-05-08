import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  chatId: "null",
  user: {}
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.


export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setChatId: (state, action) => {
      console.log('state', state);
      console.log('action', action);
      state.chatId = action.payload;
    },

  },
});

export const currChatID = (state) => state.chatId;
export const { setChatId } = chatSlice.actions;

export default chatSlice.reducer;