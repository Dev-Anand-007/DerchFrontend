import api from '../../api/axios';
import { API_ROUTES } from '../../api/routes';

export const addToCart=async(cred)=>{
    try{
        const res=await api.post(API_ROUTES.cart.addItem(cred));
        return res;
    }catch(error){
        throw error.response.data;
    }
}
export const deleteFromCart=async(cred)=>{
    try{
        const res=await api.delete(API_ROUTES.cart.delete(cred));

        return res;
    }catch(error){
        throw error.response.data;
    }
}
export const fetchCart=async()=>{
    try{
        const res=await api.get(API_ROUTES.cart.getCart);
       console.log(res.data)
        return res.data;
    }catch(error){
        throw error.response.data;
    }
}


export const placeOrder=async(cred)=>{
    try{
        const res=await api.get(API_ROUTES.orders.createOrder);
        return res;
    }catch(error){
        throw error.response.data;
    }
}

export const fetchAllOrder=async(cred)=>{
    try{
        const res=await api.get(API_ROUTES.orders.getOrders);
        return res;
    }catch(error){
        throw error.response.data;
    }
}

