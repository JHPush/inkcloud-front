// src/api/productApi.js
import axios from "axios";
import jwtAxios from "./jwtAxios";
import qs from "qs";

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL;
const PRODUCT_API_URL = `${PREFIX_URL}/products`;
const CATEGORY_API_URL = `${PREFIX_URL}/categories`;

// 상품 검색 (필터 포함)
export const fetchProducts = async (params) => {
  const response = await axios.get(`${PRODUCT_API_URL}/search`, {
    params,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    withCredentials: true,
  });
  return response.data;
};

// 단일 상품 조회
export const fetchProductById = async (id) => {
  const res = await axios.get(`${PRODUCT_API_URL}/${id}`);
  return res.data;
};

// 신작 도서
export const getNewBooks = async () => {
  const response = await axios.get(`${PRODUCT_API_URL}/new`);
  return response.data;
};

// 추천 도서
export const getRecommendedBooks = async () => {
  const response = await axios.get(`${PRODUCT_API_URL}/recommended`);
  return response.data;
};

// 조건별 조회
export const getProductsByCondition = async ({ category }) => {
  const response = await axios.get(`${PRODUCT_API_URL}/search`, {
    params: { categories: category },
  });
  return response.data;
};

// 상품 등록 (관리자)
export const createProduct = async (form) => {
  const response = await jwtAxios.post(`${PRODUCT_API_URL}`, form);
  return response.data;
};

// 상품 수정 (관리자)
export const updateProduct = async (id, form) => {
  const response = await jwtAxios.put(`${PRODUCT_API_URL}/${id}`, form);
  return response.data;
};

// 모든 카테고리 조회
export const fetchAllCategories = async () => {
  const response = await axios.get(`${CATEGORY_API_URL}`);
  return response.data;
};

// 카테고리 등록 (관리자)
export const createCategory = async ({ name, parentId }) => {
  const response = await jwtAxios.post(`${CATEGORY_API_URL}`, { name, parentId });
  return response.data;
};

// 카테고리 수정 (관리자)
export const updateCategory = async ({ id, name, parentId }) => {
  const response = await jwtAxios.put(`${CATEGORY_API_URL}/${id}`, { name, parentId });
  return response.data;
};
