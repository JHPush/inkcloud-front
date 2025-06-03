import { useState } from "react";
import FindPassword from "../../components/Member/FindPassword";
import ChangePassword from "../../components/Member/ChangePassword";
import MemberLayout from "../../layouts/MemberLayout";

const ForgotPwdPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <MemberLayout>
      {step === 1 && (
        <FindPassword
          onSuccess={(email) => {
            setEmail(email);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <ChangePassword email={email} onSuccess={() => setStep(3)} />
      )}
      {step === 3 && (
        <div className="text-green-600 text-center mt-8">
          {/* 비밀번호가 성공적으로 변경되었습니다. */}
        </div>
      )}
    </MemberLayout>
  );
};

export default ForgotPwdPage;