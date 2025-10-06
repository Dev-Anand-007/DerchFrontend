import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingCart, CreditCard, Plus, Minus } from 'lucide-react';
import { themes } from '../../../constants/colors';
import { fetchCart, addToCart, deleteFromCart, placeOrder } from '../CartAPI';
import { API_ROUTES } from '../../../api/routes';
import { toast } from 'react-toastify'

const CartPage = () => {
  const mode = themes.lightMode;
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubTotal] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(0);
  const [error, setError] = useState('');
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    cardNumber: '',
    expiryDate: ''
  });

  useEffect(() => {

    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);

      const data = await fetchCart();
      console.log(data)
      if (data.success === true) {
        setSubTotal(data.finalTotal);
        setDiscount(data.totalDiscount);
      }
      setCartItems(data.cart);

    } catch (err) {
      console.log(err)

      setError('Empty Cart ! Please Add some Item')
    } finally {

      setLoading(false);
    }
  };


  const handleDeleteItem = async (itemId) => {
    try {
      const res = await deleteFromCart(itemId);
      toast.success(res.message);
      loadCart();

    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleDeleteItem(itemId);
      return;
    }

    try {
      await addToCart(itemId, newQuantity);
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  // const subtotal = cartItems.reduce((sum, item) => sum + (item.price * 1), 0);
  // const discount = subtotal * 0.1; // 10% discount
  const total = subtotal - discount;

  const handlePlaceOrder = async () => {
    if (!paymentInfo.name || !paymentInfo.cardNumber || !paymentInfo.expiryDate) {
      toast.error('Please fill in all payment information');
      return;
    }

    setOrderProcessing(true);
    try {
      // Simulate order processing
      const res=await placeOrder();
      console.log(res)
      toast.success('Order placed successfully!');
      loadCart();
      // setPaymentInfo({ name: '', cardNumber: '', expiryDate: '' });
    } catch (err) {
      toast.error('Failed to place order');
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: mode.background }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: mode.buttonBg }}></div>
          <p style={{ color: mode.text }}>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: mode.background }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart style={{ color: mode.buttonBg }} size={32} />
          <h1
            className="text-3xl font-bold"
            style={{ color: mode.text }}
          >
            Shopping Cart
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={64} style={{ color: mode.subText }} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2" style={{ color: mode.text }}>
              Your cart is empty
            </h2>
            <p style={{ color: mode.subText }}>
              Add some items to your cart to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="p-6 rounded-lg shadow-sm border"
                  style={{
                    backgroundColor: mode.homelight,
                    borderColor: mode.buttonHover
                  }}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={`${API_ROUTES.products.getImage(item._id)}` || '/api/placeholder/120/120'}
                      alt={item.name}
                      className="w-full sm:w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: mode.text }}
                      >
                        {item.name}
                      </h3>
                      <p style={{ color: mode.subText }} className="mb-3 text-md line-through">
                        ${(item.price + item.discount).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      {/* <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                          style={{ color: mode.buttonBg }}
                        >
                          <Minus size={16} />
                        </button>
                        <span 
                          className="px-3 py-1 border rounded"
                          style={{ 
                            color: mode.text,
                            borderColor: mode.buttonHover 
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                          style={{ color: mode.buttonBg }}
                        >
                          <Plus size={16} />
                        </button>
                      </div> */}
                    </div>
                    <div className="text-right">
                      <p
                        className="text-lg font-semibold mb-3"
                        style={{ color: mode.text }}
                      >
                        ${(item.price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Payment */}
            <div className="space-y-6">
              {/* Price Summary */}
              <div
                className="p-6 rounded-lg shadow-sm border"
                style={{
                  backgroundColor: mode.homelight,
                  borderColor: mode.buttonHover
                }}
              >
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: mode.text }}
                >
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: mode.subText }}>Subtotal:</span>
                    <span style={{ color: mode.text }}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: mode.subText }}>Discount (10%):</span>
                    <span className="text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3" style={{ borderColor: mode.buttonHover }}>
                    <div className="flex justify-between font-bold text-lg">
                      <span style={{ color: mode.text }}>Total:</span>
                      <span style={{ color: mode.text }}>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div
                className="p-6 rounded-lg shadow-sm border"
                style={{
                  backgroundColor: mode.homelight,
                  borderColor: mode.buttonHover
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard style={{ color: mode.buttonBg }} size={20} />
                  <h3
                    className="text-xl font-semibold"
                    style={{ color: mode.text }}
                  >
                    Payment Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: mode.text }}
                    >
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.name}
                      onChange={(e) => handlePaymentChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: mode.buttonHover,
                        backgroundColor: mode.background,
                        color: mode.text,
                        focusRingColor: mode.buttonBg
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: mode.text }}
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: mode.buttonHover,
                        backgroundColor: mode.background,
                        color: mode.text
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: mode.text }}
                    >
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => handlePaymentChange('expiryDate', formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: mode.buttonHover,
                        backgroundColor: mode.background,
                        color: mode.text
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={orderProcessing || cartItems.length === 0}
                  className="w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: mode.buttonBg,
                    ':hover': { opacity: 0.9 }
                  }}
                >
                  {orderProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;