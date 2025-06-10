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

//회원 리뷰 조회 
export const getReviewsByMember = async () => {
  const response = await jwtAxios.get(
    `${MEMBER_SERVICE_URL}/members/me`
  );
  return response.data;
};

//회원 리뷰 상세조회
export const getReviewDetail = async (id) => {
  const response = await jwtAxios.get(
    `${MEMBER_SERVICE_URL}/detail/${id}`
  );
  return response.data;
};

//회원 리뷰 수정
export const updateReview = async (id) => {
  const response = await jwtAxios.patch(
    `${MEMBER_SERVICE_URL}/${id}`
  );
  return response.data;
};

//상품별 리뷰 조회 
export const getReviewsByProduct = async (productId) => {
  const response = await axios.get(
    `${MEMBER_SERVICE_URL}/products/${productId}`
  );
  return response.data;
};