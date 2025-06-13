import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../api/keycloakApi';
import { setLogin } from '../../store/loginSlice';
import { setAccessToken, setRefreshToken} from '../../utils/cookieUtils';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const tokenData = await login(email, password);
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

      const user = {
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        role
      };

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
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center min-h-fit px-0 py-10 rounded-lg">
      <div className="sm:mx-auto sm:w-full sm:max-w-xs mt-4">
        <div className="bg-white rounded-lg px-5 py-4 shadow">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">InkCloud</h2>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="h-0.5 w-6 bg-gray-400"></div>
            <p className="text-gray-600 text-sm font-medium">로그인</p>
            <div className="h-0.5 w-6 bg-gray-400"></div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : '로그인'}
              </button>
            </div>
          </form>
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/forgot"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                비밀번호 찾기
              </Link>
            </div>
            
            <div className="mt-6 flex items-center justify-center">
              <div className="text-sm">
                <span className="text-gray-500">계정이 없으신가요?</span>
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 mb-3 text-center">
        <div className="flex justify-center items-center space-x-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs font-medium">InkCloud Books © 2025</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;