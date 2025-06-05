import { useLocation } from "react-router-dom";
import DeleteMembers from "./DeleteMembers";

const GetMemberInfo = () => {
  const location = useLocation();
  const member = location.state?.member;

  if (!member) {
    return <div className="p-6">회원 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">회원 상세 정보</h2>
      <table className="table w-full">
        <tbody>
          <tr>
            <th className="text-right w-32">이메일</th>
            <td>{member.email}</td>
          </tr>
          <tr>
            <th className="text-right">이름</th>
            <td>{member.lastName} {member.firstName}</td>
          </tr>
          <tr>
            <th className="text-right">전화번호</th>
            <td>{member.phoneNumber}</td>
          </tr>
          <tr>
            <th className="text-right">주소</th>
            <td>
              {member.zipcode && <>{member.zipcode} </>}
              {member.addressMain && <>{member.addressMain} </>}
              {member.addressSub && <>{member.addressSub}</>}
            </td>
          </tr>
          <tr>
            <th className="text-right">가입일</th>
            <td>{member.createdAt ? member.createdAt.slice(0, 10) : ""}</td>
          </tr>
          <tr>
            <th className="text-right">상태</th>
            <td>
              {member.status === "WITHDRAW"
                ? <span className="text-red-500 font-bold">탈퇴</span>
                : <span className="text-green-600">정상</span>
              }
            </td>
          </tr>
          {member.rejoinedAt && (
            <tr>
              <th className="text-right">재가입일</th>
              <td>{member.rejoinedAt.slice(0, 10)}</td>
            </tr>
          )}
          {member.withdrawnAt && (
            <tr>
              <th className="text-right">탈퇴일</th>
              <td>{member.withdrawnAt.slice(0, 10)}</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* 회원 단일 탈퇴 버튼 */}
      <div className="mt-6">
        <DeleteMembers
          selectedEmails={[member.email]}
          onSuccess={() => window.location.href = "/admin/member"}
        />
      </div>
    </div>
  );
};

export default GetMemberInfo;