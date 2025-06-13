import jwtAxios from './jwtAxios';

const CART_API_URL = '/api/v1/carts';


export const getCartItems = async () => {

  const response = await jwtAxios.get(CART_API_URL);

  return response.data;
};


export const deleteCartItem = async (cartId) => {

  await jwtAxios.delete(`${CART_API_URL}/${cartId}`);
};


export const clearCart = async () => {

  await jwtAxios.delete(CART_API_URL);
};


export const updateCartItemQuantity = async (cartId, quantity) => {

  await jwtAxios.put(`${CART_API_URL}/${cartId}`, null, {
    params: { quantity },
  });

};


export const addToCart = async (data) => {

  const response = await jwtAxios.post(CART_API_URL, data);
  
  return response.data;
};
