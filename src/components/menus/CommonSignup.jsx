import VerifyEmail from "../Member/VerifyEmail";

const CommonSignup = ({ form, setForm, onVerified }) => {
  // 이메일 형식 체크 함수
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 이메일 인증 버튼 클릭 시 입력값 체크
  const handleTrySendEmail = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      alert("모든 항목을 입력해주세요.");
      return false;
    }
    if (!isValidEmail(form.email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return false;
    }
    return true;
  };

  // 이메일 인증 성공 시 호출될 콜백
  const handleEmailVerified = (email) => {
    setForm({ ...form, email });
    if (onVerified) onVerified(email);
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            성 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="성을 입력하세요"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            autoComplete="family-name"
            required
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            autoComplete="given-name"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          이메일 <span className="text-red-500">*</span>
        </label>
        <VerifyEmail
          email={form.email}
          setEmail={(email) => setForm({ ...form, email })}
          onVerified={onVerified}
          onTrySend={handleTrySendEmail}
          inputClassName="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          buttonClassName="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        />
      </div>
    </div>
  );
};

export default CommonSignup;