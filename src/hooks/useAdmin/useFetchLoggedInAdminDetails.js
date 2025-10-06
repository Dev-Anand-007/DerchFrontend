import { useEffect } from "react";
import { selectLoggedInAdmin } from "../../features/adminAuth/AdminAuthSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchLoggedInAdminByIdAsync } from "../../features/Admin/AdminSlice";

export const useFetchLoggedInAdminDetails = (deps) => {
  const loggedInAdmin = useSelector(selectLoggedInAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (deps && loggedInAdmin?._id) {
      dispatch(fetchLoggedInAdminByIdAsync(loggedInAdmin._id));
    }
  }, [deps, loggedInAdmin, dispatch]);
};
