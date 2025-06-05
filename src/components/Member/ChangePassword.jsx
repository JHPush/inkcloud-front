import { useState } from "react";
import { changePassword, resetPassword } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ onSuccess, email }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 비밀번호 정책: 8자 이상, 대소문자, 숫자, 특수문자 포함
  const validatePassword = (pw) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(pw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("비밀번호를 입력하세요.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setError("비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
      return;
    }
    if (!confirmPassword) {
      setError("비밀번호 확인을 입력하세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      if (email) {
        // 비밀번호 재설정(이메일로)
        await resetPassword({ email, password: newPassword });
        window.alert("비밀번호가 재설정되었습니다.");
        navigate("/");
      } else {
        // 내 정보에서 비밀번호 변경(JWT)
        await changePassword({ newPassword });
        window.alert("비밀번호가 변경되었습니다.");
        navigate("/mypage");
      }
      setNewPassword("");
      setConfirmPassword("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log("비밀번호 변경 실패:", err);
      setError("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <div className="mb-2 font-bold text-lg">{email ? "비밀번호 재설정" : "비밀번호 변경"}</div>
      <div className="text-xs text-gray-500 mb-2">
        비밀번호는 <span className="font-semibold">8자 이상</span>이며, <span className="font-semibold">대소문자</span>, <span className="font-semibold">숫자</span>, <span className="font-semibold">특수문자</span>를 모두 포함해야 합니다.
      </div>
      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="w-full input input-bordered mb-2"

      />
      <input
        type="password"
        placeholder="새 비밀번호 확인"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        className="w-full input input-bordered mb-2"

      />
      <button type="submit" className="w-full btn btn-primary">확인</button>
      {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default ChangePassword;