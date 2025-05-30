import { useState } from "react";
import { registerShip } from "../../../api/shipApi";
import ShippingForm from "./ShippingForm";

const AddShipping = () => {
  const initialForm = {
    name: "",
    receiver: "",
    zipcode:"" ,
    addressMain: "",
    addressSub: "",
    contact: "",
  };
 

  // 배송지 등록
  const handleSubmit = async (form) => {

      await registerShip(form);
  };

  return (
    <>
    <ShippingForm initialForm={initialForm} onSubmit={handleSubmit} submitLabel="배송지 등록" />
     </>
  );
};

export default AddShipping;