import React, { useEffect, useState } from "react";
import { getReviewReports, deleteReviewReports } from "../../api/reviewApi";
import Pagination from "../common/Pagination";
import { useNavigate } from "react-router-dom";
import useCheckBox from "../../hooks/useCheckBox";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getSortedReviews } from "../../hooks/SortingReview";
dayjs.extend(utc);
dayjs.extend(timezone);

const REPORT_TYPE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "ABUSE", label: "욕설/비방" },
  { value: "AD", label: "광고/홍보" },
  { value: "SPAM", label: "도배/스팸" },
  { value: "ETC", label: "기타" },
];

// 텍스트 말줄임표 처리 함수 추가 (파일 상단에 추가)
const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const GetReviewReports = () => {
  const navigate = useNavigate();
  // 기본값: 한달 전 ~ 오늘
  const defaultFrom = dayjs()
    .subtract(29, "day")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss");
  const defaultTo = dayjs().endOf("day").format("YYYY-MM-DDTHH:mm:ss");

  const [reports, setReports] = useState([]);
  const [type, setType] = useState("");
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("latest"); // 정렬 기준 추가

  // 체크박스 훅 (report id 기준)
  const { checked, setChecked, handleAllCheck, handleCheck } = useCheckBox(reports, "id");

  // 신고 리스트 조회
  const fetchReports = async (params = {}) => {
    const data = await getReviewReports({
      type: params.type ?? type,
      from: params.from ?? from,
      to: params.to ?? to,
      keyword: params.keyword ?? keyword,
      page: params.page ?? page,
      size: params.size ?? size,
      // sort 파라미터는 서버에 전달하지 않음
    });
    setReports(data.content || []);
    setTotalPages(data.totalPages || 1);
    setChecked([]); // 페이지 이동 시 체크박스 초기화
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, [page, size, sort]); // sort 변경 시도 반영

  // 검색 버튼 클릭
  const handleSearch = () => {
    setPage(0);
    fetchReports({
      type,
      from,
      to,
      keyword,
      page: 0,
      size,
    });
  };

  // 신고 삭제
  const handleDeleteReports = async () => {
    if (checked.length === 0) {
      window.alert("삭제할 신고를 선택하세요.");
      return;
    }
    if (!window.confirm("선택한 신고 내역을 삭제하시겠습니까?")) return;
    try {
      await deleteReviewReports(checked);
      window.alert("신고가 삭제되었습니다.");
      fetchReports();
    } catch (err) {
      window.alert("신고 삭제에 실패했습니다.");
    }
  };

  // 정렬 변경 핸들러
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(0);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">리뷰 신고 내역</h2>

      {/* 필터/검색 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {REPORT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-64"
            placeholder="신고 사유, 작성자 이메일로 검색"
          />
          <input
            type="date"
            value={from ? dayjs(from).format("YYYY-MM-DD") : ""}
            max={to ? dayjs(to).format("YYYY-MM-DD") : undefined}
            onChange={(e) => {
              const d = dayjs(e.target.value).startOf("day");
              setFrom(d.format("YYYY-MM-DDTHH:mm:ss"));
            }}
            className="border rounded px-2 py-2 text-sm"
          />
          <span>~</span>
          <input
            type="date"
            value={to ? dayjs(to).format("YYYY-MM-DD") : ""}
            min={from ? dayjs(from).format("YYYY-MM-DD") : undefined}
            onChange={(e) => {
              const d = dayjs(e.target.value).endOf("day");
              setTo(d.format("YYYY-MM-DDTHH:mm:ss"));
            }}
            className="border rounded px-2 py-2 text-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition text-sm"
          >
            검색
          </button>
        </div>
      </div>

      {/* 정렬 드롭다운 */}
      <div className="flex justify-end mb-4">
        <select
          value={sort}
          onChange={handleSortChange}
          className="border rounded px-3 py-1 text-sm"
          style={{ minWidth: 120 }}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      {/* 신고 삭제 버튼 */}
      <div className="mb-4 flex justify-start">
        <button
          onClick={handleDeleteReports}
          className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-100 transition text-sm font-medium"
          style={{ minWidth: 80, textAlign: "center" }}
        >선택 삭제
        </button>
      </div>

      {/* 신고 리스트 테이블 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={checked.length === reports.length && reports.length > 0}
                  onChange={handleAllCheck}
                />
              </th>
              <th className="p-3 text-center font-medium text-black">책 이름</th>
              <th className="p-3 text-center font-medium text-black">신고유형</th>
              <th className="p-3 text-center font-medium text-black">신고사유</th>
              <th className="p-3 text-center font-medium text-black">신고자</th>
              <th className="p-3 text-center font-medium text-black">신고일시</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  신고 내역이 없습니다.
                </td>
              </tr>
            ) : (
              getSortedReviews(reports, sort).map((report) => {
                const kstTime = report.reportedAt
                  ? dayjs.utc(report.reportedAt).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm")
                  : "";
                return (
                  <tr
                    key={report.id}
                    className="cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => navigate(`/admin/reviews/${report.reviewId}`)}
                    title="리뷰 상세보기"
                  >
                    <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={checked.includes(report.id)}
                        onChange={() => handleCheck(report.id)}
                      />
                    </td>
                    <td className="p-3 text-black text-center max-w-[150px] px-4">
                      <div className="truncate" title={report.productName}>
                        {truncateText(report.productName, 30)}
                      </div>
                    </td>
                    <td className="p-3 text-black text-center">
                      {
                        REPORT_TYPE_OPTIONS.find(
                          (opt) => opt.value === report.type
                        )?.label || report.type
                      }
                    </td>
                    <td className="p-3 text-black text-center max-w-[150px]">
                      <div className="truncate" title={report.reason}>
                        {truncateText(report.reason, 30)}
                      </div>
                    </td>
                    <td className="p-3 text-black text-center">{report.reporterEmail}</td>
                    <td className="p-3 text-black text-center">{kstTime}</td>
                  </tr>
                );
              })
            )
            }
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

export default GetReviewReports;