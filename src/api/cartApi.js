import jwtAxios from './jwtAxios';

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL;
const CART_API_URL = '/api/v1/carts';


export const getCartItems = async () => {

  const response = await jwtAxios.get(`${PREFIX_URL+CART_API_URL}`);

  return response.data;
};


export const deleteCartItem = async (cartId) => {

  await jwtAxios.delete(`${PREFIX_URL+CART_API_URL}/${cartId}`);
};


export const clearCart = async () => {

  await jwtAxios.delete(`${PREFIX_URL+CART_API_URL}`);
};


export const updateCartItemQuantity = async (cartId, quantity) => {

  await jwtAxios.put(`${PREFIX_URL+CART_API_URL}/${cartId}`, null, {
    params: { quantity },
  });

};


export const addToCart = async (data) => {

  const response = await jwtAxios.post(CART_API_URL, data);
  
  return response.data;
};
