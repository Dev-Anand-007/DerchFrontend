import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
//   uploadProduct,
//   fetchAdminProducts,
//   fetchAdminOrders,
  fetchLoggedInAdminById,
} from "../adminAuth/AdminAuthAPI";

const initialState = {
  status: "idle",
  error: null,
  products: [],
  orders: [],
  successMessage: null,
  adminProfile: null, // store full logged-in admin data
};

// Async thunks

// Upload product
export const uploadProductAsync = createAsyncThunk(
  "admin/uploadProduct",
  async (productData) => {
    const res = await uploadProduct(productData);
    return res;
  }
);

// Fetch all admin products
export const fetchAdminProductsAsync = createAsyncThunk(
  "admin/fetchProducts",
  async () => {
    const res = await fetchAdminProducts();
    return res;
  }
);

// Fetch all orders
export const fetchAdminOrdersAsync = createAsyncThunk(
  "admin/fetchOrders",
  async () => {
    const res = await fetchAdminOrders();
    return res;
  }
);

// Fetch logged-in admin by ID (for refresh)
export const fetchLoggedInAdminByIdAsync = createAsyncThunk(
  "admin/fetchById",
  async (id) => {
    const res = await fetchLoggedInAdminById(id);
    return res;
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload product
      .addCase(uploadProductAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(uploadProductAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.products.push(action.payload.product);
        state.successMessage = "Product uploaded successfully!";
      })
      .addCase(uploadProductAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      // Fetch products
      .addCase(fetchAdminProductsAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchAdminProductsAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.products = action.payload.products;
      })
      .addCase(fetchAdminProductsAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      // Fetch orders
      .addCase(fetchAdminOrdersAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchAdminOrdersAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.orders = action.payload.orders;
      })
      .addCase(fetchAdminOrdersAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      // Fetch logged-in admin by ID
      .addCase(fetchLoggedInAdminByIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchLoggedInAdminByIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.adminProfile = action.payload.admin;
      })
      .addCase(fetchLoggedInAdminByIdAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

// Actions
export const { clearAdminSuccessMessage, clearAdminError } = adminSlice.actions;

// Selectors
export const selectAdminProducts = (state) => state.admin.products;
export const selectAdminOrders = (state) => state.admin.orders;
export const selectAdminStatus = (state) => state.admin.status;
export const selectAdminError = (state) => state.admin.error;
export const selectAdminSuccessMessage = (state) => state.admin.successMessage;
export const selectAdminProfile = (state) => state.admin.adminProfile;

export default adminSlice.reducer;
