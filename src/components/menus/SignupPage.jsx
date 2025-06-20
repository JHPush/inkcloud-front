import { useState } from "react";
import { registerMember } from "../../api/memberApi";
import { useLocation, useNavigate, Link } from "react-router-dom";
import KakaoAddress from "../Member/KakaoAddress";
import CommonSignup from "./CommonSignup";
import BasicLayout from "../../layouts/BasicLayout";

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
      setStep(3);
    } catch (err) {
      alert("회원가입에 실패했습니다");
    }
  };

  // 메인 컨텐츠
  const content = (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">InkCloud</h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-0.5 w-6 bg-gray-400"></div>
            <p className="text-gray-600 text-sm font-medium">{isAdmin ? "관리자 회원가입" : "회원가입"}</p>
            <div className="h-0.5 w-6 bg-gray-400"></div>
          </div>
        </div>

        {/* 메인 카드 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
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
                <div className="text-xs text-gray-500 mb-4">
                  <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      성
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      readOnly
                      className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                      placeholder="성"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      이름
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      readOnly
                      className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                      placeholder="이름"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                    placeholder="이메일"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                  <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={form.passwordCheck}
                    onChange={e => setForm({ ...form, passwordCheck: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                  {pwError && <div className="text-red-500 text-xs mt-1">{pwError}</div>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    전화번호 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      name="phoneArea"
                      value={form.phoneArea}
                      onChange={e => setForm({ ...form, phoneArea: e.target.value })}
                      className="rounded-md border border-gray-300 px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                      {phoneAreaCodes.map(code => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                    <span>-</span>
                    <input
                      type="text"
                      name="phoneMid"
                      value={form.phoneMid}
                      onChange={e => setForm({ ...form, phoneMid: e.target.value })}
                      maxLength={4}
                      className="rounded-md border border-gray-300 px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      pattern="\d{3,4}"
                      required
                    />
                    <span>-</span>
                    <input
                      type="text"
                      name="phoneLast"
                      value={form.phoneLast}
                      onChange={e => setForm({ ...form, phoneLast: e.target.value })}
                      maxLength={4}
                      className="rounded-md border border-gray-300 px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      pattern="\d{4}"
                      required
                    />
                  </div>
                </div>
                {!isAdmin && (
                  <div className="mb-4">
                    <div className="flex items-center mb-1">
                      <label className="block text-sm font-semibold text-gray-700">
                        주소 <span className="text-red-500">*</span>
                      </label>
                      <span className="ml-4">
                        <KakaoAddress
                          onComplete={({ zipcode, addressMain }) =>
                            setForm({ ...form, zipcode, addressMain })
                          }
                        />
                      </span>
                    </div>
                    <input
                      type="text"
                      value={form.zipcode}
                      readOnly
                      placeholder="우편번호"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 mb-2"
                    />
                    <input
                      type="text"
                      value={form.addressMain}
                      readOnly
                      placeholder="주소"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="상세주소"
                      value={form.addressSub}
                      onChange={e => setForm({ ...form, addressSub: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                )}
                <button type="submit" className="w-full py-3 mt-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">
                  회원가입 완료
                </button>
              </form>
            )}
            {step === 3 && (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-8 w-8 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  회원가입 완료
                </h3>
                <p className="text-gray-600 mb-6">
                  회원가입이 성공적으로 완료되었습니다.<br />
                  로그인 후 서비스를 이용해 주세요.
                </p>
                {isAdmin ? (
                  <Link
                    to="/admin/login"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    로그인 페이지로 이동
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    메인 페이지로 이동
                  </Link>
                )}
              </div>
            )}
          </div>
          {/* 하단 링크 */}
          {step === 1 && (
            <div className="bg-gray-50 px-6 py-4 flex justify-center border-t border-gray-200">
              <div className="text-sm">
                <span className="text-gray-600">이미 계정이 있으신가요?</span>
                <Link
                  to="/login"
                  className="ml-1 font-medium text-blue-600 hover:text-blue-500"
                >
                  로그인
                </Link>
              </div>
            </div>
          )}
        </div>
        {/* 북 아이콘 */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-1 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-xs font-medium">InkCloud Books © 2025</span>
          </div>
        </div>
      </div>
    </div>
  );

  // 관리자 회원가입이면 BasicLayout 없이, 일반 회원가입이면 BasicLayout으로 감싸기
  return isAdmin ? content : <BasicLayout>{content}</BasicLayout>;
};

export default SignupPage;