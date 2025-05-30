import { useEffect, useState } from "react";
import { getMyInfo, updateMyInfo } from "../../api/memberApi";
import KakaoAddress from "./KakaoAddress";

const MemberInfo = ({onSuccess}) => {
  const [myInfo, setMyInfo] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await getMyInfo();
        setMyInfo(data);
        setForm({
          phoneNumber: data.phoneNumber || "",
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
      await updateMyInfo(form);
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
      <div className="mb-2"><span className="font-semibold">이메일:</span> {myInfo.email}</div>
      <div className="mb-2"><span className="font-semibold">이름:</span> {myInfo.lastName} {myInfo.firstName}</div>
      <div className="mb-2"><span className="font-semibold">전화번호:</span>
      <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="전화번호" className="w-full input input-bordered mb-2"/></div>
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
      <button type="submit" className="w-full btn btn-primary">정보 수정</button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default MemberInfo;