import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserList } from "../../../api/memberApi";
import DeleteMembers from "./DeleteMembers";
import { Undo2 } from "lucide-react"; // 더 입체적이고 돌아가기 느낌의 아이콘

const GetMemberList = () => {
  const [members, setMembers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState(false); // 검색 버튼 클릭 여부
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

  return (
    <div className="p-6 bg-white rounded shadow max mx-auto">
      <h2 className="text-2xl font-bold mb-6">회원 목록</h2>
              {isSearched && (
          <button className="btn btn-sm btn-outline flex items-center gap-1" onClick={handleBack}>
            <Undo2 size={20} />돌아가기
          </button>
        )}
      {/* 통합 검색창*/}
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="이메일 또는 이름 검색"
          className="input input-bordered w-60"
        />
        <button className="btn btn-sm btn-primary" onClick={handleSearch}>
          검색
        </button>

        <DeleteMembers
          selectedEmails={checked}
          onSuccess={handleDeleteSuccess}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={checked.length === members.length && members.length > 0}
                  onChange={handleAllCheck}
                />
              </th>
              <th>이메일</th>
              <th>이름</th>
              <th>가입일</th>
              <th>탈퇴여부</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const id = member.id || member.email;
              return (
                <tr
                  key={id}
                  className={checked.includes(id) ? "bg-blue-50 cursor-pointer" : "cursor-pointer"}
                  onClick={e => {
                    if (e.target.type !== "checkbox") handleRowClick(member);
                  }}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={checked.includes(id)}
                      onChange={() => handleCheck(id)}
                      onClick={e => e.stopPropagation()}
                    />
                  </td>
                  <td className="font-mono">{member.email}</td>
                  <td>{member.lastName}{member.firstName}</td>
                  <td>{member.createdAt ? member.createdAt.slice(0, 10) : ""}</td>
                  <td>
                    {member.status === "WITHDRAW"
                      ? <span className="text-red-500 font-bold">탈퇴</span>
                      : <span className="text-green-600">정상</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetMemberList;