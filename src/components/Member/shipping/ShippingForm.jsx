import { useState } from "react";
import KakaoAddress from "../KakaoAddress";

const ShippingForm = ({initialForm, onSubmit, submitLabel}) =>{
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
  
    // 배송지 등록
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess(false);
      try {
        await onSubmit(form);
        setSuccess(true);
      } catch (err) {
        console.log("배송지 등록 실패:",err)
      }
    };
    return(
        <>
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow flex flex-col gap-3"
    >
      <div>
        <label className="block mb-1 font-semibold">배송지명</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">수령인</label>
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
          <label className="block mb-1 font-semibold">우편번호</label>
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
        <label className="block mb-1 font-semibold">주소</label>
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
        <label className="block mb-1 font-semibold">상세주소</label>
        <input
          type="text"
          name="addressSub"
          value={form.addressSub}
          onChange={handleChange}
          className="input input-bordered w-full"

        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">연락처</label>
        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-2">
    {submitLabel}
      </button>
      {/* {success && (
        <div className="text-green-600 mt-2">배송지 등록이 완료되었습니다.</div>
      )} */}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
        </>
    )
}
export default ShippingForm;