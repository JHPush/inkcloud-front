import { useEffect, useState } from "react";
import { getShipDetail, modifyShip } from "../../../api/shipApi";
import ShippingForm from "./ShippingForm";
import { useNavigate, useParams } from "react-router-dom";

const ModifyShipping = () => {
  const [initialForm, setInitialForm] = useState(null);
  const {id} =useParams();
  const navigate = useNavigate();

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
    try{
      await modifyShip(form);
      window.alert("배송지 수정이 완료되었습니다.")
      navigate('/mypage',{state: {tab: 'address'}})
    }catch (err){
      console.log("수정 실패:", err)
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