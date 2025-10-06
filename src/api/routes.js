const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const API_ROUTES = {
  auth: {
    register: `${BASE_URL}/auth/register`,
    login: `${BASE_URL}/auth/login`,
    checkAuth:`${BASE_URL}/auth/check-auth`,
  },

  admin: {
    create: `${BASE_URL}/admin/create`,
    login: `${BASE_URL}/admin/login`,
    checkAuth: `${BASE_URL}/admin/check`,
    getById: `${BASE_URL}/admin/fetch`,
    fetchUser:`${BASE_URL}/admin/fetchUser`,
    createProduct: `${BASE_URL}/admin/product/create`,
    deleteProduct: (id)=> `${BASE_URL}/admin/product/delete/${id}`,
    updateProduct: (id) => `${BASE_URL}/admin/product/${id}`,
    getAllOrders: `${BASE_URL}/admin/orders/all`,
  },

  products: {
    getAllAdmin: `${BASE_URL}/admin/product/fetchalladmin`,
    getAll: `${BASE_URL}/products`,
    getDiscounted: `${BASE_URL}/products/discounted`,
    getNew: `${BASE_URL}/products/new`,
    getSorted: `${BASE_URL}/products/sort`,
    getById: (id) => `${BASE_URL}/product/${id}`,
    getImage: (id) => `${BASE_URL}/products/image/${id}`,
  },

  cart: {
    addItem: (id) => `${BASE_URL}/cart/add/${id}`,
    getCart: `${BASE_URL}/cart`,
    reduceItem: (id) => `${BASE_URL}/cart/reduce/${id}`,
    delete: (id) => `${BASE_URL}/cart/delete/${id}`,
  },
  wishlist: {
    addItem: (id) => `${BASE_URL}/wishlist/add/${id}`,
    getWishlist: `${BASE_URL}/wishlist`,
    reduceItem: (id) => `${BASE_URL}/wishlist/reduce/${id}`,
    removeItem: (id) => `${BASE_URL}/wishlist/delete/${id}`,
  },

  orders: {
    getOrders: `${BASE_URL}/orders`,
    createOrder: `${BASE_URL}/orders/create`,
  },
};
