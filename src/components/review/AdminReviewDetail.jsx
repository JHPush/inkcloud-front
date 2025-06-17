import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReviewDetailByAdmin } from "../../api/reviewApi";
import DeleteReview from "./DeleteReview";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const AdminReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const data = await getReviewDetailByAdmin(id);
        setReview(data);
        console.log(data)
      } catch (e) {
        setReview(null);
      }
    };
    fetchReview();
  }, [id]);

  const handleDeleteSuccess = () => {
    window.alert("리뷰가 삭제되었습니다.");
    navigate("/admin/reviews");
  };

  if (!review) {
    return (
      <div className="p-10 text-lg text-center text-gray-500">
        리뷰 정보를 불러올 수 없습니다.
      </div>
    );
  }

  // review.createdAt이 UTC라면 KST로 변환해서 표시
  const kstTime = dayjs.utc(review.createdAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm");

  return (
    <div className="w-full min-h-[60vh] bg-gray-50 flex flex-col justify-center">
      <div className="flex items-center justify-between px-16 mt-8 mb-2">
        <h2 className="text-3xl font-bold text-gray-800">리뷰 상세 정보</h2>
        <DeleteReview
          reviewIds={[review.id]}
          onSuccess={handleDeleteSuccess}
          onConfirm={() =>
            window.confirm(
              "이 리뷰를 삭제하면 해당 리뷰에 대한 신고 내역도 모두 삭제됩니다.\n정말 삭제하시겠습니까?"
            )
          }
        >
          <span className="px-1 py-1 rounded bg-gray-400 text-white font-semibold text-sm hover:bg-red-600 transition">
            리뷰 삭제
          </span>
        </DeleteReview>
      </div>
      <div className="w-full px-16">
        <table className="w-full border-t border-b border-gray-300 bg-white">
          <tbody>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 w-48 bg-gray-50 text-gray-700 font-semibold border-b">리뷰 ID</th>
              <td className="py-4 px-6 border-b">{review.id}</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">작성자</th>
              <td className="py-4 px-6 border-b">{review.email}</td>
            </tr>
            <tr
              className="hover:bg-blue-50 cursor-pointer"
              onClick={() => navigate(`/products/${review.productId}`)}
              title="상품 상세로 이동"
            >
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">
                상품명
              </th>
              <td className="py-4 px-6 border-b">
                {review.productName}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">평점</th>
              <td className="py-4 px-6 border-b">{review.rating}</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">리뷰 내용</th>
              <td className="py-4 px-6 border-b">{review.comment}</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">작성일</th>
              <td className="py-4 px-6 border-b">{kstTime}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviewDetail;