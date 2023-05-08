import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/place'


const initialState = {
  placelist: [],
  curPlace: null,
  status: 'idle',
  error: null
};

export const fetchAllPlace = createAsyncThunk(
  'preTripPlace/fetchAllPlace',
  async (planId) => {
    const response = await api.fetchAllPlace(planId)
    return response.data
  }
)

export const fetchOnePlace = createAsyncThunk(
  'preTripPlace/fetchOnePlace',
  async (placeId) => {
    const response = await api.fetchOnePlace(placeId)
    return response.data
  }
)

export const addNewPlace = createAsyncThunk(
  'preTripPlace/addNewPlace',
  async (newPlace) => {
    console.log('newplace')
    console.log(newPlace)
    const { planId, ...body } = newPlace

    const response = await api.createPlace(body, planId)
    return response.data
  }
)

export const deletePlace = createAsyncThunk(
  'preTripPlace/deletePlace',
  async (placeId) => {
    await api.deletePlace(placeId)
    return placeId
  }
)

export const updatePlace = createAsyncThunk(
  "preTripPlace/updatePlace",
  async (updatedPlace) => {
    // console.log(newGroup)
    const response = await api.updatePlace(updatedPlace)
    return response.data;
  }
);

const preTripPlaceSlice = createSlice({
  name: 'preTripPlace',
  initialState,
  reducers: {
    planCleared: (state, action) => {
      state.placelist = [];
    },
    addComment: (state, action) => {
      // console.log('?', action.payload)
      const { placeId, ...body } = action.payload
      let index = state.placelist.findIndex((group) => group._id === placeId);
      state.placelist[index].comments.push(action.payload._id)
    },
    deleteComment: (state, action) => {
      // console.log('?', action.payload)
      let index = state.placelist.findIndex((group) => group._id === action.payload.placeId);
      let index2 = state.placelist[index].comments.findIndex((group) => group._id === action.payload._id);

      state.placelist[index].comments.splice(index2, 1);    
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllPlace.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchAllPlace.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.placelist = action.payload
        // state.groupslist = state.groupslist.concat(action.payload)
      })
      .addCase(fetchAllPlace.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPlace.pending, (state, action) => {
        // console.log('addnewgroups pending')
        state.status = 'loading'
      })
      .addCase(addNewPlace.fulfilled, (state, action) => {
        // console.log('slice/addnewgroup', action.payload)
        state.status = 'idle'
        state.placelist.push(action.payload)
      })
      .addCase(addNewPlace.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        console.log('after failure', state.error)
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        const { _id, ...body } = action.payload
        const exsitingPlace = state.placelist.find(plan => plan._id === _id)
        if (exsitingPlace) {
          exsitingPlace = action.payload
        }
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        let index = state.placelist.findIndex((group) => group._id === action.payload);
        state.placelist.splice(index, 1);
      })
      .addCase(fetchOnePlace.fulfilled, (state, action) => {
        state.curPlace = action.payload
      })
  },
});

export const { planCleared, addComment, deleteComment } = preTripPlaceSlice.actions

export default preTripPlaceSlice.reducer

export const selectAllPlaces = state => state.preTripPlace.placelist