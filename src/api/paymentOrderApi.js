import axios from "axios";
import jwtAxios from "./jwtAxios";
import qs from 'qs'

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL;

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

export const postOrderStart = async (form)=>{
    return (await jwtAxios.post(`${PREFIX_URL + ORDER_BASE_URI}`, 
        form, 
        {headers:{'Content-Type':'application/json'}})).data;
}

export const getOrderInfo = async(orderId)=>{
    return (await jwtAxios.get(`${PREFIX_URL + ORDER_BASE_URI}`
                , {params: {order_id: orderId}, headers:{'Content-Type':'application/json'}} )).data
}
export const getOrdersByMember = async(state, startDate, endDate, sortBy, sortDir, page, size)=>{
    const params = {};

    if(startDate && endDate){
        params.startDate = startDate;
        params.endDate = endDate;
    }
    if(state) params.state = state;
    if(sortBy) params.sortBy = sortBy;
    if(sortDir) params.sortDir = sortDir;

    if(page && size){
        params.page=page;
        params.size=size;
    }


    return (await jwtAxios.get(`${PREFIX_URL + ORDER_BASE_URI + MEMBER_ORDERS}`
                , {params, headers:{'Content-Type':'application/json'}} )).data
}

export const getProductInven = async (prodList) => {
    const formattedParams = { product_id: prodList.map(item => item.product_id) };

    return (await axios.get(`${PREFIX_URL + PRODUCT_BASE_URI + PRODUCT_INVEN}`, {
        params: formattedParams,
        headers: { 'Content-Type': 'application/json' },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }) // key=value&key=value 형식으로 변환
    })).data;
};


