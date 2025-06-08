import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getReviewsByAdmin } from "../../api/reviewApi";
import DeleteReview from "../../components/review/DeleteReview";

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [checked, setChecked] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // 리뷰 목록 조회
  const fetchReviews = async (params = {}) => {
    try {
      const data = await getReviewsByAdmin({
        page: 0,
        size: 10,
        keyword: (params.search ?? search) || "",
        startDate: null,
        endDate: null,
        minRating: null,
        maxRating: null,
      });
      setReviews(data.content || []);
    } catch (err) {
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [refresh]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    fetchReviews({ search });
    setIsSearched(true);
  };

  // 전체목록 보기 버튼 클릭
  const handleBack = () => {
    setSearch("");
    fetchReviews({ search: "" });
    setIsSearched(false);
  };

  // 전체 선택/해제
  const handleAllCheck = (e) => {
    if (e.target.checked) {
      setChecked(reviews.map((r) => r.id));
    } else {
      setChecked([]);
    }
  };

  // 개별 선택/해제
  const handleCheck = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // 삭제 성공 시
  const handleDeleteSuccess = () => {
    setChecked([]);
    setRefresh((prev) => !prev);
  };

  // 삭제 실패 시
  const handleDeleteError = (err) => {
    // 필요시 에러 처리
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">리뷰 관리</h2>

        {/* 검색창 */}
        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl mx-auto relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-full px-5 py-2.5 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="책 이름, 내용용으로 검색"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition duration-150"
            >
              검색
            </button>
          </div>
          {isSearched && (
            <button
              onClick={handleBack}
              className="text-blue-500 hover:underline mt-2"
            >
              전체목록 보기
            </button>
          )}
        </div>

        {/* 삭제 버튼 */}
        <div className="mb-4 flex justify-start">
          <DeleteReview
            reviewIds={checked}
            onSuccess={handleDeleteSuccess}
            onError={handleDeleteError}
          />
        </div>

        {/* 리뷰 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 w-16">
                  <input
                    type="checkbox"
                    checked={checked.length === reviews.length && reviews.length > 0}
                    onChange={handleAllCheck}
                  />
                </th>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">작성자</th>
                <th className="border px-2 py-1">책 이름</th>
                <th className="border px-2 py-1">평점</th>
                <th className="border px-2 py-1">댓글</th>
                <th className="border px-2 py-1">작성일</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    {isSearched ? "검색 결과가 없습니다." : "등록된 리뷰가 없습니다."}
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={checked.includes(review.id)}
                        onChange={() => handleCheck(review.id)}
                      />
                    </td>
                    <td className="border px-2 py-1">{review.id}</td>
                    <td className="border px-2 py-1">{review.email}</td>
                    <td className="border px-2 py-1">{review.productName}</td>
                    <td className="border px-2 py-1">{review.rating}</td>
                    <td className="border px-2 py-1">{review.comment}</td>
                    <td className="border px-2 py-1">{review.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviewPage;