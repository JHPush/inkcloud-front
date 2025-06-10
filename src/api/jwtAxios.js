import axios from "axios";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "../utils/cookieUtils";
import { refreshToken as refreshTokenApi } from "./keycloakApi";

// // axios 인스턴스 생성
const jwtAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:25000/api/v1",
  withCredentials: true, // 필요시
});


jwtAxios.interceptors.request.use(
  config => {
    const token = getAccessToken();
    const refresh = getRefreshToken();
    // console.log(`token : ${token}`)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

jwtAxios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    // access token 만료(401) & 재시도 안 했을 때만
    // if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = getRefreshToken();

        if (!refresh) throw new Error("No refresh token");
        const data = await refreshTokenApi(refresh);
        setAccessToken(data.access_token);
        if (data.refresh_token) {
 
          setRefreshToken(data.refresh_token); // 새 refresh token 저장
        }
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return jwtAxios(originalRequest); // 재요청
      } catch (e) {
        // refresh token도 만료: 로그아웃 등 처리
        // removeAccessToken(); removeRefreshToken(); 등
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

//응답 인터셉터: 토큰 만료 등 처리(옵션)
jwtAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 등 토큰 만료 시 처리 로직 추가 가능
    return Promise.reject(error);
  }
);

export default jwtAxios;