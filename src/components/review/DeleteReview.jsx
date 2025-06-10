import { deleteReviews } from "../../api/reviewApi";

const DeleteReview = ({ reviewIds, onSuccess, onError }) => {
  // reviewIds: [id, id, ...]
  // onSuccess, onError: 콜백 함수 (옵션)

  const handleDelete = async () => {
    if (!reviewIds || reviewIds.length === 0) return;
    if (!window.confirm("선택한 리뷰를 삭제하시겠습니까?")) return;
    try {
      await deleteReviews(reviewIds);
      alert("삭제되었습니다.");
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
      className="px-1 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
    삭제
    </button>
  );
};

export default DeleteReview;