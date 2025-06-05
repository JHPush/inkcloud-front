import axios from "axios";
import qs from "qs";

const BASE_URL = "http://localhost:25000/api/v1";

export const fetchProducts = async (params) => {
  const response = await axios.get(`${BASE_URL}/products/search`, {
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }), // 중요!
    withCredentials: true,
  });
  return response.data;
};