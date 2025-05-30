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