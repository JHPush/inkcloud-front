import axios from "axios";
import jwtAxios from "./jwtAxios";
import qs from 'qs'
import publicApi from "./publicApi";

// const PREFIX_URL = process.env.REACT_APP_PREFIX_URL;

const ORDER_BASE_URI = '/orders'
const PRODUCT_BASE_URI = '/products'
const PRODUCT_INVEN = '/quantities'
const MEMBER_ORDERS = '/member'


// export const postValidationAddServer = async (form)=>{
//     console.log('form : ', form)
//     console.log('url : ', PREFIX_URL)
//     return (await jwtAxios.post(`${PREFIX_URL + PAYMENT_BASE_URI + ADD_COMPLETE}`, 
//         form, 
//         {headers:{'Content-Type':'application/json'}}));
// }

export const postOrderStart = async (form) => {
    return (await jwtAxios.post(`${ORDER_BASE_URI}`,
        form,
        { headers: { 'Content-Type': 'application/json' } })).data;
}

export const getOrderInfo = async (orderId) => {
    return (await jwtAxios.get(`${ORDER_BASE_URI}`
        , { params: { order_id: orderId }, headers: { 'Content-Type': 'application/json' } })).data
}
export const getOrdersByMember = async (state, startDate, endDate, sortBy, sortDir, page, size) => {
    const params = {};

    if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
    }
    if (state) params.state = state;
    if (sortBy) params.sortBy = sortBy;
    if (sortDir) params.sortDir = sortDir;

    if (page || size) {
        params.page = page;
        params.size = size;
    }


    return (await jwtAxios.get(`${ORDER_BASE_URI + MEMBER_ORDERS}`
        , { params, headers: { 'Content-Type': 'application/json' } })).data
}

export const getProductInven = async (prodList) => {
    console.log('items : ', prodList)
    const formattedParams = { product_id: prodList.map(item => item.product_id) };

    return (await publicApi.get(`${PRODUCT_BASE_URI + PRODUCT_INVEN}`, {
        params: formattedParams,
        headers: { 'Content-Type': 'application/json' },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }) // key=value&key=value 형식으로 변환
    })).data;
};

export const putCancelOrder = async (id) => {
    return (await jwtAxios.put(`${ORDER_BASE_URI}`, null, {
        params: { order_id: id }, headers: { 'Content-Type': 'application/json' }
    })).data;
}

export const getAllOrders = async (keywordCategory, keyword, state, paymentMethods, startDate, endDate, sortBy, sortDir, page, size) => {
    const params = {};

    if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
    }
    if (keywordCategory && keyword) {
        params.keywordCategory = keywordCategory;
        params.keyword = keyword;
    }
    if (state) params.states = state;
    if( paymentMethods) params.paymentMethods = paymentMethods;
    if (sortBy) params.sortBy = sortBy;
    if (sortDir) params.sortDir = sortDir;

    if (page && size) {
        params.page = page;
        params.size = size;
    }
    console.log('params : ', params)
    return (await jwtAxios.get(`${ORDER_BASE_URI + '/all'}`, { params, headers: { 'Content-Type': 'application/json' } })).data;
}

// 주문 상태 일괄 업데이트 (다음 단계로)
// export const patchUpdateOrders = async (orderIds) => {
//     return (await jwtAxios.patch(`${PREFIX_URL + ORDER_BASE_URI}/all`, null, {
//         params: { order_id: orderIds },
//         headers: { 'Content-Type': 'application/json' }
//     })).data;
// }

// 주문 상태를 특정 상태로 일괄 변경
export const patchUpdateOrdersWithState = async (orderIds, state) => {
    return (await jwtAxios.patch(`${ORDER_BASE_URI}/all`, {
        orderIds: orderIds,
        state: state
    })).data;
}

export const patchOrdersWithState = async (orderId, state) => {
    return (await jwtAxios.patch(`${ORDER_BASE_URI}`, null, {
        params:{order_id: orderId, state:state}
        ,headers:{"Content-Type":"application/json"}
    })).data;
}

//회원주문조회 
export const getMemberOrders = async() => {
  const response = await jwtAxios.get(
      `${ORDER_BASE_URI}/member/ship`
  );
  return response.data;
};