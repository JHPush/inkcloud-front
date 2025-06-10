import axios from "axios";

export const addToCart = async ({ productId, quantity }) => {
  const response = await axios.post("/api/v1/cart-items", {
    productId,
    quantity,
  });
  return response.data;
};
