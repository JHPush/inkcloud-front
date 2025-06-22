import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReviewDetailByAdmin, getReportsByReviewId } from "../../api/reviewApi";
import DeleteReview from "./DeleteReview";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const REPORT_TYPE_OPTIONS = [
  { value: "ABUSE", label: "욕설/비방" },
  { value: "AD", label: "광고/홍보" },
  { value: "SPAM", label: "도배/스팸" },
  { value: "ETC", label: "기타" },
];

const AdminReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const data = await getReviewDetailByAdmin(id);
        setReview(data);
      } catch (e) {
        setReview(null);
      }
    };
    fetchReview();
  }, [id]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReportsByReviewId(id);
        setReports(data.content || []);
      } catch (e) {
        setReports([]);
      }
    };
    fetchReports();
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

      {/* 신고 내역 테이블 */}
      <div className="w-full px-16 mt-10">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">신고 내역</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-center font-medium text-black">신고자 이메일</th>
                <th className="p-3 text-center font-medium text-black">신고유형</th>
                <th className="p-3 text-center font-medium text-black">신고사유</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-400">
                    신고 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-black text-center">{report.reporterEmail}</td>
                    <td className="p-3 text-black text-center">
                      {REPORT_TYPE_OPTIONS.find(opt => opt.value === report.type)?.label || report.type}
                    </td>
                    <td className="p-3 text-black text-center">{report.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewDetail;