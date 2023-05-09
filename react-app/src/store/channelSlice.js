import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/channel";

const initialState = {
  channelList: [],
  status: "idle",
  error: null,
};

export const addNewChannel = createAsyncThunk(
  "channels/addNewChannel",
  async (initialGroup) => {
    const response = await api.createChannel(initialGroup);
    return response.data;
  }
);

export const joinNewChannel = createAsyncThunk(
  "channels/joinNewChannel",
  async (channelId) => {
    const response = await api.joinChannel(channelId);
    return response.data;
  }
);

export const editChannel = createAsyncThunk(
  "channels/editChannel",
  async (updatedChannel) => {
    const response = await api.editChannel(updatedChannel);
    return response.data;
  }
);
// GET /api/channel/owned/:groupId: Get all owned channels in the group whose group ID is groupId. Login needed. It returns an array of Channel objects.
export const fetchOwnedChannels = createAsyncThunk(
  "channels/fetchOwnedChannels",
  async (groupid) => {
    const response = await api.fetchMyOwnedChannels(groupid);
    return response.data;
  }
);

export const fetchJoinedChannels = createAsyncThunk(
  "channels/fetchJoinedChannels",
  async (groupid) => {
    try {
      const response = await api.fetchMyJoinedChannels(groupid);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const deleteChannel = createAsyncThunk(
  "channels/deleteChannel",
  async (channelId) => {
    await api.deleteChannel(channelId);
    return channelId;
  }
);

export const removeChannelMember = createAsyncThunk(
  "channels/removeChannelMember",
  async (transInfo) => {
    const response = await api.removeMember(
      transInfo.channelId,
      transInfo.userId
    );
    return response.data;
  }
);

export const quitChannel = createAsyncThunk(
  "channels/quitChannel",
  async (channelId) => {
    const response = await api.quitChannel(channelId);
    return response.data;
  }
);

const channelSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addNewChannel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addNewChannel.fulfilled, (state, action) => {
        state.status = "idle";
        state.channelList.push(action.payload);
      })
      .addCase(addNewChannel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(joinNewChannel.fulfilled, (state, action) => {
        state.status = "idle";
        state.channelList.push(action.payload);
      })
      .addCase(fetchJoinedChannels.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchJoinedChannels.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        if (action.payload.status) {
          state.channelList = [];
          state.error = action.payload.message;
        } else {
          state.channelList = action.payload;
          state.error = null;
        }
      })
      .addCase(fetchJoinedChannels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(editChannel.fulfilled, (state, action) => {
        const { _id, ...body } = action.payload;
        const targetId = state.channelList.findIndex(
          (group) => group._id === _id
        );
        if (targetId >= 0) {
          state.channelList[targetId] = action.payload;
        }
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        let index = state.channelList.findIndex(
          (group) => group._id === action.payload
        );
        state.channelList.splice(index, 1);
      })
      .addCase(removeChannelMember.fulfilled, (state, action) => {
        let index = state.channelList.findIndex(
          (group) => group._id === action.payload._id
        );
        state.channelList[index] = action.payload;
      })
      .addCase(quitChannel.fulfilled, (state, action) => {
        let index = state.channelList.findIndex(
          (group) => group._id === action.payload._id
        );
        state.channelList.splice(index, 1);      
      });
  },
});

export default channelSlice.reducer;

export const selectAllChannels = (state) => state.channels.channelList;
