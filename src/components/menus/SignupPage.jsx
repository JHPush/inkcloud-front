import React, { useState } from "react";
import { registerMember } from "../../api/memberApi";
import { useLocation, useNavigate } from "react-router-dom";
import KakaoAddress from "../Member/KakaoAddress";
import CommonSignup from "./CommonSignup";

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //const isAdmin = location.pathname.includes("/admin");
  const isAdmin = location.pathname === "/signup/admin";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    zipcode: "",
    addressMain: "",
    addressSub: "",
    role: isAdmin ? "ADMIN" : "USER"
  });

  // 회원가입 제출
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await registerMember(form);
      window.alert(`${isAdmin ? "관리자" : ""} 회원가입이 완료되었습니다!`);
      navigate("/");
    } catch (err) {
      alert("회원가입에 실패했습니다");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>{isAdmin ? "관리자 회원가입" : "회원가입"}</h2>
      {step === 1 && (
        <CommonSignup
          form={form}
          setForm={setForm}
          onVerified={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <form
          onSubmit={e => {
            e.preventDefault();
            // 필수 입력값 체크
            if (
              !form.password.trim() ||
              !form.phoneNumber.trim() ||
              (!isAdmin && (!form.zipcode.trim() || !form.addressMain.trim()))
            ) {
              alert("모든 항목을 입력해주세요.");
              return;
            }
            handleSignup(e);
          }}
        >
          <div className="flex gap-2 mb-2">
            <input type="text" value={form.lastName} readOnly className="flex-1 input input-bordered bg-gray-100" placeholder="성" />
            <input type="text" value={form.firstName} readOnly className="flex-1 input input-bordered bg-gray-100" placeholder="이름" />
          </div>
          <input type="email" value={form.email} readOnly className="w-full input input-bordered bg-gray-100 mb-2" placeholder="이메일" />
          <input type="password" placeholder="비밀번호" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full input input-bordered mb-2" />
          <input type="text" placeholder="전화번호" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="w-full input input-bordered mb-2" />
          {!isAdmin && (
            <>
              <KakaoAddress
                onComplete={({ zipcode, addressMain }) =>
                  setForm({ ...form, zipcode, addressMain })
                }
              />
              <input type="text" value={form.zipcode} readOnly placeholder="우편번호" />
              <input type="text" value={form.addressMain} readOnly placeholder="주소" />
              <input type="text" placeholder="상세주소" value={form.addressSub} onChange={e => setForm({ ...form, addressSub: e.target.value })} className="w-full input input-bordered mb-2" />

            </>
          )}
          <button type="submit" className="w-full btn btn-primary">회원가입 완료</button>
        </form>
      )}
      {step === 3 && (
        <div style={{ color: "green" }}>회원가입이 완료되었습니다!</div>
      )}
    </div>
  );
};

export default SignupPage;