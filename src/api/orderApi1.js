import axios from 'axios';
import jwtAxios from './jwtAxios';

const ORDER_SERVICE_URL = "http://localhost:25000/api/v1/orders";

//회원주문조회 
export const getMemberOrders = async(email) => {
  const response = await jwtAxios.get(
      `${ORDER_SERVICE_URL}/member?member_id=${email}`
  );
  return response.data;
};