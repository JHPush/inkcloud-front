import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserList } from "../../../api/memberApi";
import DeleteMembers from "./DeleteMembers";
import { useSelector } from "react-redux";

const GetMemberList = () => {
  const [members, setMembers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const navigate = useNavigate();



  // 검색 및 목록 조회
  const fetchMembers = async (params = {}) => {
    try {
      const data = await getUserList({
        email: (params.search ?? search) || undefined,
        name: (params.search ?? search) || undefined,
      });
      setMembers(data.content || []);
    } catch (err) {
      console.error("error:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line
  }, [refresh]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    fetchMembers({ search });
    setIsSearched(true);
  };

  // 돌아가기 버튼 클릭
  const handleBack = () => {
    setSearch("");
    fetchMembers({ search: "" });
    setIsSearched(false);
  };

  // 전체 선택/해제
  const handleAllCheck = (e) => {
    if (e.target.checked) {
      setChecked(members.map((m) => m.id || m.email));
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

  // 회원 상세로 이동
  const handleRowClick = (member) => {
    navigate(`/admin/member/${member.email}`, { state: { member } });
  };

  // 일괄 삭제 후 목록 새로고침
  const handleDeleteSuccess = () => {
    setChecked([]);
    setRefresh((prev) => !prev);
  };

  // Enter 키 누르면 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">회원 관리</h2>

      {/* 검색창을 중앙에 크게 배치 */}
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 rounded-full px-5 py-2.5 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            placeholder="이메일 또는 이름으로 검색"
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

      {/* 삭제 버튼을 여기로 이동 */}
      <div className="mb-4 flex justify-start">
        <DeleteMembers
          selectedEmails={checked}
          onSuccess={handleDeleteSuccess}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 w-16">
                <input
                  type="checkbox"
                  checked={checked.length === members.length && members.length > 0}
                  onChange={handleAllCheck}
                />
              </th>
              <th className="border px-4 py-2">이메일</th>
              <th className="border px-4 py-2">이름</th>
              <th className="border px-4 py-2">가입일</th>
              <th className="border px-4 py-2">상태</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="5" className="border px-4 py-2 text-center">
                  {isSearched ? "검색 결과가 없습니다." : "등록된 회원이 없습니다."}
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const id = member.id || member.email;
                return (
                  <tr
                    key={id}
                    className={`hover:bg-gray-50 ${
                      checked.includes(id) ? "bg-blue-50" : ""
                    }`}
                    onClick={(e) => {
                      if (e.target.type !== "checkbox") handleRowClick(member);
                    }}
                  >
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={checked.includes(id)}
                        onChange={() => handleCheck(id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="border px-4 py-2">{member.email}</td>
                    <td className="border px-4 py-2">{member.lastName}{member.firstName}</td>
                    <td className="border px-4 py-2">
                      {member.createdAt ? member.createdAt.slice(0, 10) : "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {member.status === "WITHDRAW" ? (
                        <span className="text-red-500">탈퇴</span>
                      ) : (
                        <span className="text-green-500">정상</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetMemberList;