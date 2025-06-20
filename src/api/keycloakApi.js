import axios from 'axios';

// Keycloak OIDC 토큰 발급 함수
const KEYCLOAK_TOKEN_URL = process.env.REACT_APP_KEYCLOAK_TOKEN_URL;
const KEYCLOAK_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID;
const KEYCLOAK_CLIENT_SECRET = process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET;



// 함수 이름을 login으로 변경
export const login = async (username, password) => {

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', KEYCLOAK_CLIENT_ID);
  params.append('username', username); 
  params.append('password', password);
  // params.append('client_secret', KEYCLOAK_CLIENT_SECRET);



  try {
    const response = await axios.post(KEYCLOAK_TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return response.data; // access_token, refresh_token 등 포함  
    
  } catch (error) {
    throw new Error('Keycloak 인증 실패');
  }
};

//Refresh Token 요청
export const refreshToken = async (refreshToken) => {

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', KEYCLOAK_CLIENT_ID);
  params.append('refresh_token', refreshToken);
  // params.append('client_secret', KEYCLOAK_CLIENT_SECRET);

  try {
    const response = await axios.post(KEYCLOAK_TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return response.data;
    
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw new Error('Keycloak 토큰 갱신 실패');
  }
};