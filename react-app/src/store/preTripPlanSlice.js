import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/dateplan";

const initialState = {
  planlist: [],
  curPlan: null,
  status: "idle",
  error: null,
};

export const fetchAllPlan = createAsyncThunk(
  "preTripPlan/fetchAllPlan",
  async (channelId) => {
    const response = await api.fetchAllPlan(channelId);
    return response.data;
  }
);

export const fetchOnePlan = createAsyncThunk(
  "preTripPlan/fetchOnePlan",
  async (planId) => {
    const response = await api.fetchOnePlan(planId);
    return response.data;
  }
);

export const addNewPlan = createAsyncThunk(
  "preTripPlan/addNewPlan",
  async (newPlan) => {
    const { channelId, ...body } = newPlan;
    const response = await api.createDatePlan(body, channelId);
    return response.data;
  }
);

export const deletePlan = createAsyncThunk(
  "preTripPlan/deletePlan",
  async (planId) => {
    await api.deletePlan(planId);
    return planId;
  }
);

export const updatePlan = createAsyncThunk(
  "preTripPlan/updatePlan",
  async (newPlan) => {
    // console.log(newGroup)

    const response = await api.updatePlan(newPlan);
    return response.data;
  }
);

const preTripPlanSlice = createSlice({
  name: "preTripPlan",
  initialState,
  reducers: {
    planAdded: (state, action) => {
      state.planlist.push(action.payload);
    },
    planDeleted: (state, action) => {
      const index = state.planlist.indexOf(action.payload);
      state.planlist.splice(index, 1);
    },
    planUpdated: (state, action) => {
      const index = state.planlist.indexOf(action.payload);
      state.planlist[index] = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllPlan.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.planlist = action.payload;
      })
      .addCase(fetchAllPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPlan.pending, (state, action) => {
        // console.log('addnewgroups pending')
        state.status = "loading";
      })
      .addCase(addNewPlan.fulfilled, (state, action) => {
        // console.log('slice/addnewgroup', action.payload)
        state.status = "idle";
        const addDate = action.payload.date;
        const temp = state.planlist.find((group) => group.date === addDate);
        if (!temp) {
          state.planlist.push(action.payload);
          // state.curPlan = action.payload
        }
      })
      .addCase(addNewPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.log("after failure", state.error);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const { _id, ...body } = action.payload;
        const exsitingPlan = state.planlist.find((plan) => plan._id === _id);
        if (exsitingPlan) {
          exsitingPlan = action.payload;
        }
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        let index = state.planlist.findIndex(
          (group) => group._id === action.payload
        );
        state.planlist.splice(index, 1);
      })
      .addCase(fetchOnePlan.fulfilled, (state, action) => {
        state.curPlan = action.payload;
      });
  },
});

export const { planAdded, planDeleted, planUpdated } = preTripPlanSlice.actions;

export default preTripPlanSlice.reducer;

export const selectAllPlans = (state) => state.preTripPlan.planlist;
