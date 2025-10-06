import apiAdmin from '../../api/apiAdmin';
import api from '../../api/axios';
import { API_ROUTES } from '../../api/routes';

export const register=async(cred)=>{
    try{
        const res=await apiAdmin.post(API_ROUTES.admin.register,cred);
        return res.data;
    }catch(error){
        throw error.response.data;
    }
}

export const adminLogin=async(cred)=>{
    try{
        const res=await apiAdmin.post(API_ROUTES.admin.login,cred);
        return res.data;
    }catch(error){
        throw error.response.data;
    }
}

export const adminCheckAuth=async()=>{
    let token=localStorage.getItem("adminToken");
    if(!token) return null;

    try{
        const res=await apiAdmin.get(API_ROUTES.admin.checkAuth,{
            headers: {Authorization: `Bearer ${token}`}
        });
        return res.data;
    }catch{
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
        return null;
    }
}
export const fetchLoggedInAdminById=async(id)=>{
    if (!id) return null; // if no ID, return null

  try {
    const res = await apiAdmin.get(`${API_ROUTES.admin.getById}/${id}`);
    return res.data.admin; // return the admin object
  } catch (error) {
    console.error("Error fetching admin by ID:", error);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    return null;
  }
}

