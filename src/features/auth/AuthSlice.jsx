import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, register, checkAuth } from './AuthApi';
import { API_ROUTES } from '../../api/routes';

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

const initialState = {
    status: "idle",
    errors: null,
    registerStatus: 'idle',
    registerError: null, // Fixed: was 'null' as string
    loginStatus: 'idle',
    loginError: null,
    loggedInUser: savedUser ? JSON.parse(savedUser) : null,
    successMessage: null,
    isAuthChecked: false,
    token: savedToken || null
}

// Register AsyncThunk
export const registerAsync = createAsyncThunk('auth/register', async (cred) => {
    const res = await register(cred);
    return res;
});

export const loginAsync = createAsyncThunk('auth/login', async (cred) => {
    const res = await login(cred);
    return res;
});

export const checkAuthAsync = createAsyncThunk('auth/checkAuthAsync', async () => {
    const res = await checkAuth();
    return res;
});

export const logoutAsync = createAsyncThunk("auth/logoutAsync", async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true, message: "Logged out successfully" };
});

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        clearAuthSuccessMessage: state => { state.successMessage = null },
        clearAuthErrors: state => { state.errors = null },
        resetAuthStatus: state => { state.status = 'idle' },
        resetRegisterStatus: state => { state.registerStatus = 'idle' },
        clearRegisterError: state => { state.registerError = null },
        resetLoginStatus: state => { state.loginStatus = 'idle' },
        clearLoginError: state => { state.loginError = null },
        // Add this reducer to manually sync localStorage data
        syncUserFromStorage: state => {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            if (savedUser && savedToken) {
                state.loggedInUser = JSON.parse(savedUser);
                state.token = savedToken;
            }
        }
    },
    extraReducers: builder => {
        builder
            // Register
            .addCase(registerAsync.pending, state => {
                state.registerStatus = 'pending';
                state.registerError = null;
            })
            .addCase(registerAsync.fulfilled, (state, action) => {
                state.registerStatus = 'fulfilled';

                // Ensure consistent data structure
                const userData = action.payload.data?.user || action.payload.user;
                const token = action.payload.data?.token || action.payload.token;

                if (userData && token) {
                    state.loggedInUser = userData;
                    state.token = token;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.registerStatus = 'rejected';
                state.registerError = action.error.message || 'Registration failed';
            })

            // Login
            .addCase(loginAsync.pending, state => {
                state.loginStatus = 'pending';
                state.loginError = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loginStatus = 'fulfilled';

                // Ensure consistent data structure
                const userData = action.payload.data?.user || action.payload.user;
                const token = action.payload.data?.token || action.payload.token;

                if (userData && token) {
                    state.loggedInUser = userData;
                    state.token = token;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loginStatus = 'rejected';
                state.loginError = action.error.message || 'Login failed';
            })

            // Logout
            .addCase(logoutAsync.pending, state => { state.status = 'pending' })
            .addCase(logoutAsync.fulfilled, state => {
                state.status = 'fulfilled';
                state.loggedInUser = null;
                state.token = null;
                // Clear all auth-related states
                state.isAuthChecked = true;
            })
            .addCase(logoutAsync.rejected, (state, action) => {
                state.status = 'rejected';
                state.errors = action.error.message || 'Logout failed';
            })

            // Check Auth - Fixed to handle data consistently
            .addCase(checkAuthAsync.pending, state => { state.status = 'pending' })
            .addCase(checkAuthAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.isAuthChecked = true;

                const payload = action.payload || null;

                if (payload && (payload.data?.user || payload.user)) {
                    const userData = payload.data?.user || payload.user;
                    state.loggedInUser = userData;
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    // User not logged in or logged out
                    state.loggedInUser = null;
                    state.token = null;
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            })

            .addCase(checkAuthAsync.rejected, (state, action) => {
                state.status = 'rejected';
                state.errors = action.error.message || 'Auth check failed';
                state.isAuthChecked = true;

                // Clear invalid auth data
                state.loggedInUser = null;
                state.token = null;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            });
}
});

// Selectors
export const selectAuthStatus = state => state.AuthSlice.status;
export const selectAuthErrors = state => state.AuthSlice.errors;
export const selectLoggedInUser = state => state.AuthSlice.loggedInUser;
export const selectAuthSuccessMessage = state => state.AuthSlice.successMessage;
export const selectIsAuthChecked = state => state.AuthSlice.isAuthChecked;
export const selectRegisterStatus = state => state.AuthSlice.registerStatus;
export const selectRegisterError = state => state.AuthSlice.registerError;
export const selectLoginStatus = state => state.AuthSlice.loginStatus;
export const selectLoginError = state => state.AuthSlice.loginError;
export const selectToken = state => state.AuthSlice.token;

// Export reducers
export const {
    clearAuthSuccessMessage,
    clearAuthErrors,
    resetAuthStatus,
    clearRegisterError,
    resetRegisterStatus,
    clearLoginError,
    resetLoginStatus,
    syncUserFromStorage
} = authSlice.actions;

export default authSlice.reducer;