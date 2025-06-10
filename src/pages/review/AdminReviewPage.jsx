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
  const [showDetail, setShowDetail] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [quickDate, setQuickDate] = useState(""); // 어떤 빠른 날짜 버튼이 선택됐는지

  // 리뷰 목록 조회
  const fetchReviews = async (params = {}) => {
    const data = await getReviewsByAdmin({
      page: 0,
      size: 10,
      keyword: (params.search ?? search) || "",
      startDate: (params.startDate ?? startDate) || null,
      endDate: (params.endDate ?? endDate) || null,
      minRating: (params.minRating ?? minRating) || null,
      maxRating: (params.maxRating ?? maxRating) || null,
    });
    setReviews(data.content || []);
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [refresh]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    fetchReviews({ search, startDate, endDate, minRating, maxRating });
    setIsSearched(true);
  };

  // 전체목록 보기 버튼 클릭
  const handleBack = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setMinRating("");
    setMaxRating("");
    setQuickDate("");
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

  // 빠른 날짜 선택 핸들러 (내부 내용은 그대로, fetchReviews 호출하지 않음)
  const handleQuickDate = (range) => {
    const today = new Date();
    let start, end;
    switch (range) {
      case "today":
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
        break;
      case "yesterday":
        start = new Date(today.setDate(today.getDate() - 1));
        end = new Date(today.setHours(23, 59, 59, 999));
        break;
      case "week":
        start = new Date(today.setDate(today.getDate() - today.getDay()));
        end = new Date(today.setHours(23, 59, 59, 999));
        break;
      case "month":
        start = new Date(today.setDate(1));
        end = new Date(today.setHours(23, 59, 59, 999));
        break;
      default:
        return;
    }
    setStartDate(start.toISOString());
    setEndDate(end.toISOString());
    setQuickDate(range);
    // fetchReviews 호출하지 않음
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
              placeholder="책 이름, 내용, 작성자 이메일로 검색"
            />
          </div>
          {/* {isSearched && (
            <button
              onClick={handleBack}
              className="text-blue-500 hover:underline mt-2"
            >
              전체목록 보기
            </button>
          )} */}
        </div>

{/* 날짜 필터 버튼 */}
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {[
            { key: "today", label: "오늘" },
            { key: "yesterday", label: "어제" },
            { key: "week", label: "일주일" },
            { key: "month", label: "이번 달" },
          ].map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => handleQuickDate(btn.key)}
              className={`px-4 py-2 rounded-full font-semibold border transition 
                ${
                  quickDate === btn.key
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
            >
              {btn.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowDetail((v) => !v)}
            className={`px-4 py-2 rounded-full font-semibold border transition ${
              showDetail
                ? "bg-blue-100 text-blue-700 border-blue-400"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
            }`}
          >
            상세 검색
          </button>
        </div>
        {showDetail && (
          <div className="flex gap-2 items-center mb-4 justify-center">
            <input
              type="date"
              value={startDate ? startDate.slice(0, 10) : ""}
              onChange={(e) => {
                // 00:00:00.000Z로 변환
                const iso = new Date(e.target.value).toISOString();
                setStartDate(iso);
                setQuickDate(""); // 상세검색 시 빠른날짜 선택 해제
              }}
              className="border rounded px-2 py-1"
            />
            <span>~</span>
            <input
              type="date"
              value={endDate ? endDate.slice(0, 10) : ""}
              onChange={(e) => {
                // 23:59:59.999Z로 변환
                const d = new Date(e.target.value);
                d.setHours(23, 59, 59, 999);
                const iso = d.toISOString();
                setEndDate(iso);
                setQuickDate("");
              }}
              className="border rounded px-2 py-1"
            />
          </div>
        )}

        {/* 평점 필터 */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <label className="text-sm">평점</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">최소</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>~</span>
          <select
            value={maxRating}
            onChange={(e) => setMaxRating(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">최대</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* 검색 버튼 */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-full shadow transition"
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
                    checked={
                      checked.length === reviews.length && reviews.length > 0
                    }
                    onChange={handleAllCheck}
                  />
                </th>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">작성자 이메일</th>
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
                    {isSearched
                      ? "검색 결과가 없습니다."
                      : "등록된 리뷰가 없습니다."}
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
                    {/* 수정일이 있으면 수정일을 작성일로 보여줌 */}
                    <td className="border px-2 py-1">
                      {review.updatedAt
                        ? review.updatedAt.slice(0, 19).replace("T", " ")
                        : review.createdAt
                        ? review.createdAt.slice(0, 19).replace("T", " ")
                        : ""}
                    </td>
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