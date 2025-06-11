import axios from "axios";
import jwtAxios from "./jwtAxios";
import qs from 'qs'

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL;
const PAYMENT_BASE_URI = '/payments'
const ADD_COMPLETE = '/validate'

const ORDER_BASE_URI = '/orders'
const PRODUCT_BASE_URI = '/products'
const PRODUCT_INVEN = '/quantities'


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

export const getProductInven = async (prodList) => {
    const formattedParams = { product_id: prodList.map(item => item.product_id) };

    return (await axios.get(`${PREFIX_URL + PRODUCT_BASE_URI + PRODUCT_INVEN}`, {
        params: formattedParams,
        headers: { 'Content-Type': 'application/json' },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }) // key=value&key=value 형식으로 변환
    })).data;
};


