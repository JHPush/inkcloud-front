import jwtAxios from "./jwtAxios";

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL;
const PAYMENT_BASE_URI = '/payments'
const ADD_COMPLETE = '/validate'

const ORDER_BASE_URI = '/orders'


export const postValidationAddServer = async (form)=>{
    console.log('form : ', form)
    console.log('url : ', PREFIX_URL)
    return (await jwtAxios.post(`${PREFIX_URL + PAYMENT_BASE_URI + ADD_COMPLETE}`, 
        form, 
        {headers:{'Content-Type':'application/json'}}));
}

export const postOrderStart = async (form)=>{
    return (await jwtAxios.post(`${PREFIX_URL + ORDER_BASE_URI}`, 
        form, 
        {headers:{'Content-Type':'application/json'}})).data;
}