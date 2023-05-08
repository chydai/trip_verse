import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/group'


const initialState = {
  groupslist: [],
  curGroup: null,
  userGroup: [],
  searchGroup: [],
  status: 'idle',
  error: null
};

export const fetchRandomGroups = createAsyncThunk(
  'groups/fetchRandomGroups',
  async () => {
    const response = await api.fetchRandomGroups()
    return response.data
  }
)

export const fetchAllGroups = createAsyncThunk(
  'groups/fetchAllGroups',
  async () => {
    const response = await api.fetchAllGroups()
    return response.data
  }
)

export const fetchGroupById = createAsyncThunk(
  'groups/fetchGroupById',
  async (groupId) => {
    const response = await api.fetchCurGroup(groupId)
    return response.data
  }
)

export const fetchUserGroups = createAsyncThunk(
  'groups/fetchUserGroups',
  async (userId) => {
    const response = await api.fetchMyJoinedGroups(userId)
    return response.data
  }
)

export const addNewGroup = createAsyncThunk(
  'groups/addNewGroup',
  async (initialGroup) => {
    const response = await api.createGroup(initialGroup)
    return response.data
  }
)

export const deleteMyGroup = createAsyncThunk(
  'groups/deleteMyGroup',
  async (groupId) => {
    await api.deleteGroup(groupId)
    return groupId
  }
)

export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async (newGroup) => {
    // console.log(newGroup)
    const response = await api.updateGroup(newGroup)
    return response.data;
  }
);

export const joinGroup = createAsyncThunk(
  "groups/joinGroup",
  async (groupId) => {
    const response = await api.joinGroup(groupId);
    return response.data;
  }
)

export const exitGroup = createAsyncThunk(
  "groups/exitGroup",
  async (groupId) => {
    try {
      const response = await api.quitGroup(groupId);
      return response.data;
  } catch (error) {
      throw new Error(error);
  }
}
)

export const likeGroup = createAsyncThunk(
  "groups/likeGroup",
  async (groupId) => {
    const response = await api.likeGroup(groupId);
    return response.data;
  }
)

export const dislikeGroup = createAsyncThunk(
  "groups/dislikeGroup",
  async (groupId) => {
    const response = await api.dislikeGroup(groupId);
    return response.data;
  }
)

export const transferGroup = createAsyncThunk(
  "groups/transferGroup",
  async (transInfo) => {
    const response = await api.transferGroup(transInfo.groupId, transInfo.userId)
    return response.data;
  }
)

export const removeGroupMember = createAsyncThunk(
  "groups/removeGroupMember",
  async (transInfo) => {
    const response = await api.removeMemberFromGroup(transInfo.groupId, transInfo.userId)
    return response.data;
  }
)

export const searchGroup = createAsyncThunk(
  "groups/searchGroup",
  async (searchName) => {
    const response = await api.searchGroup(searchName)
    return response.data;
  }
)

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    groupSeachClear: (state, action) => {
        state.searchGroup=[];
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRandomGroups.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchRandomGroups.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.groupslist = action.payload
        // state.groupslist = state.groupslist.concat(action.payload)
      })
      .addCase(fetchRandomGroups.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(fetchAllGroups.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.groupslist = action.payload
        // state.groupslist = state.groupslist.concat(action.payload)
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(addNewGroup.fulfilled, (state, action) => {
        state.groupslist.push(action.payload)
      })
      .addCase(addNewGroup.rejected, (state, action) => {
        state.error = action.error.message
        console.log('after failure', state.error)
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        let index = state.groupslist.findIndex((group) => group._id === action.payload._id);
        state.groupslist[index] = action.payload
        state.curGroup = action.payload
      })
      .addCase(deleteMyGroup.fulfilled, (state, action) => {
        let index = state.groupslist.findIndex((group) => group._id === action.payload);
        state.groupslist.splice(index, 1);
        let index2 = state.userGroup.findIndex((group) => group._id === action.payload._id);
        state.userGroup.splice(index2, 1);
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.curGroup = action.payload
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.curGroup = action.payload
        let index = state.groupslist.findIndex((group) => group._id === action.payload._id);
        state.groupslist[index] = action.payload
        state.userGroup.push(action.payload)
      })
      .addCase(exitGroup.fulfilled, (state, action) => {
        state.curGroup = action.payload
        let index = state.groupslist.findIndex((group) => group._id === action.payload._id);
        state.groupslist[index] = action.payload
        let index2 = state.userGroup.findIndex((group) => group._id === action.payload._id);
        state.userGroup.splice(index2, 1);
      })
      .addCase(exitGroup.rejected, (state, action) => {
        state.error = action.error.message
        console.log('after failure', state.error)
      })
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.userGroup = action.payload
      })
      .addCase(transferGroup.fulfilled, (state, action) => {
        let index = state.groupslist.findIndex((group) => group._id === action.payload._id);
        state.groupslist[index] = action.payload
        let index2 = state.userGroup.findIndex((group) => group._id === action.payload._id);
        state.userGroup.splice(index2, 1);
      })
      .addCase(removeGroupMember.fulfilled, (state, action) => {
        let index = state.groupslist.findIndex((group) => group._id === action.payload._id);
        state.groupslist[index] = action.payload
        let index2 = state.userGroup.findIndex((group) => group._id === action.payload._id);
        state.userGroup[index2] = action.payload
      })
      .addCase(searchGroup.fulfilled, (state, action) => {
        state.searchGroup = action.payload
      })
      .addCase(likeGroup.fulfilled, (state, action) => {
        let index = state.groupslist.findIndex((group) => group._id === action.payload._id);
        state.groupslist[index] = action.payload
        let index2 = state.userGroup.findIndex((group) => group._id === action.payload._id);
        state.userGroup[index2] = action.payload
      })
      .addCase(dislikeGroup.fulfilled, (state, action) => {
        let index = state.groupslist.findIndex((group) => group._id === action.payload._id);
        state.groupslist[index] = action.payload
        let index2 = state.userGroup.findIndex((group) => group._id === action.payload._id);
        state.userGroup[index2] = action.payload
      })
  },
});

export const { groupSeachClear } = groupsSlice.actions

export default groupsSlice.reducer

export const selectAllGroups = state => state.groups.groupslist
export const selectSearchGroups = state => state.groups.searchGroup
export const selectUserGroups = state => state.groups.userGroup

export const selectGroupById = (state, groupId) =>
  state.groups.groupslist.find(group => group._id === groupId)
