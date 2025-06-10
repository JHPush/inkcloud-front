import React, { useState } from "react";
import { Star } from "lucide-react";

const ReviewForm = ({
  productName,
  initialRating = 0,
  initialComment = "",
  onSubmit,
  onCancel,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("평점을 선택해주세요.");
      return;
    }
    onSubmit && onSubmit({ rating, comment });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-0 bg-transparent rounded-none shadow-none"
    >
      <div className="mb-2">
        <div className="text-xl font-semibold">{productName}</div>
      </div>
      <div className="mb-2 flex items-center">
        <span className="mr-2 text-sm">평점</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            className="focus:outline-none"
          >
            <Star
              size={22}
              color={n <= rating ? "#facc15" : "#e5e7eb"}
              fill={n <= rating ? "#facc15" : "none"}
              style={{ marginRight: 2, transition: "color 0.2s" }}
            />
          </button>
        ))}
      </div>
      <div className="mb-2">
        <textarea
          className="w-full border rounded px-3 py-2 text-base"
          rows={3}
          placeholder="리뷰 내용을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded text-sm"
        >
          저장
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm"
            onClick={onCancel}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;