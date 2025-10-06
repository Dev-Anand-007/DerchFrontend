import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { themes } from '../../../constants/colors';
import { fetchAllProductAdmin, deleteProduct } from "../AdminAPI";
import { API_ROUTES } from '../../../api/routes';
import { Package, Edit, Trash2 } from 'lucide-react';
import {toast} from 'react-toastify';
import { motion } from 'framer-motion'


const uploadedItem = () => {
  const navigate=useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const mode = themes.lightMode;
  const PRODUCTS_PER_PAGE = 9;
  const fetchProducts = async () => {
    try {
      const res = await fetchAllProductAdmin();
      setProducts(res.products); // API already returns products
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {


    fetchProducts();
  }, []);
  const handleDeleteProduct = async (e, productId) => {
    e.preventDefault();

    // First confirmation
    const confirm1 = window.confirm("⚠️ Are you sure you want to delete this product?");
    if (!confirm1) return;

    // Second confirmation
    const confirm2 = window.confirm("❌ This action is permanent! Do you really want to delete?");
    if (!confirm2) return;

    try {
      const res = await deleteProduct(productId);

      toast.success("✅ Product deleted successfully!");
     

      // Optionally: refresh product list after deletion
      fetchProducts();

    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "❌ Failed to delete product");
    }
  };

  const handleEditProduct=async (e,product)=>{
    try{

       navigate("/admin/upload", { state: { product } });

    }catch(error){
      toast.error("Error!")

    }

  }

  // Calculate total pages
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  // Slice products for current page
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div
      className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: mode.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className="flex items-center justify-between mb-8 border-l-4 pl-6"
          style={{ borderColor: mode.buttonBg }}
        >
          <div>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{ color: mode.text }}
            >
              ALL PRODUCTS
            </h2>
            <div className="flex items-center space-x-2">
              <span
                className="text-lg font-medium px-3 py-1 rounded-full"
                style={{ backgroundColor: mode.buttonBg, color: 'white' }}
              >
                {products.length}
              </span>
              <span style={{ color: mode.subText }}>Fresh arrivals</span>
            </div>
          </div>
        </div>
        {products.length == 0 ? (
          <div className="text-center py-12">
            <Package
              size={64}
              style={{ color: mode.subText }}
              className="mx-auto mb-4"
            />
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: mode.text }}
            >
              Please Upload any Item
            </h2>
            <p style={{ color: mode.subText }}>
              Item will be visible here
            </p>
          </div>
        ) : (
          <>
            {/* Products Grid */}

            {/* Products Container */}
            <div className="overflow-hidden ">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="flex-none  group cursor-pointer"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Product Card */}
                    <div
                      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border"
                      style={{ borderColor: mode.buttonHover }}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden">
                        <motion.img
                          src={`${API_ROUTES.products.getImage(product._id)}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />

                        {/* Overlay Actions */}
                        <motion.div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {product.status ? (
                            <div className="flex space-x-3">
                              {/* Edit Button */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleEditProduct(e, product)}
                                className="p-3 rounded-full shadow-lg"
                                style={{ backgroundColor: mode.buttonBg }}
                              >
                                <Edit size={20} className="text-white" />
                              </motion.button>

                              {/* Delete Button */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleDeleteProduct(e, product._id)}
                                className="p-3 bg-red-500 rounded-full shadow-lg"
                              >
                                <Trash2 size={20} className="text-white" />
                              </motion.button>
                            </div>
                          ) : (
                            /* SOLD Badge */
                            <div className="px-4 py-2 rounded-lg bg-red-600 bg-opacity-80">
                              <span className="text-sm font-bold text-white">SOLD</span>
                            </div>
                          )}
                        </motion.div>


                        {/* New Badge */}
                        {product.isNew && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: mode.buttonBg }}
                          >
                            NEW
                          </motion.div>
                        )}

                        {/* Color Options */}
                        {/* <motion.div 
                          className="absolute bottom-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          {product.colors.map((color, colorIndex) => (
                            <motion.div
                              key={colorIndex}
                              whileHover={{ scale: 1.2 }}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-md cursor-pointer"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </motion.div> */}
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <div className="mb-2">
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: mode.subText }}
                          >
                            {product.category}
                          </p>
                          <h3
                            className="text-lg font-bold mb-2 line-clamp-2"
                            style={{ color: mode.text }}
                          >
                            {product.name}
                          </h3>
                        </div>

                        {/* Rating */}
                        {/* <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${
                                  i < Math.floor(product.rating) 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span 
                            className="text-sm font-medium"
                            style={{ color: mode.subText }}
                          >
                            {product.rating}
                          </span>
                        </div> */}

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span
                            className="text-2xl font-bold"
                            style={{ color: mode.buttonBg }}
                          >
                            ${product.price}
                          </span>
                          <span
                            className="text-md font-bold line-through"
                            style={{ color: mode.subText }}
                          >
                            ${product.price + product.discount}
                          </span>


                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
                style={{ borderColor: mode.buttonBg, color: mode.text }}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? "font-bold border-2" : "border"
                    }`}
                  style={{
                    borderColor: mode.buttonBg,
                    color: currentPage === i + 1 ? mode.buttonBg : mode.text,
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
                style={{ borderColor: mode.buttonBg, color: mode.text }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default uploadedItem;
