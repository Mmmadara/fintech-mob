import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { unauthApi } from "./services/unauthorized.service";
import messageReducer from "./slices/message";

const rootReducer = combineReducers({
  message: messageReducer,
  [unauthApi.reducerPath]: unauthApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(unauthApi.middleware),
  devTools: true,
});

export default store;
