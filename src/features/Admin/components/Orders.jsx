import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { themes } from "../../../constants/colors";
import { fetchAllOrders } from "../AdminAPI";

export const Orders = () => {
  const mode = themes.lightMode;
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchAllOrders();
        if (res.success) {
          setUsers(res.users);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Generate random status for demonstration (since API doesn't provide status)
  const getRandomStatus = () => {
    const statuses = ["delivered", "shipped", "processing", "pending", "cancelled"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate final price after discount
  const calculateFinalPrice = (price, discount) => {
    return price - discount;
  };

  const statusConfig = {
    ordered: {
      color: "#10B981",
      bg: "#D1FAE5",
      icon: CheckCircle,
      label: "Ordered",
    },
    delivered: {
      color: "#10B981",
      bg: "#D1FAE5",
      icon: CheckCircle,
      label: "Delivered",
    },
    shipped: { color: "#3B82F6", bg: "#DBEAFE", icon: Truck, label: "Shipped" },
    processing: {
      color: "#F59E0B",
      bg: "#FEF3C7",
      icon: Package,
      label: "Processing",
    },
    pending: { color: "#6B7280", bg: "#F3F4F6", icon: Clock, label: "Pending" },
    cancelled: {
      color: "#EF4444",
      bg: "#FEE2E2",
      icon: AlertCircle,
      label: "Cancelled",
    },
  };

  const filterOptions = [
    "all",
    "delivered",
    "shipped",
    "processing",
    "pending",
    "cancelled",
  ];

  // Transform API data into order format with generated status
  const allOrders = users.flatMap((user) =>
    user.orders.map((product, index) => ({
      _id: `${user._id}-${product._id}`,
      orderId: `ORD-${user._id.slice(-6)}-${index + 1}`,
      customer: user.name,
      email: user.email,
      userId: user._id,
      productName: product.name,
      price: product.price,
      discount: product.discount,
      finalPrice: calculateFinalPrice(product.price, product.discount),
      status:'ordered', // Since API doesn't provide status
      date: formatDate(product.updatedAt),
      bgColor: product.bgColor,
      panelColor: product.panelColor,
      textColor: product.textColor,
      isNew: product.isNew,
      isSale: product.isSale,
      isCollection: product.isCollection,
    }))
  );

  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Calculate stats based on filtered orders
  const getStatusCount = (status) => {
    return allOrders.filter(order => order.status === status).length;
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig["ordered"];
    const IconComponent = config.icon;

    return (
      <div
        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: config.bg,
          color: config.color,
        }}
      >
        <IconComponent className="w-3 h-3" />
        <span>{config.label}</span>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: mode.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                style={{ color: mode.text }}
              >
                Orders Management
              </h1>
              <p
                className="mt-1 text-sm sm:text-base"
                style={{ color: mode.subText }}
              >
                Manage and track all customer orders ({allOrders.length} total orders)
              </p>
            </div>

            {/* <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: mode.buttonBg }}
            >
              <Download className="w-4 h-4" />
              <span>Export Orders</span>
            </button> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = getStatusCount(status);
            const IconComponent = config.icon;

            return (
              <div
                key={status}
                className="p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
                style={{ backgroundColor: mode.homelight }}
              >
                <div className="flex justify-center mb-2">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: config.bg }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: config.color }}
                    />
                  </div>
                </div>
                <h3 className="text-lg font-bold" style={{ color: mode.text }}>
                  {count}
                </h3>
                <p
                  className="text-xs capitalize"
                  style={{ color: mode.subText }}
                >
                  {config.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div
          className="p-4 sm:p-6 rounded-xl shadow-sm mb-6"
          style={{ backgroundColor: mode.homelight }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: mode.subText }}
              />
              <input
                type="text"
                placeholder="Search orders, customers, products, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-0 text-sm focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: mode.background,
                  color: mode.text,
                  outline: "none",
                }}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: mode.subText }} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border-0 text-sm capitalize focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: mode.background,
                  color: mode.text,
                  outline: "none",
                }}
              >
                <option value="all">All Orders ({allOrders.length})</option>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <option key={status} value={status}>
                    {config.label} ({getStatusCount(status)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div
          className="rounded-xl shadow-sm overflow-hidden"
          style={{ backgroundColor: mode.homelight }}
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: mode.background }}>
                <tr>
                  <th
                    className="text-left p-4 text-sm font-semibold"
                    style={{ color: mode.text }}
                  >
                    Order ID
                  </th>
                  <th
                    className="text-left p-4 text-sm font-semibold"
                    style={{ color: mode.text }}
                  >
                    Customer
                  </th>
                  <th
                    className="text-left p-4 text-sm font-semibold"
                    style={{ color: mode.text }}
                  >
                    Product
                  </th>
                  <th
                    className="text-left p-4 text-sm font-semibold"
                    style={{ color: mode.text }}
                  >
                    Price
                  </th>
                  <th
                    className="text-left p-4 text-sm font-semibold"
                    style={{ color: mode.text }}
                  >
                    Discount
                  </th>
                  <th
                    className="text-left p-4 text-sm font-semibold"
                    style={{ color: mode.text }}
                  >
                    Final Amount
                  </th>
                  <th
                    className="text-left p-4 text-sm font-semibold"
                    style={{ color: mode.text }}
                  >
                    Status
                  </th>
                  <th
                    className="text-left p-4 text-sm font-semibold"
                    style={{ color: mode.text }}
                  >
                    Date
                  </th>
                  {/* <th
                    className="text-left p-4 text-sm font-semibold"
                    style={{ color: mode.text }}
                  >
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-opacity-50 transition-colors"
                    style={{ borderColor: mode.background }}
                  >
                    <td className="p-4">
                      <span
                        className="font-medium text-sm"
                        style={{ color: mode.text }}
                      >
                        {order.orderId}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p
                          className="font-medium text-sm"
                          style={{ color: mode.text }}
                        >
                          {order.customer}
                        </p>
                        <p className="text-xs" style={{ color: mode.subText }}>
                          {order.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: order.bgColor }}
                        ></div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: mode.text }}
                          >
                            {order.productName}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {order.isNew && (
                              <span className="text-xs px-1 py-0.5 bg-green-100 text-green-600 rounded">
                                New
                              </span>
                            )}
                            {order.isSale && (
                              <span className="text-xs px-1 py-0.5 bg-red-100 text-red-600 rounded">
                                Sale
                              </span>
                            )}
                            {order.isCollection && (
                              <span className="text-xs px-1 py-0.5 bg-blue-100 text-blue-600 rounded">
                                Collection
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className="font-medium text-sm"
                        style={{ color: mode.text }}
                      >
                        ₹{order.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className="text-sm text-red-600 font-medium"
                      >
                        -₹{order.discount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: mode.text }}
                      >
                        ₹{order.finalPrice.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4">
                      <span className="text-sm" style={{ color: mode.subText }}>
                        {order.date}
                      </span>
                    </td>
                    {/* <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                          <Eye
                            className="w-4 h-4"
                            style={{ color: mode.subText }}
                          />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                          <Edit
                            className="w-4 h-4"
                            style={{ color: mode.subText }}
                          />
                        </button>
                        <button className="p-1 rounded hover:bg-red-100 transition-colors">
                          <Trash2
                            className="w-4 h-4"
                            style={{ color: "#EF4444" }}
                          />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: mode.background,
                  borderColor: mode.buttonHover,
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: mode.text }}
                    >
                      {order.orderId}
                    </p>
                    <p className="text-xs" style={{ color: mode.subText }}>
                      {order.date}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="mb-3">
                  <p
                    className="font-medium text-sm"
                    style={{ color: mode.text }}
                  >
                    {order.customer}
                  </p>
                  <p className="text-xs" style={{ color: mode.subText }}>
                    {order.email}
                  </p>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: order.bgColor }}
                    ></div>
                    <p className="text-sm font-medium" style={{ color: mode.text }}>
                      {order.productName}
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: mode.subText }}>
                    ₹{order.price.toLocaleString()} - ₹{order.discount.toLocaleString()} = ₹{order.finalPrice.toLocaleString()}
                  </p>
                </div>

                {/* <div className="flex justify-end gap-2">
                  <button
                    className="p-2 rounded hover:bg-gray-100 transition-colors"
                    style={{ backgroundColor: mode.homelight }}
                  >
                    <Eye className="w-4 h-4" style={{ color: mode.subText }} />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-gray-100 transition-colors"
                    style={{ backgroundColor: mode.homelight }}
                  >
                    <Edit className="w-4 h-4" style={{ color: mode.subText }} />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-red-100 transition-colors"
                    style={{ backgroundColor: mode.homelight }}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: "#EF4444" }} />
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && allOrders.length > 0 && (
          <div className="text-center py-12">
            <Package
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: mode.subText }}
            />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: mode.text }}
            >
              No orders match your filters
            </h3>
            <p style={{ color: mode.subText }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* No Orders State */}
        {allOrders.length === 0 && (
          <div className="text-center py-12">
            <Package
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: mode.subText }}
            />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: mode.text }}
            >
              No orders found
            </h3>
            <p style={{ color: mode.subText }}>
              Orders will appear here once customers make purchases
            </p>
          </div>
        )}
      </div>
    </div>
  );
};