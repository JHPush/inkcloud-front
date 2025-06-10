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
      window.alert("성, 이름, 이메일을 모두 입력해주세요.");
      return;
    }
    if (!isValidEmail(form.email)) {
      window.alert("올바른 이메일 형식이 아닙니다.");
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
      window.alert("메일로 비밀번호 재설정 인증번호가 발송되었습니다. 인증번호를 입력해주세요.");
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
    //   window.alert("인증이 완료되었습니다. 비밀번호를 재설정하세요.");
    } catch (err) {
      setError("인증번호가 올바르지 않습니다.");
    }
  };

  // 타이머 렌더러
  const timerRenderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <span style={{ color: "red", fontWeight: "bold" }}>00:00</span>;
    } else {
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      );
    }
  };

  return (
    <form onSubmit={handleSendCode} className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <div className="mb-2 font-bold text-lg">비밀번호 찾기</div>
      <input
        type="text"
        placeholder="성"
        value={form.lastName}
        onChange={e => setForm({ ...form, lastName: e.target.value })}
        className="w-full input input-bordered mb-2"
        disabled={emailSent && !verified}
      />
      <input
        type="text"
        placeholder="이름"
        value={form.firstName}
        onChange={e => setForm({ ...form, firstName: e.target.value })}
        className="w-full input input-bordered mb-2"
        disabled={emailSent && !verified}
      />
      <input
        type="email"
        placeholder="이메일"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="w-full input input-bordered mb-2"
        disabled={emailSent && !verified}
      />
      <button
        type="submit"
        className="w-full btn btn-primary"
        style={{ display: emailSent && !verified ? "none" : "block" }}
        disabled={emailSent && !verified}
      >
        확인
      </button>
      {/* 이메일 전송 성공 & 인증 전이면 재전송 버튼 노출 */}
      {emailSent && !verified && (
        <button
          type="button"
          className="w-full btn btn-outline mt-2"
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
        <div style={{ marginTop: 10 }}>
          {/* 타이머 */}
          <div style={{ marginBottom: 8 }}>
            <Countdown
              key={timerKey}
              date={Date.now() + 5 * 60 * 1000}
              renderer={timerRenderer}
            />
          </div>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="인증번호 입력"
            className="input input-bordered mb-2"
          />
          <button
            type="button"
            onClick={handleVerifyCode}
            className="btn btn-secondary ml-2">
            확인
          </button>
        </div>
      )}
      {verified && (
        <div style={{ color: "blue", marginTop: 10 }}>
          
        </div>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default FindPassword;