import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../api/memberApi';
import { setLogin, logout } from '../../store/loginSlice';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const tokenData = await login(email, password);
      Cookies.set('access_token', tokenData.access_token, { expires: 1 });
      dispatch(setLogin({
        isLoggedIn: true,
        accessToken: tokenData.access_token,
        user: email
      }));
      navigate('/');
    } catch (err) {
      setError('로그인에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    dispatch(logout());
    setEmail('');
    setPassword('');
    setError('');
    navigate('/login');
  };

  if (isLoggedIn) {
    return (
      <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
        <h2>로그아웃</h2>
        <button onClick={handleLogout} style={{ width: '100%', padding: 10, background: '#f87171', color: 'white', border: 'none', borderRadius: 4 }}>
          로그아웃
        </button>
      </div>
    );
  }

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
      </form>
    </div>
  );
};

export default LoginPage;