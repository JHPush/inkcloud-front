import { useState } from "react";
import KakaoAddress from "../KakaoAddress";

const phoneAreaCodes = ["010", "011", "016", "017", "018", "019"];

const ShippingForm = ({initialForm, onSubmit, submitLabel}) =>{
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // 연락처 분리 입력 상태
  const [contactArea, setContactArea] = useState(form.contact?.slice(0, 3) || "010");
  const [contactMid, setContactMid] = useState(form.contact?.slice(3, 7) || "");
  const [contactLast, setContactLast] = useState(form.contact?.slice(7) || "");

  // 연락처 입력 변경 핸들러
  const handleContactChange = (type, value) => {
    if (type === "area") setContactArea(value);
    if (type === "mid") setContactMid(value.replace(/\D/g, ""));
    if (type === "last") setContactLast(value.replace(/\D/g, ""));
    // 입력값 합쳐서 form.contact에 저장
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

  // 연락처 유효성 검사
  // const isValidPhone = () => {
  //   return (
  //     phoneAreaCodes.includes(contactArea) &&
  //     /^\d{3,4}$/.test(contactMid) &&
  //     /^\d{4}$/.test(contactLast)
  //   );
  // };

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
    setError("");
    setSuccess(false);

    try {
      await onSubmit(form);
      setSuccess(true);
    } catch (err) {
      setError("배송지 등록 실패");
    }
  };

  return(
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-4 bg-white rounded shadow flex flex-col gap-3"
      >
        <div>
          <label className="block mb-1 font-semibold">
            배송지 이름 <span className="text-xs text-gray-400">(필수 아님)</span>
          </label>
          <div className="flex gap-2 mb-1">
            <button
              type="button"
              className={`px-3 py-1 rounded-full border border-blue-400 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 transition`}
              onClick={() => handleQuickName("우리집")}
            >
              우리집
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-full border border-green-400 bg-green-50 text-green-700 text-xs font-semibold shadow-sm hover:bg-green-100 transition`}
              onClick={() => handleQuickName("회사")}
            >
              회사
            </button>
          </div>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="예) 우리집, 회사 등"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">
            수령인 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="receiver"
            value={form.receiver}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">
              우편번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="zipcode"
              value={form.zipcode}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              readOnly
            />
          </div>
          <KakaoAddress onComplete={handleAddressComplete} />
        </div>
        <div>
          <label className="block mb-1 font-semibold">
            주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="addressMain"
            value={form.addressMain}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">
            상세주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="addressSub"
            value={form.addressSub}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">
            연락처 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <select
              name="contactArea"
              value={contactArea}
              onChange={e => handleContactChange("area", e.target.value)}
              className="input input-bordered w-20"
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
              className="input input-bordered w-16"
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
              className="input input-bordered w-16"
              pattern="\d{4}"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          {submitLabel}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </>
  )
}
export default ShippingForm;