import React, { useEffect, useState } from "react";
import { getReviewsByMember } from "../../api/reviewApi";
import DeleteReview from "./DeleteReview";
import { Star } from "lucide-react";

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

const MemberReviewList = () => {
  const [reviews, setReviews] = useState([]);

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

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">내 리뷰 목록</h2>
      {reviews.length === 0 ? (
        <div>작성한 리뷰가 없습니다.</div>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} className="mb-6 pb-4 border-b">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">{review.productName}</span>
                <StarRating rating={review.rating} />
              </div>
              <div className="text-xs text-gray-400 mt-1 mb-2">
                {review.createdAt?.slice(0, 19).replace("T", " ")}
              </div>
              <div className="mb-2">{review.comment}</div>
              <div>
                <DeleteReview
                  reviewIds={[review.id]}
                  onSuccess={refreshReviews}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemberReviewList;