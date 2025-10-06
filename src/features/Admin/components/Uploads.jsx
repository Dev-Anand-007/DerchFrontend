import React, { useState,useEffect } from "react";
import { Upload, X, Eye, Save, Star, Tag, Heart, RotateCcw } from "lucide-react";
import { themes } from "../../../constants/colors";
import { toast } from "react-toastify";
import { API_ROUTES } from '../../../api/routes';
import { registerProduct } from "../AdminAPI";
import { useLocation } from "react-router-dom";

export const Uploads = () => {
  const mode = themes.lightMode;
  const location = useLocation();
  const editProduct = location.state?.product; // product passed from navigate
  const isEditMode = Boolean(editProduct);

  const initialFormData = {
    image: null,
    name: "",
    price: "",
    discount: "",
    bgColor: "#FFFFFF",
    panelColor: "#000000",
    textColor: "#000000",
    isNew: false,
    isSale: false,
    isCollection: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // Function to fetch and load image from API
  const fetchAndLoadImage = async (productId) => {
    try {
      setIsLoadingImage(true);
      const imageUrl = `${API_ROUTES.products.getImage(productId)}`;
      
      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      
      // Create a File object from the blob
      const fileName = `product-${productId}.jpg`; // You can adjust the filename/extension as needed
      const file = new File([blob], fileName, { type: blob.type });
      
      // Update form data with the file
      setFormData((prev) => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      toast.success("Product image loaded successfully!");
    } catch (error) {
      console.error('Error fetching image:', error);
      toast.error("Failed to load product image");
    } finally {
      setIsLoadingImage(false);
    }
  };

  // Prefill if editing
  useEffect(() => {
    if (isEditMode && editProduct) {
      setFormData((prev) => ({
        ...prev,
        ...editProduct,
      }));
      
      // Fetch and load the image if product has an ID
      if (editProduct._id) {
        fetchAndLoadImage(editProduct._id);
      }
    }
  }, [isEditMode, editProduct]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
    handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleImageUpload = (file) => {
    if (file.type.startsWith("image/")) {
      // Save to state
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      toast.success("File ready to upload!");
    } else {
      toast.error("Invalid file type!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Clear all form data
  const handleClearAll = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setShowPreview(false);
    toast.info("All data cleared!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check required fields
    if (
      !formData.name ||
      !formData.price ||
      !formData.discount ||
      !formData.image
    ) {
      toast.error("❌ Please fill Name, Price, Discount, and upload an Image.");
      return;
    }

    try {
      // Convert your state object → real FormData
      const data = new FormData();

      // Append all non-file fields first
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (key === "image") return; // skip for now

        // Convert booleans to string
        if (typeof value === "boolean") {
          data.append(key, String(value));
        }
        // Append other values if not empty
        else if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      // Append file last
      if (formData.image) {
        data.append("image", formData.image);
      }

      // Debug: Log FormData contents
      console.log("FormData being sent:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value} (type: ${typeof value})`);
      }

      // Call API
      await registerProduct(data);

      // ✅ Success toast
      toast.success("✅ Product successfully uploaded!");

      // Reset state + preview
      setFormData(initialFormData);
      setImagePreview(null);
    } catch (err) {
      // ❌ Error toast
      toast.error(err || "❌ Upload failed!");
    }
  };

  const PreviewCard = () => (
    <div
      className="p-6 rounded-lg border-2 border-dashed relative"
      style={{
        backgroundColor: formData.bgColor,
        color: formData.textColor,
        borderColor: formData.panelColor,
      }}
    >
      {/* Product Badges */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {formData.isNew && (
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            New
          </div>
        )}
        {formData.isSale && (
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Sale
          </div>
        )}
        {formData.isCollection && (
          <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Heart className="w-3 h-3" />
            Collection
          </div>
        )}
      </div>

      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          {isLoadingImage ? (
            <div className="text-gray-400 text-sm">Loading image...</div>
          ) : (
            <div className="text-gray-400 text-4xl">📷</div>
          )}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">
        {formData.name || "Product Name"}
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">₹{formData.price || "0"}</span>
        {formData.discount && (
          <span className="text-sm line-through opacity-60">
            ₹
            {(
              parseFloat(formData.price || 0) +
              parseFloat(formData.discount || 0)
            )}
          </span>
        )}
        {formData.discount && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            Save ₹{formData.discount}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 "
      style={{ backgroundColor: mode.background }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header  */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold" style={{ color: mode.text }}>
              {isEditMode ? "Edit Product" : "Upload Product"}
            </h1>
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: mode.text }}
            >
              <RotateCcw size={16} />
              Clear All
            </button>
          </div>
          <p style={{ color: mode.subText }}>
            {isEditMode ? "Edit existing product details" : "Add new products to your journey"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* form section  */}
          <div
            className="p-6 rounded-lg shadow-sm"
            style={{ backgroundColor: mode.homelight }}
          >
            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor=""
                  style={{ color: mode.text }}
                >
                  Product Image
                </label>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? "border-blue-800 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById("imageInput").click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {isLoadingImage ? (
                        <>
                          <div className="animate-spin mx-auto mb-4 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                          <p style={{ color: mode.text }}>Loading product image...</p>
                        </>
                      ) : (
                        <>
                          <Upload
                            size={48}
                            className="mx-auto mb-4"
                            style={{ color: mode.subText }}
                          />
                          <p style={{ color: mode.text }}>
                            Drop image here or click to upload
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: mode.subText }}
                          >
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* product name  */}
                <div className=" my-2">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: mode.text }}
                  >
                    Product name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Product Name"
                    required
                  />
                </div>
                {/* Price and Discount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: mode.text }}
                    >
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: mode.text }}
                    >
                      Discount (₹)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Product Categories */}
                <div className="my-4">
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: mode.text }}
                  >
                    Product Categories
                  </label>
                  <div className="space-y-3">
                    {/* New Product Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100">
                          <Star className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: mode.text }}>
                            New Product
                          </p>
                          <p className="text-xs" style={{ color: mode.subText }}>
                            Mark as newly added item
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isNew"
                          checked={formData.isNew}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    {/* Sale Product Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-100">
                          <Tag className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: mode.text }}>
                            Sale Product
                          </p>
                          <p className="text-xs" style={{ color: mode.subText }}>
                            Mark as on sale/discounted
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isSale"
                          checked={formData.isSale}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>

                    {/* Collection Product Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-100">
                          <Heart className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: mode.text }}>
                            Collection Item
                          </p>
                          <p className="text-xs" style={{ color: mode.subText }}>
                            Part of special collection
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isCollection"
                          checked={formData.isCollection}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Color Setting  */}
                <div className="grid grid-cols-1 gap-4 my-2">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: mode.text }}
                    >
                      Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        name="bgColor"
                        value={formData.bgColor}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.bgColor}
                        onChange={(e) =>
                          handleInputChange({
                            target: { name: "bgColor", value: e.target.value },
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: mode.text }}
                    >
                      Panel Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        name="panelColor"
                        value={formData.panelColor}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.panelColor}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "panelColor",
                              value: e.target.value,
                            },
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: mode.text }}
                    >
                      Text Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        name="textColor"
                        value={formData.textColor}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.textColor}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "textColor",
                              value: e.target.value,
                            },
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Action button  */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
                    style={{ color: mode.text }}
                  >
                    <Eye size={20} />
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: mode.buttonBg }}
                  >
                    <Save size={20} />
                    {isEditMode ? "Update Product" : "Upload Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview Section  */}
          <div
            className={`p-6 rounded-lg shadow-sm ${
              showPreview || "hidden lg:block"
            }`}
            style={{ backgroundColor: mode.homelight }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: mode.text }}
            >
              Live Preview
            </h2>
            <PreviewCard />

            {/* Category Status Display */}
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-sm" style={{ color: mode.text }}>
                Category Status
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-green-600" />
                    <span className="text-sm" style={{ color: mode.text }}>New Product</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${formData.isNew ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {formData.isNew ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-red-600" />
                    <span className="text-sm" style={{ color: mode.text }}>Sale Product</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${formData.isSale ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    {formData.isSale ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-purple-600" />
                    <span className="text-sm" style={{ color: mode.text }}>Collection Item</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${formData.isCollection ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                    {formData.isCollection ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Information Display */}
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-sm" style={{ color: mode.text }}>
                Color Palette
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div
                    className="w-full h-8 rounded-md border border-gray-200 mb-2"
                    style={{ backgroundColor: formData.bgColor }}
                  ></div>
                  <p
                    style={{ color: mode.subText }}
                    className="text-xs font-medium"
                  >
                    Background
                  </p>
                  <p style={{ color: mode.subText }} className="text-xs">
                    {formData.bgColor}
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className="w-full h-8 rounded-md border border-gray-200 mb-2"
                    style={{ backgroundColor: formData.panelColor }}
                  ></div>
                  <p
                    style={{ color: mode.subText }}
                    className="text-xs font-medium"
                  >
                    Border
                  </p>
                  <p style={{ color: mode.subText }} className="text-xs">
                    {formData.panelColor}
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className="w-full h-8 rounded-md border border-gray-200 mb-2"
                    style={{ backgroundColor: formData.textColor }}
                  ></div>
                  <p
                    style={{ color: mode.subText }}
                    className="text-xs font-medium"
                  >
                    Text
                  </p>
                  <p style={{ color: mode.subText }} className="text-xs">
                    {formData.textColor}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Form Data Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4
                className="text-sm font-medium mb-2"
                style={{ color: mode.text }}
              >
                Current Data:
              </h4>
              <div
                className="text-xs space-y-1"
                style={{ color: mode.subText }}
              >
                <p>
                  <strong>Name:</strong> {formData.name || "Not set"}
                </p>
                <p>
                  <strong>Price:</strong> ₹{formData.price || "0"}
                </p>
                <p>
                  <strong>Discount:</strong> ₹{formData.discount || "0"}
                </p>
                <p>
                  <strong>Image:</strong>{" "}
                  {formData.image ? "Uploaded" : "No image"}
                </p>
                <p>
                  <strong>Categories:</strong>{" "}
                  {[
                    formData.isNew && "New",
                    formData.isSale && "Sale", 
                    formData.isCollection && "Collection"
                  ].filter(Boolean).join(", ") || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  )
};