import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
};

export const addMessage = createAsyncThunk(
  "message/addMessage",
  (data, thunkApi) => {
    return data;
  }
);

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addMessage.fulfilled, (state, action) => {
      state.message = action.payload;
    });
  },
});

export const { clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
