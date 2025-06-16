import { deleteReviews } from "../../api/reviewApi";

const DeleteReview = ({ reviewIds, onSuccess, onError, onConfirm, children = "✕" }) => {
  const handleDelete = async () => {
    if (!reviewIds || reviewIds.length === 0) return;
    // onConfirm이 있으면 그 함수 실행, 없으면 기본 confirm 사용
    const confirmed = onConfirm ? onConfirm() : window.confirm("선택한 리뷰를 삭제하시겠습니까?");
    if (!confirmed) return;
    try {
      await deleteReviews(reviewIds);
      console.log("리뷰 삭제 완료")
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("삭제에 실패했습니다.");
      if (onError) onError(err);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={!reviewIds || reviewIds.length === 0}
      style={{ lineHeight: 1, background: "none", border: "none", padding: 0, margin: 0 }}
      title="리뷰 삭제"
    >
      {children}
    </button>
  );
};

export default DeleteReview;