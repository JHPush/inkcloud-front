import { registerShip } from "../../../api/shipApi";
import ShippingForm from "./ShippingForm";

const AddShipping = ({ onSuccess }) => {
  const initialForm = {
    name: "",
    receiver: "",
    zipcode: "",
    addressMain: "",
    addressSub: "",
    contact: "",
  };

  // 배송지 등록
  const handleSubmit = async (form) => {
    try {
      await registerShip(form);
      window.alert("배송지가 저장되었습니다.");
      if (onSuccess) onSuccess(); // ShippingList로 돌아가기
    } catch (err) {
      window.alert("배송지 등록 실패");
    }
  };

  return (
    <ShippingForm initialForm={initialForm} onSubmit={handleSubmit} submitLabel="배송지 등록" />
  );
};

export default AddShipping;