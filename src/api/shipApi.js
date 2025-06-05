import axios from 'axios';
import jwtAxios from './jwtAxios';

const MEMBER_SERVICE_URL = "http://localhost:25000/api/v1/members";
const SHIP_SERVICE_URL = `${MEMBER_SERVICE_URL}/ship`

//배송지 등록
export const registerShip = async(form) => {
  const response = await jwtAxios.post(
      `${SHIP_SERVICE_URL}`, 
        {
        name: form.name,
        receiver: form.receiver,
        zipcode: form.zipcode,
        addressMain: form.addressMain,
        addressSub: form.addressSub,
        contact: form.contact
      }
  );
  return response.data;
};

//배송지 상세조회
export const getShipDetail = async(id) => {
  const response = await jwtAxios.get(
      `${SHIP_SERVICE_URL}/${id}`, {  }
  );
  return response.data;
};

//배송지 목록조회
export const getShipList = async() => {
  const response = await jwtAxios.get(
      `${SHIP_SERVICE_URL}`, 
  );
  return response.data;
};

//배송지 수정
export const modifyShip = async(form) => {
  const response = await jwtAxios.patch(
      `${SHIP_SERVICE_URL}/${form.id}`, 
        {
        name: form.name,
        receiver: form.receiver,
        zipcode: form.zipcode,
        addressMain: form.addressMain,
        addressSub: form.addressSub,
        contact: form.contact
      }
  );
  return response.data;
};

//배송지 삭제
export const deleteShip = async(id) => {
  const response = await jwtAxios.delete(
      `${SHIP_SERVICE_URL}/${id}`, {  }
  );
  return response.data;
};