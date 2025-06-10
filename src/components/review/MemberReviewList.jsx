import React, { useEffect, useState } from "react";
import { getReviewsByMember, updateReview } from "../../api/reviewApi";
import DeleteReview from "./DeleteReview";
import { Star } from "lucide-react";
import ReviewForm from "./ReviewForm";

// 별점 표시 컴포넌트
const StarRating = ({ rating }) => (
  <span className="flex">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={18}
        color={n <= rating ? "#facc15" : "#e5e7eb"}
        fill={n <= rating ? "#facc15" : "none"}
        style={{ marginRight: 2 }}
      />
    ))}
  </span>
);

//회원별 리뷰 리스트
const MemberReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null); // 수정할 리뷰 정보

  // 리뷰 새로고침
  const refreshReviews = async () => {
    try {
      const data = await getReviewsByMember();
      setReviews(data);
    } catch (e) {
      console.error("error:", e);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, []);

  // 리뷰 수정 팝업 닫기
  const closeEdit = () => setEditReview(null);

  // 리뷰 수정 완료 시
  const handleEditSubmit = async ({ rating, comment }) => {
    try{
        await updateReview(editReview.id, { rating, comment });
        closeEdit();
        refreshReviews();
    }catch (e) {
        console.error("error:",e)
    }

  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">내 리뷰 목록</h2>
      {reviews.length === 0 ? (
        <div>작성한 리뷰가 없습니다.</div>
      ) : (
        <ul>
          {reviews
            .slice() // 원본 배열 복사
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신순 정렬
            .map((review) => (
              <li key={review.id} className="mb-6 pb-4 border-b">
                {editReview && editReview.id === review.id ? (
                  // 수정 중인 리뷰만 폼으로 표시
                  <ReviewForm
                    productName={review.productName}
                    initialRating={review.rating}
                    initialComment={review.comment}
                    onSubmit={handleEditSubmit}
                    onCancel={closeEdit}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">{review.productName}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="text-xs text-gray-400 mt-1 mb-2">
                      {review.createdAt?.slice(0, 19).replace("T", " ")}
                    </div>
                    <div className="mb-2">{review.comment}</div>
                    <div className="flex gap-2">
                      <DeleteReview
                        reviewIds={[review.id]}
                        onSuccess={refreshReviews}
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