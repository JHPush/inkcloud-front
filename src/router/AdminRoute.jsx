import { useLocation, Navigate } from "react-router-dom";
import { getAccessToken } from "../utils/cookieUtils";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {
  const token = getAccessToken();
  const location = useLocation();

  // 1. 토큰 없으면 /login 또는 /admin/login으로 이동
  if (!token) {
    console.log("[AdminRoute] No token, redirecting to login");
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // 2. 토큰이 있는데 admin이 아니면 접근 제한 안내
  let isAdmin = false;
  let decoded = null;
  try {
    decoded = jwtDecode(token);
    isAdmin =
      decoded &&
      decoded.realm_access &&
      Array.isArray(decoded.realm_access.roles) &&
      decoded.realm_access.roles.includes("ADMIN");
    // console.log("[AdminRoute] Decoded token:", decoded);
    // console.log("[AdminRoute] isAdmin:", isAdmin);
  } catch (e) {
    // console.log("[AdminRoute] Token decode error:", e);
    return <Navigate to="/admin/login" replace />;
  }

  if (location.pathname.startsWith("/admin") && !isAdmin) {
    // 접근 제한 안내 페이지 또는 메시지
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">접근 제한</h2>
          <p className="mb-4 text-gray-700">
            관리자만 접근 가능한 페이지입니다.
          </p>
          <a
            href="/"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            메인으로 이동
          </a>
        </div>
      </div>
    );
  }

  return children;
}