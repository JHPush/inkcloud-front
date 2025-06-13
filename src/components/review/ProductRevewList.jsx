import React, { useEffect, useState } from "react";
import { getReviewsByProduct } from "../../api/reviewApi";
import DeleteReview from "./DeleteReview";
import { useSelector } from "react-redux";
import StarRating from "./StarRating";
import { getSortedReviews } from "../../hooks/SortingReview";

const ProductReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("latest"); // 정렬 상태 추가
  const user = useSelector((state) => state.login.user);

  // 리뷰 새로고침
  const refreshReviews = async () => {
    try {
      const data = await getReviewsByProduct(productId);
      setReviews(data);
      console.log(data)
    } catch (e) {
      console.error("error:", e);
    }
  };

  useEffect(() => {
    if (productId) refreshReviews();
  }, [productId]);


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
                  {/* <span className="text-xl font-semibold">{review.productName}</span> */}
                  <StarRating rating={review.rating} />
                </div>
                <div className="text-xs text-gray-400 mt-1 mb-2">
                  {review.createdAt?.slice(0, 19).replace("T", " ")}
                  <span className="ml-2 text-gray-500">
                    작성자: {maskEmail(review.email)}
                  </span>
                </div>
                <div className="mb-2">{review.comment}</div>
                <div>
                  {user && user.email === review.email && (
                    <DeleteReview
                      reviewIds={[review.id]}
                      onSuccess={refreshReviews}
                    >
                      <span className="text-lg" title="리뷰 삭제">✕</span>
                    </DeleteReview>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

    {/* 공지사항 위치: 여기! */}
{/* <div className="mt-4 p-4 bg-yellow-300 border border-yellow-500 rounded text-base text-black">
  ※ 리뷰 작성 시 욕설, 비방, 개인정보 노출 등 부적절한 내용은 사전 통보 없이 삭제될 수 있습니다.
</div> */}
    </div>
  );
};

export default ProductReviewList;