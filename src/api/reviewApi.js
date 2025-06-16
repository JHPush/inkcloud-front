import axios from 'axios';
import jwtAxios from './jwtAxios';

const REVIEW_SERVICE_URL = "http://localhost:25000/api/v1/reviews";

// 관리자 리뷰 조회, 검색
export const getReviewsByAdmin = async({
  page = 0,
  size = 20,
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
    `${REVIEW_SERVICE_URL}/admin`,
    body
  );
  return response.data;
};

// 리뷰 삭제
export const deleteReviews = async (reviewIds) => {
  const response = await jwtAxios.delete(
    `${REVIEW_SERVICE_URL}`,
    { data:  reviewIds }
  );
  return response.data;
};

//회원 리뷰 조회 
export const getReviewsByMember = async (period) => {
  const response = await jwtAxios.get(
    `${REVIEW_SERVICE_URL}/members/me?period=${period}`
  );
  return response.data;
};

//회원 리뷰 상세조회
export const getReviewDetail = async (id) => {
  const response = await jwtAxios.get(
    `${REVIEW_SERVICE_URL}/detail/${id}`
  );
  return response.data;
};

//회원 리뷰 상세조회
export const getReviewDetailByAdmin = async (id) => {
  const response = await jwtAxios.get(
    `${REVIEW_SERVICE_URL}/admin/detail/${id}`
  );
  return response.data;
};

//회원 리뷰 작성
export const writeReview = async ({productId, productName, rating, comment}) => {
  const response = await jwtAxios.post(
    `${REVIEW_SERVICE_URL}`, {productId, productName, rating, comment}
  );
  return response.data;
};

//회원 리뷰 수정
export const updateReview = async (id, {rating, comment}) => {
  const response = await jwtAxios.patch(
    `${REVIEW_SERVICE_URL}/${id}`, {rating, comment}
  );
  return response.data;
};

//상품별 리뷰 조회 
export const getReviewsByProduct = async (productId) => {
  const response = await axios.get(
    `${REVIEW_SERVICE_URL}/products/${productId}`
  );
  return response.data;
};

//상품별 리뷰 조회 + 좋아요 
export const getReviewsByProductWithLikes = async (productId) => {
  const response = await jwtAxios.get(
    `${REVIEW_SERVICE_URL}/likes?productId=${productId}`
  );
  return response.data;
};

//리뷰 좋아요
export const likesReview = async(id) => {
  const response = await jwtAxios.post(
      `${REVIEW_SERVICE_URL}/like?reviewId=${id}`
  );
  return response.data;
};

//리뷰 좋아요 취소 
export const cancelLikesReview = async(id) => {
  const response = await jwtAxios.delete(
      `${REVIEW_SERVICE_URL}/like?reviewId=${id}`
  );
  return response.data;
};

//리뷰 신고
export const reportReview = async({reviewId, type, reason}) => {
  const response = await jwtAxios.post(
      `${REVIEW_SERVICE_URL}/report`, {reviewId, type, reason}
  );
  return response.data;
};

//리뷰 신고 리스트 조회 - 관리자 
export const getReportList = async() => {
  const response = await jwtAxios.get(
      `${REVIEW_SERVICE_URL}/report`, 
  );
  return response.data;
};

// 리뷰 신고 리스트 조회
export const getReviewReports = async ({
  type,
  from,
  to,
  keyword = "",
  page = 0,
  size = 20,
}) => {
  const params = {
    type,from,to,keyword,page,size,
  };
  const response = await jwtAxios.get(`${REVIEW_SERVICE_URL}/reports`, { params });
  return response.data;
};

//리뷰 신고 리스트 조회 - 관리자 
export const deleteReviewReports = async(reportIds) => {
  const response = await jwtAxios.delete(
      `${REVIEW_SERVICE_URL}/report`,     { data:  reportIds }
  );
  return response.data;
};
