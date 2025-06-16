import { useState } from "react";
import MemberInfo from "../../components/Member/MemberInfo";
import ChangePassword from "../../components/Member/ChangePassword";
import VerifyPassword from "../../components/Member/VerifyPassword";

const MyInfoPage = () => {
  const [verified, setVerified] = useState(false);
  // showInfo를 true로 초기화하여 "내 정보 수정"이 기본 선택되도록 함
  const [showInfo, setShowInfo] = useState(true);
  const [showPwd, setShowPwd] = useState(false);

  // 비밀번호 검증 전에는 VerifyPassword만 보여줌
  if (!verified) {
    return (
      <VerifyPassword onSuccess={() => setVerified(true)} />
    );
  }

  return ( 
    <>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition border-2
            ${showInfo
              ? "bg-blue-600 text-white border-blue-600 shadow"
              : "bg-white text-blue-600 border-blue-400 hover:bg-blue-50"}
          `}
          onClick={() => { setShowInfo(true); setShowPwd(false); }}
        >
          내 정보 수정
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition border-2
            ${showPwd
              ? "bg-blue-600 text-white border-blue-600 shadow"
              : "bg-white text-blue-600 border-blue-400 hover:bg-blue-50"}
          `}
          onClick={() => { setShowPwd(true); setShowInfo(false); }}
        >
          비밀번호 변경
        </button>
      </div>
      {showInfo && <MemberInfo onSuccess={() => setShowInfo(true)} />}
      {showPwd && <ChangePassword onSuccess={() => { setShowInfo(true); setShowPwd(false); }} />}
    </>
  );
}

export default MyInfoPage;
