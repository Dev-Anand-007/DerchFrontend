import apiAdmin from "../../api/apiAdmin";
import api from "../../api/axios";
import { API_ROUTES } from "../../api/routes";

export const registerProduct = async (cred) => {
  try {
    console.log(cred);
    const res = await apiAdmin.post(API_ROUTES.admin.createProduct, cred, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchAllProductAdmin = async () => {
  try {
    const res = await apiAdmin.get(API_ROUTES.products.getAllAdmin);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchAllProductUser = async () => {
  try {
    const res = await api.get(API_ROUTES.products.getAll);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const fetchAllOrders = async () => {
  try {
    const res = await apiAdmin.get(API_ROUTES.admin.getAllOrders);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await apiAdmin.delete(API_ROUTES.admin.deleteProduct(id));
    console.log(res)
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchAllUsers = async () => {
  try {
    const res = await apiAdmin.get(API_ROUTES.admin.fetchUser);
    return res.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
