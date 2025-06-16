import { useState } from "react";
import { requestPwdCode, verifyPwdCode } from "../../api/memberApi";
import Countdown from "react-countdown";

const FindPassword = ({ onSuccess }) => {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: ""
  });
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // 타이머 재시작용

  // 이메일 형식 체크 함수
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 인증메일 발송
  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!form.lastName.trim() || !form.firstName.trim() || !form.email.trim()) {
      setError("성, 이름, 이메일을 모두 입력해주세요.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const cleanEmail = form.email.trim();
      const cleanFirstName = form.firstName.trim();
      const cleanLastName = form.lastName.trim();
      await requestPwdCode({
        email: cleanEmail,
        firstName: cleanFirstName,
        lastName: cleanLastName
      });
      setEmailSent(true);
      setError("");
      setTimerKey(prev => prev + 1); // 타이머 리셋
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("탈퇴한 회원입니다.");
      } else if (err.response && err.response.status === 400) {
        if (err.response.data === "이름 또는 이메일이 일치하지 않습니다.") {
          setError("이름 또는 이메일이 일치하지 않습니다.");
        } else if (err.response.data === "존재하지 않는 회원입니다.") {
          setError("존재하지 않는 회원입니다.");
        }
      } else {
        setError("인증 메일 발송에 실패했습니다.");
      }
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    setError("");
    try {
      await verifyPwdCode({
        email: form.email,
        code
      });
      setVerified(true);
      if (onSuccess) onSuccess(form.email);
    } catch (err) {
      setError("인증번호가 올바르지 않습니다.");
    }
  };

  // 타이머 렌더러
  const timerRenderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <span className="text-red-500 font-bold">00:00</span>;
    } else {
      return (
        <span className="text-red-500 font-bold">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <form
        onSubmit={handleSendCode}
        className="w-full max-w-2xl bg-white rounded-2xl p-12 flex flex-col gap-4"
        style={{ boxShadow: "none" }}
      >
        <div className="flex flex-col gap-0 mb-2">
          <div className="mb-3 flex items-center min-h-[48px]">
            <span className="font-semibold text-gray-600 w-28">성</span>
            <input
              type="text"
              placeholder="성을 입력하세요"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              className="border rounded px-2 py-1 flex-1"
              disabled={emailSent && !verified}
            />
          </div>
          <div className="border-b border-gray-200" />
          <div className="mb-3 flex items-center min-h-[48px]">
            <span className="font-semibold text-gray-600 w-28">이름</span>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              className="border rounded px-2 py-1 flex-1"
              disabled={emailSent && !verified}
            />
          </div>
          <div className="border-b border-gray-200" />
          <div className="mb-3 flex items-center min-h-[48px]">
            <span className="font-semibold text-gray-600 w-28">이메일</span>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="border rounded px-2 py-1 flex-1"
              disabled={emailSent && !verified}
            />
          </div>
          <div className="border-b border-gray-200" />
        </div>
        {!emailSent || verified ? (
          <button
            type="submit"
            className="w-full px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition"
            disabled={emailSent && !verified}
          >
            확인
          </button>
        ) : null}
        {/* 이메일 전송 성공 & 인증 전이면 재전송 버튼 노출 */}
        {emailSent && !verified && (
          <button
            type="button"
            className="w-full px-5 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold text-base hover:bg-blue-200 transition mt-2"
            onClick={e => {
              setError("");
              setCode("");
              setEmailSent(true);
              setVerified(false);
              handleSendCode(e);
            }}
          >
            인증메일 재전송
          </button>
        )}
        {emailSent && !verified && (
          <div className="mt-4 flex flex-col items-center">
            <div className="mb-2">
              <Countdown
                key={timerKey}
                date={Date.now() + 5 * 60 * 1000}
                renderer={timerRenderer}
              />
            </div>
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="인증번호 입력"
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition"
              >
                확인
              </button>
            </div>
          </div>
        )}
        {verified && (
          <div className="text-blue-600 mt-4 text-center font-semibold">
            인증이 완료되었습니다. 비밀번호를 재설정하세요.
          </div>
        )}
        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default FindPassword;