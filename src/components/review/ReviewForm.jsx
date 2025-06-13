import React, { useState } from "react";
import { Star } from "lucide-react";

// 모달 래퍼 컴포넌트
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-lg shadow-lg p-8 min-w-[400px] max-w-2xl w-full relative" // 크기 조정
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const ReviewForm = ({
  open = true, // 모달 열림 여부
  onClose, // 모달 닫기 함수
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
    onClose && onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewForm;