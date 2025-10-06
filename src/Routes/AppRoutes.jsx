import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthCheck } from '../hooks/useAuth/useAuthCheck';
import { useAdminAuth } from "../hooks/useAdmin/useAdminAuth";
import { useFetchLoggedInUserDetails } from '../hooks/useAuth/useFetchLoggedInUserDetails';
import { useFetchLoggedInAdminDetails } from '../hooks/useAdmin/useFetchLoggedInAdminDetails';
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
import AdminAuthPage from "../pages/AdminAuthPage";
import Admin from '../pages/Admin';

// Components
import NewThisWeek from "../features/HomePage/Components/NewThisWeek";
import Collection from "../features/HomePage/Components/Collections";
import New from "../features/HomePage/Components/New";
import Sale from "../features/HomePage/Components/Sale";

import {
  selectIsAuthChecked,
  selectLoggedInUser,
} from "../features/auth/AuthSlice";

import {
  selectIsAdminAuthChecked,
  selectLoggedInAdmin
} from '../features/adminAuth/AdminAuthSlice';
import {Orders} from "../features/Admin/components/Orders";

import { Uploads } from "../features/Admin/components/Uploads";
import Dashboard from "../features/Admin/components/Dashboard";
import { Products } from "../features/Admin/components/Products";
import { Profile } from "../features/Admin/components/Profile";
import { UserProfile } from "../features/HomePage/Components/Profile";
import { Users } from "../features/Admin/components/Users";
import { Wishlist } from "../pages/Wishlist";
import { Cart } from "../pages/Cart";
import {UserOrder} from "../pages/Orders";




function AppRoutes() {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);

  const isAdminChecked=useSelector(selectIsAdminAuthChecked);
  const loggedInAdmin=useSelector(selectLoggedInAdmin)

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  useAdminAuth();
  useFetchLoggedInAdminDetails(loggedInAdmin)




  // Show loading while checking authentication
  if (!isAuthChecked || !isAdminChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

   const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* User Auth Route */}
        <Route
          path="/auth"
          element={!loggedInUser ? <AuthPage /> : <Navigate to="/" replace />}
        />

        {/* Admin Auth Route */}
        <Route
          path="/adminlogin"
          element={
            !loggedInAdmin ? (
              <AdminAuthPage />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/"
          element={loggedInUser ? <HomePage /> : <Navigate to="/auth" replace />}
        >
          <Route index element={<NewThisWeek />} />
          <Route path="collection" element={<Collection />} />
          <Route path="new" element={<New />} />
          <Route path="sale" element={<Sale />} />
          <Route path="wishlist" element={<Wishlist/>} />
          <Route path="cart" element={<Cart/>} />
          <Route path="profile" element={<UserProfile/>} />
          <Route path="order" element={<UserOrder/>} />
          
         
        </Route>
        

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            loggedInAdmin ? (
              <Admin/>
            ) : (
              <Navigate to="/adminlogin" replace />
            )
          }
        >
          {/* nested admin routes */}
          <Route index element={<Dashboard/>} />
          <Route path="orders" element={<Orders />}/>
          <Route path="users" element={<Users/>}/>
          <Route path="profile" element={<Profile/>} />
          <Route path="upload" element={<Uploads/>} />
          <Route path="products" element={<Products/>} />
        </Route>

        {/* Catch all */}
        <Route
          path="*"
          element={
            loggedInUser ? (
              <Navigate to="/" replace />
            ) : loggedInAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default AppRoutes;