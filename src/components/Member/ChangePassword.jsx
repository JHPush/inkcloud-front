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
    <form
      onSubmit={handleSubmit}
      className="w-full h-full bg-white rounded-2xl p-0 flex flex-col"
      style={{ boxShadow: "none" }}
    >
      {/* <div className="text-2xl font-bold text-blue-700 mb-6 text-center pt-10">
        {email ? "비밀번호 재설정" : ""}
      </div> */}
      <div className="flex flex-col gap-0 mb-2 px-10">
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-32">새 비밀번호</span>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="border rounded px-2 py-1 w-80" 
          />
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-32">비밀번호 확인</span>
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="border rounded px-2 py-1 w-80" 
          />
        </div>
        <div className="border-b border-gray-200" />
        <div className="text-xs text-gray-500 mt-2 mb-2 pl-1">
          비밀번호는 <span className="font-semibold">8자 이상</span>이며, <span className="font-semibold">대소문자</span>, <span className="font-semibold">숫자</span>, <span className="font-semibold">특수문자</span>를 모두 포함해야 합니다.
        </div>
      </div>
      <div className="flex justify-end px-10 pb-10">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition"
        >
          확인
        </button>
      </div>
      {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
    </form>
  );
}

export default ChangePassword;