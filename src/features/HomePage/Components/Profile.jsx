import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { themes } from "../../../constants/colors";
import { selectLoggedInUser } from "../../auth/AuthSlice";

export const UserProfile = () => {
  const mode = themes.lightMode;

  // Get logged-in user from Redux store
  const loggedInUser = useSelector(selectLoggedInUser);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    joinDate: "",
    status: "Active",
  });

  useEffect(() => {
    if (loggedInUser) {
      setUserData({
        name: loggedInUser.fullname || "",
        email: loggedInUser.email || "",
        phone: loggedInUser.phone || "",
        address: loggedInUser.address || {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
        },
        joinDate: loggedInUser.createdAt || "Not Availbale",
        status: loggedInUser.status || "Active",
      });
    }
  }, [loggedInUser]);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.street || ""}, ${address.city || ""}, ${address.state || ""}, ${address.postalCode || ""}, ${address.country || ""}`;
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side - Avatar & Info */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
              <p className="text-gray-600">{userData.status}</p>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="md:col-span-2 flex flex-col justify-center space-y-5">
            {/* Email */}
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={16} />
              <span className="text-sm">{userData.email}</span>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={16} />
              <span className="text-sm">{userData.phone}</span>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">{formatAddress(userData.address)}</span>
            </div>

            {/* Joined Date */}
            {/* <div className="flex items-center gap-3 text-gray-600">
              <Calendar size={16} />
              <span className="text-sm">
                Joined {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString() : "-"}
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
