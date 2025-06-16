import GetReviewReports from "../../components/review/GetReviewReports";
import { Link } from "react-router-dom";

const AdminReviewReportPage = () => {
  return (
    
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link
          to="/admin/reviews"
          className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold text-sm  transition"
        >
          ← 리뷰 관리로 돌아가기
        </Link>
        {/* <h2 className="text-xl font-bold">리뷰 신고 내역</h2> */}
      </div>
      <GetReviewReports />
    </div>
  );
};

export default AdminReviewReportPage;