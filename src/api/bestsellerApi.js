// src/api/bestsellerApi.js
import axios from './jwtAxios';
import publicApi from './publicApi';

// const PREFIX_URL = process.env.REACT_APP_PREFIX_URL;
const BESTSELLERS_API_URL = '/bestsellers';

// 일간 베스트셀러 Top 10 조회
export const getDailyBestsellers = async () => {
  const response = await publicApi.get(`${BESTSELLERS_API_URL}?period=daily`);
  return response.data;
};

// 주간 베스트셀러 Top 10 조회
export const getWeeklyBestsellers = async () => {
  const response = await publicApi.get(`${BESTSELLERS_API_URL}?period=weekly`);
  return response.data;
};
