// ReviewWriteButton.jsx
import {  useState } from "react";
import ReviewForm from "./ReviewForm";
import { writeReview, updateReview } from "../../api/reviewApi";

const WriteReview = ({ orderItem, onSuccess }) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async ({ rating, comment }) => {
    try {
      await writeReview({
        productId: orderItem.itemId,
        productName: orderItem.name,
        rating,
        comment,
      });
      alert("리뷰가 등록되었습니다.");
      setOpen(false);
      onSuccess && onSuccess();
    } catch (e) {
      // 409: 이미 리뷰가 있음
      if (e?.response?.status === 409) {
        const reviewId = e.response.data.reviewId;
        if (window.confirm("이미 작성한 리뷰가 있습니다. 이 내용으로 리뷰를 수정하시겠습니까?")) {
          try {
            await updateReview(
              reviewId,
              { rating, comment }
            );
            alert("리뷰가 수정되었습니다.");
            setOpen(false);
            onSuccess && onSuccess();
          } catch (err) {
            alert("리뷰 수정에 실패했습니다.");
            setOpen(false);
          }
        } else {
          setOpen(false);
        }
      } else {
        alert("리뷰 등록에 실패했습니다.");
        setOpen(false);
      }
      console.error(e);
    }
  };


  return (
    <>
      <button
        className="inline-block mt-2 px-4 py-1 rounded bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600"
        onClick={e => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        리뷰작성
      </button>
      {open && (
        <ReviewForm
          open={open}
          onClose={() => setOpen(false)}
          productName={orderItem.name}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default WriteReview;