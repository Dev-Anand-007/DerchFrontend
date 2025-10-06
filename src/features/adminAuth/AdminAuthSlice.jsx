import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {adminLogin,adminCheckAuth} from './AdminAuthAPI';

const initialState={
    status: 'idle',
    errors: null,
    loginStatus:'idle',
    loginError:null,
    loggedInAdmin:null,
    isAuthChecked: false,
    successMessage:null,

    //for future Scope
    registerSuccess:'idle',
    registerError:null

}
// Login AsyncThunk
export const  loginAdminAsync=createAsyncThunk('adminAuth/login',async(cred)=>{
    const res=await adminLogin(cred);
    return res
})

// Register Admin AsyncThunk (future scope)
export const registerAdminAsync = createAsyncThunk("adminAuth/register", async (cred) => {
  const res = await adminRegister(cred);
  return res;
});

// Check Admin Auth
export const checkAdminAuthAsync = createAsyncThunk("adminAuth/checkAuth", async () => {
  const res = await adminCheckAuth();
  return res;
});


// Logout Admin
export const logoutAdminAsync = createAsyncThunk("adminAuth/logout", async () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
  return { success: true, message: "Admin logged out successfully" };
});


const AdminAuthSlice=createSlice({
    name:'AdminAuthSlice',
    initialState,
     reducers: {
    clearAdminAuthSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearAdminAuthErrors: (state) => {
      state.errors = null;
    },
    resetAdminAuthStatus: (state) => {
      state.status = "idle";
    },
    resetAdminLoginStatus: (state) => {
      state.loginStatus = "idle";
    },
    clearAdminLoginError: (state) => {
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginAdminAsync.pending, (state) => {
        state.loginStatus = "pending";
      })
      .addCase(loginAdminAsync.fulfilled, (state, action) => {
        state.loginStatus = "fulfilled";
        state.loggedInAdmin = action.payload;
        if (action.payload.token) {
          localStorage.setItem("adminToken", action.payload.token);
          localStorage.setItem("admin", JSON.stringify(action.payload.admin));
        }
      })
      .addCase(loginAdminAsync.rejected, (state, action) => {
        state.loginStatus = "rejected";
        state.loginError = action.error;
      })

      // REGISTER (future scope)
      .addCase(registerAdminAsync.pending, (state) => {
        state.registerStatus = "pending";
      })
      .addCase(registerAdminAsync.fulfilled, (state, action) => {
        state.registerStatus = "fulfilled";
        if (action.payload.token) {
          localStorage.setItem("adminToken", action.payload.token);
          localStorage.setItem("admin", JSON.stringify(action.payload.admin));
        }
      })
      .addCase(registerAdminAsync.rejected, (state, action) => {
        state.registerStatus = "rejected";
        state.registerError = action.error;
      })

      // CHECK AUTH
      .addCase(checkAdminAuthAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(checkAdminAuthAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.loggedInAdmin = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkAdminAuthAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
        state.isAuthChecked = true;
      })

      // LOGOUT
      .addCase(logoutAdminAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(logoutAdminAsync.fulfilled, (state) => {
        state.status = "fulfilled";
        state.loggedInAdmin = null;
      })
      .addCase(logoutAdminAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      });
  },
})


// Selectors
export const selectAdminAuthStatus = (state) => state.AdminAuthSlice.status;
export const selectAdminAuthErrors = (state) => state.AdminAuthSlice.errors;
export const selectLoggedInAdmin = (state) => state.AdminAuthSlice.loggedInAdmin;
export const selectAdminAuthSuccessMessage = (state) => state.AdminAuthSlice.successMessage;
export const selectIsAdminAuthChecked = (state) => state.AdminAuthSlice.isAuthChecked;
export const selectAdminLoginStatus = (state) => state.AdminAuthSlice.loginStatus;
export const selectAdminLoginError = (state) => state.AdminAuthSlice.loginError;
export const selectAdminRegisterStatus = (state) => state.AdminAuthSlice.registerStatus;
export const selectAdminRegisterError = (state) => state.AdminAuthSlice.registerError;

// Export reducers
export const {
  clearAdminAuthSuccessMessage,
  clearAdminAuthErrors,
  resetAdminAuthStatus,
  resetAdminLoginStatus,
  clearAdminLoginError,
} = AdminAuthSlice.actions;

export default AdminAuthSlice.reducer;