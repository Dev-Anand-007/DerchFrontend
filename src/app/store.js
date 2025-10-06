import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../features/auth/AuthSlice";
import AdminAuthSlice from '../features/adminAuth/AdminAuthSlice';

export const store = configureStore({
  reducer: {
    AuthSlice,
    AdminAuthSlice,
  },
});
