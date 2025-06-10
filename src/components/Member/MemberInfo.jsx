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
        console.log("data:", data)
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
      console.log("phonenumber:", phoneNumber)
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
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <div className="mb-2 font-bold text-lg">회원 정보 수정</div>
      <div className="mb-2">
        <span className="font-semibold">이메일:</span> {myInfo.email}
      </div>
      <div className="mb-2">
        <span className="font-semibold">이름:</span> {myInfo.lastName}{" "}
        {myInfo.firstName}
      </div>
      <div className="mb-2 flex items-center">
        <span className="font-semibold mr-2">전화번호:</span>
        <select
          name="phoneArea"
          value={form.phoneArea}
          onChange={handleChange}
          className="input input-bordered w-20 mr-1"
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
          className="input input-bordered w-16 mr-1"
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
          className="input input-bordered w-16"
          pattern="\d{4}"
          required
        />
      </div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          name="zipcode"
          value={form.zipcode}
          readOnly
          placeholder="우편번호"
          className="w-1/3 input input-bordered bg-gray-100"
        />
        <KakaoAddress onComplete={handleAddressComplete} />
      </div>
      <input
        type="text"
        name="addressMain"
        value={form.addressMain}
        readOnly
        placeholder="주소"
        className="w-full input input-bordered bg-gray-100 mb-2"
      />
      <input
        type="text"
        name="addressSub"
        value={form.addressSub}
        onChange={handleChange}
        placeholder="상세주소"
        className="w-full input input-bordered mb-2"
      />
      <button type="submit" className="w-full btn btn-primary">
        정보 수정
      </button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default MemberInfo;