import { useState } from "react";
import { SendVerificationEmail, VerifyCode } from "../../api/memberApi";
import Countdown from "react-countdown";

const VerifyEmail = ({
  email,
  setEmail,
  onVerified,
  onTrySend,
  inputClassName = "",
  buttonClassName = ""
}) => {
    const [code, setCode] = useState("");
    const [success, setSuccess] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [expireTime, setExpireTime] = useState(null);

    // 인증메일 발송
    const handleSendCode = async () => {
        setError("");
        setVerified(false);
        if (onTrySend && onTrySend() === false) return;
        try { 
            await SendVerificationEmail(email);
            setSuccess(true);
            setExpireTime(Date.now() + 5 * 60 * 1000); // 타이머 시작 시점 고정
            window.alert("입력한 메일로 인증번호가 발송되었습니다. 5분 안에 인증번호를 입력해주세요.");
            // setTimerKey(prev => prev + 1); // 타이머 리셋
        } catch (err) {
            console.log("error:", err)
            if (err.response) {
                if (err.response.status === 409) {
                    setError("이미 가입된 회원입니다.");
                } else if (err.response.status === 403) {
                    setError("탈퇴 후 7일이 지나야 재가입할 수 있습니다.");
                } else {
                    setError("인증 메일 발송에 실패했습니다.");
                }
            } else {
                setError("인증 메일 발송에 실패했습니다.");
            }
        }
    };

    // 인증번호 확인
    const handleVerifyCode = async () => {
        setError("");
        setVerified(false);
        try {
            await VerifyCode(email, code);
            setVerified(true);
            if (onVerified) onVerified(email);
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
        <div className="flex flex-col gap-2">
            <div className="flex">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    disabled={success && !verified}
                    className={`flex-1 ${inputClassName}`}
                />
                {!success && (
                    <button
                        type="button"
                        onClick={handleSendCode}
                        className={buttonClassName}
                    >
                        인증하기
                    </button>
                )}
            </div>
            {/* 인증메일 전송 후 인증번호 입력 */}
            {success && !verified && (
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="ml-1 px-2 py-2 text-xs bg-gray-400 text-white rounded transition"
                            onClick={handleSendCode}
                        >
                            인증메일 재전송
                        </button>
                        {expireTime && (
                            <Countdown
                                date={expireTime}
                                renderer={timerRenderer}
                            />
                        )}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            placeholder="인증번호 입력"
                            className={`flex-1 ${inputClassName}`}
                        />
                        <button
                            type="button"
                            onClick={handleVerifyCode}
                            className={buttonClassName}
                        >확인</button>
                    </div>
                </div>
            )}
            {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
    );
};

export default VerifyEmail;