// import { createStore } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { combineReducers } from "redux";

// ==============================|| MULTIPLE REDUCERS ||============================== //

import groupReducer from "./groupSlice";
import customizationReducer from "./customizationSlice";
import userReducer from "./userSlice";
import preTripReducer from "./preTripPlanSlice";
import preTripPlaceReducer from "./preTripPlaceSlice";
import channelReducer from "./channelSlice";
import billReducer from "./billSlice";
import chatReducer from "./chatSlice";
import postReducer from "./postSlice";

// ==============================|| COMBINE REDUCER ||============================== //

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["users"],
};

const appReducer = combineReducers({
  customization: customizationReducer,
  groups: groupReducer,
  users: userReducer,
  channels: channelReducer,
  preTripPlan: preTripReducer,
  preTripPlace: preTripPlaceReducer,
  bill: billReducer,
  chat: chatReducer,
  posts: postReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "users/logout") {
    // this applies to all keys defined in persistConfig(s)
    storage.removeItem("persist:root");
    state = {};
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
