import { useState } from "react";
import { Link } from "react-router-dom";
import FindPassword from "../../components/Member/FindPassword";
import ChangePassword from "../../components/Member/ChangePassword";
import MemberLayout from "../../layouts/MemberLayout";

const ForgotPwdPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <MemberLayout>
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* 로고 및 제목 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">InkCloud</h1>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-0.5 w-6 bg-gray-400"></div>
              <p className="text-gray-600 text-sm font-medium">비밀번호 찾기</p>
              <div className="h-0.5 w-6 bg-gray-400"></div>
            </div>
          </div>

          {/* 메인 카드 */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* 단계 표시기 */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                    } mb-1`}
                  >
                    1
                  </div>
                  <span className="text-xs text-gray-600">이메일</span>
                </div>

                <div
                  className={`flex-1 h-1 mx-2 ${
                    step >= 2 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
                    } mb-1`}
                  >
                    2
                  </div>
                  <span className="text-xs text-gray-600">재설정</span>
                </div>

                <div
                  className={`flex-1 h-1 mx-2 ${
                    step >= 3 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
                    } mb-1`}
                  >
                    3
                  </div>
                  <span className="text-xs text-gray-600">완료</span>
                </div>
              </div>
            </div>

            {/* 단계별 컨텐츠 */}
            <div className="p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    이메일 인증
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    가입하신 이메일 주소를 입력하시면 비밀번호 재설정 안내를
                    보내드립니다.
                  </p>
                  <FindPassword
                    onSuccess={(email) => {
                      setEmail(email);
                      setStep(2);
                    }}
                  />
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    새 비밀번호 설정
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    {email}로 전송된 인증번호를 입력하신 후 새로운 비밀번호를
                    설정해주세요.
                  </p>
                  <ChangePassword email={email} onSuccess={() => setStep(3)} />
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-8">
                  {/* 성공 아이콘 */}
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
                    비밀번호 변경 완료
                  </h3>
                  <p className="text-gray-600 mb-6">
                    비밀번호가 성공적으로 변경되었습니다.
                    <br />
                    새 비밀번호로 로그인해 주세요.
                  </p>

                  <Link
                    to="/login"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    로그인 페이지로 이동
                  </Link>
                </div>
              )}
            </div>

            {/* 하단 링크 */}
            <div className="bg-gray-50 px-6 py-4 flex justify-center border-t border-gray-200">
              <div className="text-sm">
                <span className="text-gray-600">계정이 없으신가요?</span>
                <Link
                  to="/signup"
                  className="ml-1 font-medium text-blue-600 hover:text-blue-500"
                >
                  회원가입
                </Link>
              </div>
            </div>
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
    </MemberLayout>
  );
};

export default ForgotPwdPage;