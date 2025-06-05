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
      console.log("email:", email)
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <div className="mb-2 font-bold text-lg">비밀번호 재확인</div>
      <h2>회원정보 수정 전 보안을 위해 비밀번호를 재확인합니다.</h2>
      <div className="mb-2">이메일: {email}</div>
      <input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full input input-bordered mb-2"
      />
      <button type="submit" className="w-full btn btn-primary">확인</button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default VerifyPassword;