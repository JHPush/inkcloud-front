import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../api/keycloakApi';
import { setLogin } from '../../store/loginSlice';
import { setAccessToken, setRefreshToken} from '../../utils/cookieUtils';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const tokenData = await login(email, password); // tokenData.access_token, tokenData.refresh_token
      setAccessToken(tokenData.access_token);
      setRefreshToken(tokenData.refresh_token);

      // JWT 토큰 디코딩
      const decoded = jwtDecode(tokenData.access_token);

      // role 추출
      let role = null;
      if (decoded.realm_access && Array.isArray(decoded.realm_access.roles)) {
        if (decoded.realm_access.roles.includes("ADMIN")) {
          role = "ADMIN";
        } else if (decoded.realm_access.roles.includes("USER")) {
          role = "USER";
        }
      }
      console.log("role:", role)

      const user = {
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        role
      };

      console.log("user:", user)
      dispatch(setLogin({
        isLoggedIn: true,
        user
      }));

      if (user.role === "USER") {
        navigate('/');
      } else if (user.role === "ADMIN") {
        navigate('/admin');
      } else {
        // 권한 없음 또는 기타 처리
        setError('권한이 없습니다.');
      }
    } catch (err) {
      setError('로그인에 실패했습니다.');
    }
  };



  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>
            이메일
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            비밀번호
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>
        )}
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          로그인
        </button>
        <button type="button" onClick={()=>{navigate('/forgot')}} style={{ width: '100%', padding: 10 }}>
          비밀번호 찾기
        </button>
      </form>
    </div>
  );
};

export default LoginPage;