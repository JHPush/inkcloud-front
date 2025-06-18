// publicApi.js
import axios from "axios";

const publicApi = axios.create({
  baseURL: process.env.REACT_APP_PREFIX_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;