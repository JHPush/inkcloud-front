import { useState } from "react";
import { login } from "../../api/keycloakApi";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "../../utils/cookieUtils";

const VerifyPassword = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 토큰에서 이메일 추출
  const token = getAccessToken();
  let email = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded.email || decoded.preferred_username;
    } catch {
      email = "";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("비밀번호를 입력하세요.");
      return;
    }
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center"
      >
        <div className="text-2xl font-bold mb-6 text-blue-700">비밀번호 재확인</div>
        <div className="mb-4 text-gray-600 text-center">
          회원정보 수정 전 보안을 위해<br />비밀번호를 재확인합니다.
        </div>
        <div className="mb-4 w-full flex items-center justify-center">
          <span className="text-gray-500 text-sm">이메일:&nbsp;</span>
          <span className="font-semibold text-gray-800">{email}</span>
        </div>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          확인
        </button>
        {error && <div className="text-red-600 mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default VerifyPassword;