import {useEffect} from 'react'
import {checkAdminAuthAsync} from '../../features/adminAuth/AdminAuthSlice';
import {useDispatch} from 'react-redux';

export const useAdminAuth=()=>{
    const dispatch=useDispatch();

    useEffect(()=>{
        dispatch(checkAdminAuthAsync())
        

    },[dispatch])
}

