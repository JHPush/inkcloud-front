import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserList } from "../../../api/memberApi";
import DeleteMembers from "./DeleteMembers";
import useCheckBox from "../../../hooks/useCheckBox";
import usePaging from "../../../hooks/usePaging";

const GetMemberList = () => {
  const [members, setMembers] = useState([]);
  const { checked, setChecked, handleAllCheck, handleCheck } = useCheckBox(members, "email");
  const { page, setPage, totalPages, setTotalPages, size, setSize } = usePaging(0, 1, 20);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  
  const navigate = useNavigate();

  // 데이터 로드 함수
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size,
        ...(searchKeyword && { email: searchKeyword }),
      };
      const data = await getUserList(params);
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
  }, [refresh, page, size]);

  // 검색 처리
  const handleSearch = () => {
    setPage(0);
    fetchMembers();
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">회원 관리</h1>

      {/* 검색 박스 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="이메일 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="border rounded-md px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            검색
          </button>
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
          <div className="text-gray-500">로딩 중...</div>
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
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    등록된 회원이 없습니다.
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const id = member.email;
                  return (
                    <tr key={id} className="border-b hover:bg-gray-50 cursor-pointer" >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={checked.includes(id)}
                          onChange={() => handleCheck(id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3 text-gray-700">{member.email}</td>
                      <td className="p-3 text-gray-700">{member.lastName}{member.firstName}</td>
                      <td className="p-3 text-gray-700">
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
      <div className="mt-6 flex justify-center items-center gap-2">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          &lt; 이전
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.floor(page / 5) * 5 + i;
          if (pageNum >= totalPages) return null;

          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded-md text-sm ${
                page === pageNum 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {pageNum + 1}
            </button>
          );
        })}

        <button
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          다음 &gt;
        </button>
      </div>
    </div>
  );
};

export default GetMemberList;