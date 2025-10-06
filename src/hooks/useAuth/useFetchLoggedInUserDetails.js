import { useEffect } from "react";
import { selectLoggedInUser } from "../../features/auth/AuthSlice"
import {useSelector,useDispatch} from 'react-redux';

export const useFetchLoggedInUserDetails = (deps)=>{

    const loggedInUser=useSelector(selectLoggedInUser);
    const dispatch=useDispatch();

    useEffect(()=>{
        if(deps && loggedInUser?.isVerified){
            dispatch(fetchLoggedInUserByIdAsync(loggedInUser?.id))
        }
    },[deps])
}