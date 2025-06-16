import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getReviewsByAdmin } from "../../api/reviewApi";
import DeleteReview from "../../components/review/DeleteReview";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import StarRating from "../../components/review/StarRating";
import useCheckBox from "../../hooks/useCheckBox";
import usePaging from "../../hooks/usePaging";
import Pagination from "../../components/common/Pagination";
import { getSortedReviews } from "../../hooks/SortingReview";
dayjs.extend(utc);
dayjs.extend(timezone);


const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const {checked, setChecked, handleAllCheck, handleCheck} = useCheckBox(reviews, "id")
  const { page, setPage, totalPages, setTotalPages, size } = usePaging(0, 1, 20);
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [quickDate, setQuickDate] = useState(""); // 어떤 빠른 날짜 버튼이 선택됐는지
  const [sort, setSort] = useState("latest"); // 정렬 기준, 기본값 최신순
  


  // 리뷰 목록 조회
  const fetchReviews = async (params = {}) => {
    const data = await getReviewsByAdmin({
      page: params.page ?? page,
      size: size,
      keyword: (params.search ?? search) || "",
      startDate: (params.startDate ?? startDate) || null,
      endDate: (params.endDate ?? endDate) || null,
      minRating: (params.minRating ?? minRating) || null,
      maxRating: (params.maxRating ?? maxRating) || null,
    });
    setReviews(data.content || []);
    setTotalPages(data.totalPages || 1);
  };

  useEffect(() => {
    fetchReviews({ page });
    // eslint-disable-next-line
  }, [refresh, page]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    setPage(0);
    fetchReviews({ search, startDate, endDate, minRating, maxRating, page: 0 });
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

    setIsSearched(false);
    setPage(0);
    setRefresh((prev) => !prev);
  };

  // 삭제 성공 시
  const handleDeleteSuccess = () => {
    setChecked([]);
    setRefresh((prev) => !prev);
  };

  // 삭제 실패 시
  const handleDeleteError = (err) => {
    alert("리뷰 삭제에 실패했습니다. 다시 시도해 주세요.");
    console.error("리뷰 삭제 에러:", err);
  };

  // 빠른 날짜 선택 핸들러 (KST LocalDateTime, 오프셋 없는 문자열)
  const handleQuickDate = (range) => {
    // 이미 선택된 버튼을 다시 누르면 해제
    if (quickDate === range) {
      setQuickDate("");
      setStartDate("");
      setEndDate("");
      return;
    }
    const now = dayjs().tz("Asia/Seoul");
    let start, end;
    switch (range) {
      case "today":
        start = now.startOf("day");
        end = now;
        break;
      case "yesterday":
        start = now.subtract(1, "day").startOf("day");
        end = now.subtract(1, "day").endOf("day");
        break;
      case "week":
        start = now.subtract(6, "day").startOf("day");
        end = now;
        break;
      case "month":
        start = now.subtract(29, "day").startOf("day");
        end = now;
        break;
      default:
        return;
    }
    // 오프셋 없는 문자열로 변환 (YYYY-MM-DDTHH:mm:ss)
    setStartDate(start.format("YYYY-MM-DDTHH:mm:ss"));
    setEndDate(end.format("YYYY-MM-DDTHH:mm:ss"));
    setQuickDate(range);
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
        </div>

        {/* 날짜 필터 버튼 */}
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {[
            { key: "today", label: "오늘" },
            { key: "yesterday", label: "어제" },
            { key: "week", label: "최근 7일" },
            { key: "month", label: "최근 30일" },
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
              max={dayjs().tz("Asia/Seoul").format("YYYY-MM-DD")}
              value={startDate ? dayjs(startDate).tz("Asia/Seoul").format("YYYY-MM-DD") : ""}
              onChange={(e) => {
                // 00:00:00로 변환 (오프셋 없이)
                const d = dayjs(e.target.value).tz("Asia/Seoul").startOf("day");
                setStartDate(d.format("YYYY-MM-DDTHH:mm:ss"));
                setQuickDate("");
              }}
              className="border rounded px-2 py-1"
            />
            <span>~</span>
            <input
              type="date"
              min={startDate ? dayjs(startDate).tz("Asia/Seoul").format("YYYY-MM-DD") : undefined}
              max={dayjs().tz("Asia/Seoul").format("YYYY-MM-DD")}
              value={endDate ? dayjs(endDate).tz("Asia/Seoul").format("YYYY-MM-DD") : ""}
              onChange={(e) => {
                // 23:59:59로 변환 (오프셋 없이)
                const d = dayjs(e.target.value).tz("Asia/Seoul").endOf("day");
                setEndDate(d.format("YYYY-MM-DDTHH:mm:ss"));
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
            전체목록으로 돌아가기 
          </button>
        )}

        {/* 삭제 버튼 */}
        <div className="mb-4 flex justify-start">
        <DeleteReview
          reviewIds={checked}
          onSuccess={handleDeleteSuccess}
          onError={handleDeleteError}
        >
        <span
          className="px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
          style={{ minWidth: 80, textAlign: "center" }}
        >
          선택 삭제
        </span>
        </DeleteReview>
        </div>

        {/* 정렬 드롭다운 */}
        <div className="flex justify-end mb-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
            style={{ minWidth: 120 }}
          >
            <option value="latest">최신순</option>
            <option value="rating">별점 높은순</option>
          </select>
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
                <th className="border px-2 py-1">내용</th>
                <th className="border px-2 py-1">작성일(수정일)</th>
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
                getSortedReviews(reviews, sort).map((review) => (
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
                    <td className="border px-2 py-1"><StarRating rating= {review.rating}/></td>
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
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </AdminLayout>
  );
};

export default AdminReviewPage;