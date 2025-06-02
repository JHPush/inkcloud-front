
import { useNavigate } from "react-router-dom";
import { registerShip } from "../../../api/shipApi";
import ShippingForm from "./ShippingForm";

const AddShipping = () => {
  const initialForm = {
    name: "",
    receiver: "",
    zipcode: "",
    addressMain: "",
    addressSub: "",
    contact: "",
  };
  const navigate = useNavigate();

  // 배송지 등록
  const handleSubmit = async (form) => {
    try {
      await registerShip(form);
      console.log("배송지 등록 성공");
      navigate('/mypage',{state: {tab: 'address'}})
    } catch (err) {
      console.log("배송지 등록 실패:", err);
    }
  };

  return (
    <>
      <ShippingForm initialForm={initialForm} onSubmit={handleSubmit} submitLabel="배송지 등록" />
    </>
  );
};

export default AddShipping;