import api from '../../api/axios';
import { API_ROUTES } from '../../api/routes';

export const addtoCart=async(cred)=>{
    try{
        const res=await api.post(API_ROUTES.cart.addItem(cred));
        return res;
    }catch(error){
        throw error.response.data;
    }
}

export const login=async(cred)=>{
    try{
        const res=await api.post(API_ROUTES.auth.login,cred);
        return res.data;
    }catch(error){
        throw error.response.data;
    }
}

export const checkAuth=async()=>{
    let token=localStorage.getItem("token");
    if(!token) return null;

    try{
        const res=await api.get(API_ROUTES.auth.checkAuth,{
            headers: {Authorization: 'Bearer $token'}
        });
        return res.data;
    }catch{
        localStorage.removeItem('token');
        return null;
    }
}
export const addtoWishlist=async(cred)=>{
    try{
        const res=await api.post(API_ROUTES.wishlist.addItem(cred));
        return res;
    }catch(error){
        throw error.response.data;
    }
}
