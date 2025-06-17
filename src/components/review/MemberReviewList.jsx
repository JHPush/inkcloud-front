import React, { useEffect, useState } from "react";
import { getReviewsByMember, updateReview } from "../../api/reviewApi";
import DeleteReview from "./DeleteReview";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

// 기간 옵션
const PERIOD_OPTIONS = [
  { label: "오늘", value: "1d" },
  { label: "1개월", value: "1m" },
  { label: "3개월", value: "3m" },
  { label: "6개월", value: "6m" },
  { label: "전체", value: "5y" },
];

//회원별 리뷰 리스트
const MemberReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null); // 수정할 리뷰 정보
  const [period, setPeriod] = useState("3month"); // 기본값 3개월

  // 리뷰 새로고침
  const refreshReviews = async (selectedPeriod = period) => {
    try {
      const data = await getReviewsByMember(selectedPeriod);
      setReviews(data);
  
    } catch (e) {
      console.error("error:", e);
    }
  };
 
  useEffect(() => {
    refreshReviews(period);
    // eslint-disable-next-line
  }, [period]);

  // 리뷰 수정 팝업 닫기
  const closeEdit = () => setEditReview(null);

  // 리뷰 수정 완료 시
  const handleEditSubmit = async ({ rating, comment }) => {
    try {
      await updateReview(editReview.id, { rating, comment });
      alert("리뷰가 성공적으로 수정되었습니다.");
      closeEdit();
      refreshReviews();
    } catch (e) {
      alert("리뷰 수정에 실패했습니다.");
      console.error("error:", e);
    }
  };

  return (
    <div>
      {reviews.length === 0 ? (
        <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm min-h-[30vh]">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.364 17.364A9 9 0 1 1 17.364 15.364M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0"
            />
          </svg>
          <div className="text-lg text-gray-500 font-semibold mb-2">
            작성한 리뷰가 없습니다.
          </div>
          <div className="text-sm text-gray-400">
            상품을 구매하고 리뷰를 작성해보세요.
          </div>
        </div>
      ) : (
        
        <ul>
                <div className="mb-4 flex justify-end">
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          {PERIOD_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
          {reviews
            .slice() // 원본 배열 복사
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신순 정렬
            .map((review) => (
              <li key={review.id} className="mb-6 pb-4 border-b">
                {editReview && editReview.id === review.id ? (
                  // 수정 중인 리뷰만 폼으로 표시
                  <ReviewForm
                      open={!!editReview}
                    onClose={closeEdit}
                    productName={review.productName}
                    initialRating={review.rating}
                    initialComment={review.comment}
                    onSubmit={handleEditSubmit}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">{review.productName}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="text-xs text-gray-400 mt-1 mb-2">
                      {dayjs.utc(review.createdAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm")}
                    </div>
                    <div className="mb-2">{review.comment}</div>
                    <div className="flex gap-2">
                      <DeleteReview
                        reviewIds={[review.id]}
                        onSuccess={() => refreshReviews(period)}
                      >
                        <span
                          className="text-blue-600 border border-blue-400 px-3 py-2 rounded hover:bg-blue-50 text-sm"
                          style={{ display: "inline-block", lineHeight: 1 }}
                        >
                          삭제
                        </span>
                      </DeleteReview>
                      <button
                        className="text-blue-600 border border-blue-400 px-3 py-1 rounded hover:bg-blue-50 text-sm"
                        onClick={() => setEditReview(review)}
                      >
                        수정
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default MemberReviewList;