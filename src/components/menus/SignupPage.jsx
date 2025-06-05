import React, { useState } from "react";
import { registerMember } from "../../api/memberApi";
import { useLocation, useNavigate } from "react-router-dom";
import KakaoAddress from "../Member/KakaoAddress";
import CommonSignup from "./CommonSignup";

const phoneAreaCodes = ["010", "011", "016", "017", "018", "019"];

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === "/admin/signup";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordCheck: "",
    phoneArea: "010",
    phoneMid: "",
    phoneLast: "",
    zipcode: "",
    addressMain: "",
    addressSub: "",
    role: isAdmin ? "ADMIN" : "USER"
  });
  const [pwError, setPwError] = useState("");

  // 비밀번호 유효성 검사 함수
  const validatePassword = (pw) => {
    // 8자 이상, 대소문자, 숫자, 특수문자
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(pw);
  };

  // 회원가입 제출
  const handleSignup = async (e) => {
    e.preventDefault();
    setPwError("");
    // 비밀번호 유효성 체크
    if (!validatePassword(form.password)) {
      setPwError("비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
      return;
    }
    // 비밀번호 확인 체크
    if (form.password !== form.passwordCheck) {
      setPwError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    try {
      // 전화번호 합치기 (대시 없이)
      const phoneNumber = `${form.phoneArea}${form.phoneMid}${form.phoneLast}`;
      await registerMember({ ...form, phoneNumber });
      window.alert(`${isAdmin ? "관리자" : ""} 회원가입이 완료되었습니다!`);
      if (isAdmin) {
        navigate("/login");
      } else {
        navigate("/");
      }
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
              !form.passwordCheck.trim() ||
              !form.phoneMid.trim() ||
              !form.phoneLast.trim() ||
              (!isAdmin && (!form.zipcode.trim() || !form.addressMain.trim()))
            ) {
              alert("모든 필수 항목을 입력해주세요.");
              return;
            }
            handleSignup(e);
          }}
        >
                <div className="text-xs text-gray-500 mb-2">
        <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
      </div>
          <div className="flex gap-2 mb-2">
            <input type="text" value={form.lastName} readOnly className="flex-1 input input-bordered bg-gray-100" placeholder="성" />
            <input type="text" value={form.firstName} readOnly className="flex-1 input input-bordered bg-gray-100" placeholder="이름" />
          </div>
          <input type="email" value={form.email} readOnly className="w-full input input-bordered bg-gray-100 mb-2" placeholder="이메일" />
          <div className="mb-2">
            <label className="block font-semibold mb-1">
              비밀번호 <span className="text-red-500">*</span>
              <span className="block text-xs text-gray-500 mt-1">
                (8자 이상, 대소문자, 숫자, 특수문자 포함)
              </span>
            </label>
            <input
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full input input-bordered mb-2"
              required
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={form.passwordCheck}
              onChange={e => setForm({ ...form, passwordCheck: e.target.value })}
              className="w-full input input-bordered mb-2"
              required
            />
            {pwError && <div className="text-red-500 text-xs">{pwError}</div>}
          </div>
          <div className="mb-2 flex items-center">
            <span className="font-semibold mr-2">전화번호 <span className="text-red-500">*</span></span>
            <select
              name="phoneArea"
              value={form.phoneArea}
              onChange={e => setForm({ ...form, phoneArea: e.target.value })}
              className="input input-bordered w-20 mr-1"
            >
              {phoneAreaCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <span className="mx-1">-</span>
            <input
              type="text"
              name="phoneMid"
              value={form.phoneMid}
              onChange={e => setForm({ ...form, phoneMid: e.target.value })}
              maxLength={4}
              className="input input-bordered w-16 mr-1"
              pattern="\d{3,4}"
              required
            />
            <span className="mx-1">-</span>
            <input
              type="text"
              name="phoneLast"
              value={form.phoneLast}
              onChange={e => setForm({ ...form, phoneLast: e.target.value })}
              maxLength={4}
              className="input input-bordered w-16"
              pattern="\d{4}"
              required
            />
          </div>
          {!isAdmin && (
            <>
              <div className="mb-2">
                <label className="block font-semibold text-sm">
                  주소 <span className="text-red-500">*</span>
                </label>
                <KakaoAddress
                  onComplete={({ zipcode, addressMain }) =>
                    setForm({ ...form, zipcode, addressMain })
                  }
                />
                <input type="text" value={form.zipcode} readOnly placeholder="우편번호" className="w-full input input-bordered bg-gray-100 mb-2" />
                <input type="text" value={form.addressMain} readOnly placeholder="주소" className="w-full input input-bordered bg-gray-100 mb-2" />
                <input type="text" placeholder="상세주소" value={form.addressSub} onChange={e => setForm({ ...form, addressSub: e.target.value })} className="w-full input input-bordered mb-2" />

              </div>
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