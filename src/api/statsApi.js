import jwtAxios from './jwtAxios';

const STATS_SERVICE_URL = process.env.REACT_APP_PREFIX_URL + "/stats";

//매출 및 주문건 조회 
export const getSalesStat = async(type, start, end) => {
  const response = await jwtAxios.get(
      `${STATS_SERVICE_URL}?type=${type}&start=${start}&end=${end}`
  );
  return response.data;
};

