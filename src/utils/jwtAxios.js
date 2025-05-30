import axios from "axios";
import { getAccessToken } from "./cookieUtils";



// axios 인스턴스 생성
const jwtAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:25000/api/v1",
  withCredentials: true, // 필요시
});

// 요청 인터셉터: accessToken 자동 첨부
jwtAxios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 등 처리(옵션)
jwtAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 등 토큰 만료 시 처리 로직 추가 가능
    return Promise.reject(error);
  }
);

export default jwtAxios;