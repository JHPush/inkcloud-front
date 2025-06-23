import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserList } from "../../../api/memberApi";
import DeleteMembers from "./DeleteMembers";
import useCheckBox from "../../../hooks/useCheckBox";
import usePaging from "../../../hooks/usePaging";
import Pagination from "../../common/Pagination";

const GetMemberList = () => {
  const [members, setMembers] = useState([]);
  const { checked, setChecked, handleAllCheck, handleCheck } = useCheckBox(members, "email");
  const { page, setPage, totalPages, setTotalPages, size } = usePaging(0, 1, 20);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("createdAt,desc"); // 정렬 순서 상태 추가
  const [memberStatus, setMemberStatus] = useState(""); // 회원 상태 필터 추가

  const navigate = useNavigate();

  // 회원 목록 조회
  const fetchMembers = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserList({
        page: params.page ?? page,
        size: params.size ?? size,
        email: (params.search ?? search) || undefined,
        name: (params.search ?? search) || undefined,
        sort: params.sort ?? sortOrder,
        status: params.status ?? memberStatus,
      });
      setMembers(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("error:", err);
      setError("회원 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line
  }, [refresh, page, size, sortOrder, memberStatus]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    setPage(0);
    fetchMembers({ search, page: 0 });
    setIsSearched(true);
  };

  // 전체목록 보기
  const handleBack = () => {
    setSearch("");
    setMemberStatus("");
    setSortOrder("createdAt,desc");
    fetchMembers({ search: "", page: 0, status: "" });
    setIsSearched(false);
  };

  // 회원 상태 변경 처리
  const handleStatusChange = (e) => {
    const status = e.target.checked ? "WITHDRAW" : "";
    setMemberStatus(status);
    setPage(0);
  };

  
  // 정렬 순서 변경 처리
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setPage(0);
  };

  // 회원 상세로 이동
  const handleRowClick = (member) => {
    navigate(`/admin/member/${encodeURIComponent(member.email)}`);
  };

  // 일괄 삭제 후 목록 새로고침
  const handleDeleteSuccess = () => {
    setChecked([]);
    setRefresh((prev) => !prev);
  };

  // Enter 키로 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">회원 관리</h1>

      {/* 검색 및 필터 영역 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4 mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="이메일 또는 이름으로 검색"
            className="border rounded-md px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            검색
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          {/* 정렬 옵션 */}
          <div className="flex items-center">
            <label className="mr-2 font-medium text-gray-700">정렬:</label>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt,desc">최신순</option>
              <option value="createdAt,asc">오래된순</option>
              <option value="email,asc">이메일 (오름차순)</option>
              <option value="email,desc">이메일 (내림차순)</option>
            </select>
          </div>
          
          {/* 상태 필터 */}
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={memberStatus === "WITHDRAW"}
                onChange={handleStatusChange}
                className="rounded mr-2"
              />
              <span className="text-gray-700">탈퇴 회원만 보기</span>
            </label>
          </div>
          
          {(isSearched || memberStatus || sortOrder !== "createdAt,desc") && (
            <button
              onClick={handleBack}
              className="text-blue-500 hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>
      </div>

      {/* 삭제 버튼 */}
      <div className="flex justify-end mb-4">
        <DeleteMembers
          selectedEmails={checked}
          onSuccess={handleDeleteSuccess}
        />
      </div>

      {/* 로딩 및 에러 표시 */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-black">로딩 중...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* 테이블 */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={members.length > 0 && members.every(member => checked.includes(member.email))}
                    onChange={handleAllCheck}
                    className="rounded"
                  />
                </th>
                <th className="p-3 text-left font-medium text-gray-600">이메일</th>
                <th className="p-3 text-left font-medium text-gray-600">이름</th>
                <th className="p-3 text-left font-medium text-gray-600">가입일</th>
                <th className="p-3 text-left font-medium text-gray-600">상태</th>
                <th className="p-3 text-left font-medium text-gray-600">상세</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-black">
                    {isSearched || memberStatus ? "검색 결과가 없습니다." : "등록된 회원이 없습니다."}
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const id = member.email;
                  return (
                    <tr key={id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(member)}>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={checked.includes(id)}
                          onChange={() => handleCheck(id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3 text-black">{member.email}</td>
                      <td className="p-3 text-black">{member.lastName}{member.firstName}</td>
                      <td className="p-3 text-black">
                        {member.createdAt ? member.createdAt.slice(0, 10) : "-"}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.status === "WITHDRAW" 
                            ? "bg-red-100 text-red-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {member.status === "WITHDRAW" ? "탈퇴" : "정상"}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(member);
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          보기
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default GetMemberList;