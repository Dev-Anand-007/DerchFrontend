import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { themes } from "../../../constants/colors";
import { fetchAllUsers } from "../AdminAPI";


const mode = themes.lightMode;

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const usersPerPage = 6;

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await fetchAllUsers();
        setUsers(userData);
      } catch (err) {
        setError("Failed to load users. Please try again.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    // const matchesRole =  "all";
      // selectedRole === "all" ||
      // user.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch ;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // const roles = ["all", "admin", "user", "manager"];

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: mode.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-t-transparent rounded-full"
          style={{ borderColor: mode.buttonBg, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8"
      style={{
        background: mode.background,
        color: mode.text,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <User size={32} style={{ color: mode.buttonBg }} />
            <h1 className="text-3xl md:text-4xl font-bold">Users</h1>
          </div>
          <p style={{ color: mode.subText }} className="text-lg">
            Manage and ${users.length} all registered users
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 rounded-lg shadow-sm mb-6"
          style={{ background: mode.homelight }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: mode.subText }}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    background: mode.background,
                    color: mode.text,
                    borderColor: mode.buttonHover,
                    focusRingColor: mode.buttonBg,
                  }}
                />
              </div>

              {/* Role Filter */}
              {/* <div className="flex items-center gap-2">
                <Filter size={20} style={{ color: mode.subText }} />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 capitalize"
                  style={{
                    background: mode.background,
                    color: mode.text,
                    borderColor: mode.buttonHover,
                  }}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role === "all" ? "All Roles" : role}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid" ? "shadow-sm" : "hover:bg-gray-200"
                }`}
                style={{
                  background:
                    viewMode === "grid" ? mode.homelight : "transparent",
                  color: viewMode === "grid" ? mode.buttonBg : mode.subText,
                }}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list" ? "shadow-sm" : "hover:bg-gray-200"
                }`}
                style={{
                  background:
                    viewMode === "list" ? mode.homelight : "transparent",
                  color: viewMode === "list" ? mode.buttonBg : mode.subText,
                }}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Users Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <p style={{ color: mode.subText }}>
            Showing {paginatedUsers.length} of {filteredUsers.length} users
          </p>
        </motion.div>

        {/* Users Grid/List */}
        <AnimatePresence mode="wait">
          {filteredUsers.length === 0 ? (
            <motion.div
              key="no-users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <User
                size={64}
                style={{ color: mode.subText }}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">No users found</h3>
              <p style={{ color: mode.subText }}>
                {searchTerm || selectedRole !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No users available"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={viewMode}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {paginatedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                    viewMode === "list" ? "flex items-center gap-4" : ""
                  }`}
                  style={{
                    background: mode.homelight,
                    borderColor: mode.buttonHover,
                  }}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 ${
                      viewMode === "grid" ? "mb-4" : ""
                    }`}
                  >
                    <div
                      className={`${
                        viewMode === "grid" ? "w-16 h-16" : "w-12 h-12"
                      } rounded-full flex items-center justify-center font-semibold text-white`}
                      style={{ background: mode.buttonBg }}
                    >
                      {user.fullname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  </div>

                  {/* User Info */}
                  <div
                    className={`flex-1 ${
                      viewMode === "list"
                        ? "flex items-center justify-between"
                        : ""
                    }`}
                  >
                    <div className={viewMode === "list" ? "" : "text-center"}>
                      <h3 className="text-lg font-semibold mb-1">
                        {user.fullname}
                      </h3>
                      <p
                        style={{ color: mode.subText }}
                        className="text-sm mb-2"
                      >
                        {user.email}
                      </p>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: mode.buttonHover,
                          color: mode.text,
                        }}
                      >
                        {user.role}
                      </span>
                      {viewMode === "grid" && (
                        <p
                          style={{ color: mode.subText }}
                          className="text-xs mt-2"
                        >
                          Joined {new Date(user.joinDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {viewMode === "list" && (
                      <div className="text-right">
                        <p style={{ color: mode.subText }} className="text-sm">
                          Joined {new Date(user.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              style={{
                borderColor: mode.buttonHover,
                background: mode.homelight,
              }}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  currentPage === page ? "font-semibold" : "hover:bg-gray-50"
                }`}
                style={{
                  borderColor: mode.buttonHover,
                  background:
                    currentPage === page ? mode.buttonBg : mode.homelight,
                  color: currentPage === page ? "white" : mode.text,
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              style={{
                borderColor: mode.buttonHover,
                background: mode.homelight,
              }}
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
