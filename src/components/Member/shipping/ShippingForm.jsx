import { useState } from "react";
import KakaoAddress from "../KakaoAddress";

const phoneAreaCodes = ["010", "011", "016", "017", "018", "019"];

const ShippingForm = ({ initialForm, onSubmit, submitLabel }) => {
  const [form, setForm] = useState(initialForm);

  // 연락처 분리 입력 상태
  const [contactArea, setContactArea] = useState(form.contact?.slice(0, 3) || "010");
  const [contactMid, setContactMid] = useState(form.contact?.slice(3, 7) || "");
  const [contactLast, setContactLast] = useState(form.contact?.slice(7) || "");

  // 연락처 입력 변경 핸들러
  const handleContactChange = (type, value) => {
    if (type === "area") setContactArea(value);
    if (type === "mid") setContactMid(value.replace(/\D/g, ""));
    if (type === "last") setContactLast(value.replace(/\D/g, ""));
    setForm(prev => ({
      ...prev,
      contact:
        type === "area"
          ? value + contactMid + contactLast
          : type === "mid"
            ? contactArea + value.replace(/\D/g, "") + contactLast
            : contactArea + contactMid + value.replace(/\D/g, "")
    }));
  };

  // 카카오 주소 검색 완료 시
  const handleAddressComplete = ({ zipcode, addressMain }) => {
    setForm((prev) => ({
      ...prev,
      zipcode,
      addressMain,
    }));
  };

  // 폼 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 배송지명 빠른 입력 버튼
  const handleQuickName = (name) => {
    setForm((prev) => ({
      ...prev,
      name,
    }));
  };

  // 배송지 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form); // 성공 시 부모에서 처리
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full bg-white rounded-2xl p-0 flex flex-col"
      style={{ boxShadow: "none" }}
    >
      <div className="text-2xl font-bold text-blue-700 mb-6 text-center pt-10">
         {submitLabel}
      </div>
      <div className="flex flex-col gap-0 mb-2 px-10">
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-32">배송지 이름</span>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
              placeholder="예) 우리집, 회사 등"
            />
            <button
              type="button"
              className="px-3 py-1 rounded-full border border-blue-400 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 transition"
              onClick={() => handleQuickName("우리집")}
            >
              우리집
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-full border border-green-400 bg-green-50 text-green-700 text-xs font-semibold shadow-sm hover:bg-green-100 transition"
              onClick={() => handleQuickName("회사")}
            >
              회사
            </button>
          </div>
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-32">수령인<span className="text-red-500">*</span></span>
          <input
            type="text"
            name="receiver"
            value={form.receiver}
            onChange={handleChange}
            className="border rounded px-2 py-1 flex-1"
            required
          />
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-32">우편번호<span className="text-red-500">*</span></span>
          <input
            type="text"
            name="zipcode"
            value={form.zipcode}
            onChange={handleChange}
            className="border rounded px-2 py-1 bg-gray-100 w-1/2 mr-4"
            required
            readOnly
          />
          <KakaoAddress onComplete={handleAddressComplete} />
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-32">주소<span className="text-red-500">*</span></span>
          <input
            type="text"
            name="addressMain"
            value={form.addressMain}
            onChange={handleChange}
            className="border rounded px-2 py-1 bg-gray-100 flex-1"
            required
            readOnly
          />
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-32">상세주소</span>
          <input
            type="text"
            name="addressSub"
            value={form.addressSub}
            onChange={handleChange}
            className="border rounded px-2 py-1 flex-1"
          />
        </div>
        <div className="border-b border-gray-200" />
        <div className="mb-3 flex items-center min-h-[48px]">
          <span className="font-semibold text-gray-600 w-32">연락처<span className="text-red-500">*</span></span>
          <div className="flex items-center gap-2 flex-1">
            <select
              name="contactArea"
              value={contactArea}
              onChange={e => handleContactChange("area", e.target.value)}
              className="border rounded px-2 py-1 w-20"
              required
            >
              {phoneAreaCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <span>-</span>
            <input
              type="text"
              name="contactMid"
              value={contactMid}
              onChange={e => handleContactChange("mid", e.target.value)}
              maxLength={4}
              className="border rounded px-2 py-1 w-16"
              pattern="\d{3,4}"
              required
            />
            <span>-</span>
            <input
              type="text"
              name="contactLast"
              value={contactLast}
              onChange={e => handleContactChange("last", e.target.value)}
              maxLength={4}
              className="border rounded px-2 py-1 w-16"
              pattern="\d{4}"
              required
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end px-10 pb-10">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition"
        >
          {submitLabel}
        </button>
      </div>
      {/* {success && <div className="text-green-600 mt-2 text-center">저장되었습니다.</div>} */}
    </form>
  );
};

export default ShippingForm;