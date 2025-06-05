import Cookies from 'js-cookie';

// accessToken 저장
export const setAccessToken = (token, options = { expires: 1 }) => {
  Cookies.set('access_token', token, options);
};

// accessToken 가져오기
export const getAccessToken = () => {
  return Cookies.get('access_token');
};

// accessToken 삭제
export const removeAccessToken = () => {
  Cookies.remove('access_token');
};

// refreshToken 저장
export const setRefreshToken = (token, options = { expires: 7 }) => {
  Cookies.set('refresh_token', token, options);
};

// refreshToken 가져오기
export const getRefreshToken = () => {
  return Cookies.get('refresh_token');
  
};

// refreshToken 삭제
export const removeRefreshToken = () => {
  Cookies.remove('refresh_token');
};