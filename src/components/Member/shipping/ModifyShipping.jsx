import { useEffect, useState } from "react";
import { getShipDetail, modifyShip } from "../../../api/shipApi";
import ShippingForm from "./ShippingForm";

const ModifyShipping = ({ id, onSuccess }) => {
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getShipDetail(id);
        setInitialForm(data);
      } catch (err) {
        // 에러 처리
      }
    };
    fetchDetail();
  }, [id]);

  // 수정 제출
  const handleModify = async (form) => {
    try {
      await modifyShip(form);
      window.alert("배송지 수정이 완료되었습니다.");
      if (onSuccess) onSuccess(); // ShippingList로 돌아가기
    } catch (err) {
      console.log("수정 실패:", err);
    }
  };

  if (!initialForm) return <div>로딩중...</div>;

  return (
    <ShippingForm
      initialForm={initialForm}
      onSubmit={handleModify}
      submitLabel="배송지 수정"
    />
  );
};

export default ModifyShipping;