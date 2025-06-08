import axios from 'axios';
import jwtAxios from './jwtAxios';

const MEMBER_SERVICE_URL = "http://localhost:25000/api/v1/reviews";

// 관리자 리뷰 조회, 검색
export const getReviewsByAdmin = async({
  page = 0,
  size = 10,
  keyword = "",
  startDate,
  endDate,
  minRating,
  maxRating
}) => {
  const body = {
    page,
    size,
    keyword,
    startDate,
    endDate,
    minRating,
    maxRating
  };
  const response = await jwtAxios.post(
    `${MEMBER_SERVICE_URL}/admin`,
    body
  );
  return response.data;
};

// 리뷰 삭제
export const deleteReviews = async (reviewIds) => {
  const response = await jwtAxios.delete(
    `${MEMBER_SERVICE_URL}`,
    { data:  reviewIds }
  );
  return response.data;
};