import { useState } from "react";
import MemberInfo from "../../components/Member/MemberInfo";
import ChangePassword from "../../components/Member/ChangePassword";
import VerifyPassword from "../../components/Member/VerifyPassword";

const MyInfoPage = () => {
  const [verified, setVerified] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // 비밀번호 검증 전에는 VerifyPassword만 보여줌
  if (!verified) {
    return (
  
        <VerifyPassword onSuccess={() => setVerified(true)} />
     
    );
  }

  return ( 
<>
      {/* <div className="text-3xl mb-4">My Page</div> */}
      <div className="flex gap-4 mb-6">
        <button className="btn btn-outline" onClick={() => {setShowInfo(true); setShowPwd(false);}}>
          내 정보 수정
        </button>
        <button className="btn btn-outline" onClick={() => {setShowPwd(true); setShowInfo(false);}}>
          비밀번호 변경
        </button>
      </div>
      {showInfo && <MemberInfo onSuccess={() => setShowInfo(false)} />}
      {showPwd && <ChangePassword onSuccess={() => setShowPwd(false)} />}
</>
  );
}

export default MyInfoPage;
