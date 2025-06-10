import VerifyEmail from "../Member/VerifyEmail";
import { useState } from "react";

const CommonSignup = ({ form, setForm, onVerified }) => {
    
  // 이메일 형식 체크 함수
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 이메일 인증 버튼 클릭 시 입력값 체크
  const handleTrySendEmail = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      alert("모든 항목을 입력해주세요.");
      return false;
    }
    if (!isValidEmail(form.email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return false;
    }
    return true;
  };

  // 이메일 인증 성공 시 호출될 콜백
  const handleEmailVerified = (email) => {
    setForm({ ...form, email });
    if (onVerified) onVerified(email);
  };

  return (
    <>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="성"
          value={form.lastName}
          onChange={e => setForm({ ...form, lastName: e.target.value })}
          className="flex-1 input input-bordered"
        />
        <input
          type="text"
          placeholder="이름"
          value={form.firstName}
          onChange={e => setForm({ ...form, firstName: e.target.value })}
          className="flex-1 input input-bordered"
        />
      </div>
      <VerifyEmail
        email={form.email}
        setEmail={email => setForm({ ...form, email })}
        onVerified={handleEmailVerified}
        onTrySend={handleTrySendEmail}
      />
    </>
  );
};

export default CommonSignup;