import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/bill";

const initialState = {
  billList: [],
  status: "idle",
  error: null,
};

export const addNewBill = createAsyncThunk(
  "bill/addNewBill",
  async (newBill) => {
    const response = await api.createBill(newBill);
    return response.data;
  }
);

export const editBill = createAsyncThunk(
  "bill/editBill",
  async (updatedBill) => {
    const response = await api.updateBill(updatedBill);
    return response.data;
  }
);

export const fetchBill = createAsyncThunk("bill/fetchBill", async (billId) => {
  const response = await api.getBill(billId);
  return response.data;
});

export const fetchBillsByChannel = createAsyncThunk(
  "bill/fetchBillsByChannel",
  async (channelId) => {
    const response = await api.getAllBillbyChannel(channelId);
    return response.data;
  }
);

export const fetchBillsByDatePlan = createAsyncThunk(
  "bill/fetchBillsByDatePlan",
  async (datePlanId) => {
    const response = await api.getAllBillbyDatePlan(datePlanId);
    return response.data;
  }
);

export const deleteBill = createAsyncThunk(
  "bill/deleteBill",
  async (billId) => {
    await api.deleteBill(billId);
    return billId;
  }
);

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addNewBill.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.billList.push(action.payload);
      })
      .addCase(addNewBill.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchBillsByDatePlan.fulfilled, (state, action) => {
        state.status = "idle";
        state.billList = action.payload;
      })
      .addCase(editBill.fulfilled, (state, action) => {
        state.status = "updated";

        const { _id, ...body } = action.payload;
        const targetId = state.billList.findIndex((group) => group._id === _id);
        if (targetId >= 0) {
          state.billList[targetId] = action.payload;
        }
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.status = "deleted";
        let index = state.billList.findIndex(
          (group) => group._id === action.payload
        );
        state.billList.splice(index, 1);
      });
  },
});

export default billSlice.reducer;

export const selectAllBillsByDatePlan = (state) => state.bill.billList;
