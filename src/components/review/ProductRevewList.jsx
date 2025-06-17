import React, { useEffect, useState } from "react";
import {
  getReviewsByProduct,
  getReviewsByProductWithLikes,
  likesReview,
  cancelLikesReview,
} from "../../api/reviewApi";
import DeleteReview from "./DeleteReview";
import { useSelector } from "react-redux";
import StarRating from "./StarRating";
import { getSortedReviews } from "../../hooks/SortingReview";
import ReportReview from "./ReportReview";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const ProductReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("latest");
  const user = useSelector((state) => state.login.user);

  // 리뷰 새로고침
  const refreshReviews = async () => {
    try {
      let data;
      if (user) {
        // 로그인 시 좋아요 정보 포함 API 사용
        data = await getReviewsByProductWithLikes(productId);
        // likedByMe 값을 liked로 변환하여 상태에 저장
        data = data.map((review) => ({
          ...review,
          liked: !!review.likedByMe,

        }));
      } else {
        // 비로그인 시 일반 API 사용
        data = await getReviewsByProduct(productId);
        data = data.map((review) => ({
          ...review,
          liked: false,
        }));
      }
      setReviews(data);
      console.log(data)
    } catch (e) {
      console.error("error:", e);
    }
  };

  useEffect(() => {
    if (productId) refreshReviews();
    // eslint-disable-next-line
  }, [productId, user]);

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (reviewId, liked) => {
    try {
      if (!user) return;
      if (liked) {
        await cancelLikesReview(reviewId);
      } else {
        await likesReview(reviewId);
      }
      // 좋아요 상태만 변경 (빠른 UX), 이후 새로고침으로 동기화
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                liked: !liked,
                likeCount: liked ? (r.likeCount ?? 1) - 1 : (r.likeCount ?? 0) + 1,
              }
            : r
        )
      );
      // 서버와 동기화
      refreshReviews();
    } catch (e) {
      console.error("좋아요 처리 오류:", e);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="latest">최신순</option>
          <option value="rating">별점 높은순</option>
          <option value="like">좋아요 많은순</option>
        </select>
      </div>
      {reviews.length === 0 ? (
        <div>작성한 리뷰가 없습니다.</div>
      ) : (
        <ul>
          {getSortedReviews(reviews, sort).map((review) => {
            // 이메일 앞 3글자만 보이고 나머지는 *로 마스킹
            const maskEmail = (email) => {
              if (!email) return "";
              const [id, domain] = email.split("@");
              const visible = id.slice(0, 3);
              const masked = "*".repeat(Math.max(0, id.length - 3));
              return `${visible}${masked}@${domain}`;
            };

            return (
              <li key={review.id} className="mb-6 pb-4 border-b">
                <div className="flex justify-between items-center">
                  <StarRating rating={review.rating} />
                  {/* 좋아요 버튼: user가 있을 때만 표시 */}
                  {user && (
                    <button
                      onClick={() => handleLikeToggle(review.id, review.liked)}
                      className="flex items-center px-2 py-1 rounded transition hover:bg-gray-100"
                      title={review.liked ? "좋아요 취소" : "좋아요"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={review.liked ? "red" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={`w-6 h-6 ${review.liked ? "text-red-500" : "text-gray-400"}`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                        />
                      </svg>
                      <span className="ml-1 text-sm">{review.likeCount ?? 0}</span>
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1 mb-2 flex justify-between items-end">
                  <div>
                    {dayjs.utc(review.createdAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm")}
                    <span className="ml-2 text-gray-500">
                      작성자: {maskEmail(review.email)}
                    </span>
                  </div>
 
                </div>
                <div className="mb-2">{review.comment}</div>
                <div className="flex items-center gap-2">
                  {/* 신고버튼 */}
                  <ReportReview reviewId={review.id} />
                  {/* 삭제 버튼: 본인만 표시, 신고버튼과 동일 스타일 */}
                  {user && user.email === review.email && (
                    <DeleteReview
                      reviewIds={[review.id]}
                      onSuccess={refreshReviews}
                    >
                      <span
                        className="text-xs text-black-500 underline hover:text-red-700 cursor-pointer"
                        title="리뷰 삭제"
                      >
                        삭제
                      </span>
                    </DeleteReview>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {/* 공지사항 위치 */}
 
  </div>
  )
};

export default ProductReviewList;