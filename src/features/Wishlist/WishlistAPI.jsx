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
export const fetchWishlist=async()=>{
    try{
        const res=await api.get(API_ROUTES.wishlist.getWishlist);
        console.log(res.data)
        return res.data;
    }catch(error){
        throw error.response.data;
    }
}


export const RemovefromWishlist=async(cred)=>{
    try{
        const res=await api.delete(API_ROUTES.wishlist.removeItem(cred));
        return res;
    }catch(error){
        throw error.response.data;
    }
}
