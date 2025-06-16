import { useEffect, useState } from "react";
import { getMyInfo, updateMyInfo } from "../../api/memberApi";
import KakaoAddress from "./KakaoAddress";

const phoneAreaCodes = ["010", "011", "016", "017", "018", "019"];

const MemberInfo = ({ onSuccess }) => {
  const [myInfo, setMyInfo] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await getMyInfo();
        // 전화번호를 3-4-4로 분리
        let area = "",
          mid = "",
          last = "";
        if (data.phoneNumber) {
          const match = data.phoneNumber.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
          if (match) {
            area = match[1];
            mid = match[2];
            last = match[3];
          }
        }
        setMyInfo(data);
        setForm({
          phoneArea: area || "010",
          phoneMid: mid || "",
          phoneLast: last || "",
          zipcode: data.zipcode || "",
          addressMain: data.addressMain || "",
          addressSub: data.addressSub || ""
        });
      } catch (err) {
        setError("회원 정보 조회 실패");
      }
    };
    fetchMyInfo();
  }, []);

  if (error) return <div>{error}</div>;
  if (!form) return <div>로딩중...</div>;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressComplete = ({ zipcode, addressMain }) => {
    setForm({ ...form, zipcode, addressMain });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      // 전화번호 합치기 (대시 없이)
      const phoneNumber = `${form.phoneArea}${form.phoneMid}${form.phoneLast}`;
      await updateMyInfo({
        ...form,
        phoneNumber // phoneNumber만 합쳐서 전달
      });
      window.alert("회원 정보가 수정되었습니다.");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log("회원 정보 수정 실패:", err);
      window.alert("회원 정보 수정에 실패했습니다");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full bg-white rounded-2xl p-0 flex flex-col"
      style={{ boxShadow: "none" }}
    >
      <div className="text-2xl font-bold text-blue-700 mb-6 text-center pt-10">회원 정보 수정</div>
      <div className="flex flex-col gap-0 mb-2 px-10">
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-28">이메일</span>
          <span className="text-gray-800">{myInfo.email}</span>
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-28">이름</span>
          <span className="text-gray-800">{myInfo.lastName} {myInfo.firstName}</span>
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-28">전화번호</span>
          <select
            name="phoneArea"
            value={form.phoneArea}
            onChange={handleChange}
            className="border rounded px-2 py-1 mr-1 bg-white"
          >
            {phoneAreaCodes.map(code => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <span className="mx-1">-</span>
          <input
            type="text"
            name="phoneMid"
            value={form.phoneMid}
            onChange={handleChange}
            maxLength={4}
            className="border rounded px-2 py-1 w-16 mr-1"
            pattern="\d{3,4}"
            required
          />
          <span className="mx-1">-</span>
          <input
            type="text"
            name="phoneLast"
            value={form.phoneLast}
            onChange={handleChange}
            maxLength={4}
            className="border rounded px-2 py-1 w-16"
            pattern="\d{4}"
            required
          />
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-28">우편번호</span>
          <input
            type="text"
            name="zipcode"
            value={form.zipcode}
            readOnly
            placeholder="우편번호"
            className="border rounded px-2 py-1 bg-gray-100 w-1/2 mr-4" // mr-4로 간격 추가
          />
          <KakaoAddress onComplete={handleAddressComplete} />
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-28">주소</span>
          <input
            type="text"
            name="addressMain"
            value={form.addressMain}
            readOnly
            placeholder="주소"
            className="border rounded px-2 py-1 bg-gray-100 flex-1"
          />
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-28">상세주소</span>
          <input
            type="text"
            name="addressSub"
            value={form.addressSub}
            onChange={handleChange}
            placeholder="상세주소"
            className="border rounded px-2 py-1 flex-1"
          />
        </div>
      </div>
      <div className="flex justify-end px-10 pb-10">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition"
        >
          정보 수정
        </button>
      </div>
      {success && <div className="text-green-600 mt-2 text-center">{success}</div>}
      {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
    </form>
  );
};

export default MemberInfo;