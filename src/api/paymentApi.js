import axios from "axios"

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL;
const PAYMENT_BASE_URI = '/payments'
const ADD_COMPLETE = '/validate'


export const postValidationAddServer = async (form)=>{
    console.log('form : ', form)
    console.log('url : ', PREFIX_URL)
    return (await axios.post(`${PREFIX_URL + PAYMENT_BASE_URI + ADD_COMPLETE}`, 
        form, 
        {headers:{'Content-Type':'application/json'}}));
}