import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../../api/memberApi";
import DeleteMembers from "./DeleteMembers";

const GetMemberInfo = () => {
  const { email } = useParams();
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await getUserInfo({email});
        setMember(data);
  
      } catch (e) {
        setMember(null);
      }
    };
    fetchMember();
  }, [email]);

  if (!member) {
    return <div className="p-10 text-lg text-center text-gray-500">회원 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="w-full min-h-[80vh] bg-gray-50 flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-10 mt-8 text-gray-800 text-left px-16">회원 상세 정보</h2>
      <div className="w-full px-16">
        <table className="w-full border-t border-b border-gray-300 bg-white">
          <tbody>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 w-48 bg-gray-50 text-gray-700 font-semibold border-b">이메일</th>
              <td className="py-4 px-6 border-b">{member.email}</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">이름</th>
              <td className="py-4 px-6 border-b">{member.lastName} {member.firstName}</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">전화번호</th>
              <td className="py-4 px-6 border-b">{member.phoneNumber}</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">주소</th>
              <td className="py-4 px-6 border-b">
                {member.zipcode && <>{member.zipcode} </>}
                {member.addressMain && <>{member.addressMain} </>}
                {member.addressSub && <>{member.addressSub}</>}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">가입일</th>
              <td className="py-4 px-6 border-b">{member.createdAt ? member.createdAt.slice(0, 10) : ""}</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">상태</th>
              <td className="py-4 px-6 border-b">
                {member.status === "WITHDRAW"
                  ? <span className="text-red-500 font-bold">탈퇴</span>
                  : <span className="text-green-600 font-semibold">정상</span>
                }
              </td>
            </tr>
            {member.rejoinedAt && (
              <tr className="hover:bg-gray-100">
                <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">재가입일</th>
                <td className="py-4 px-6 border-b">{member.rejoinedAt.slice(0, 10)}</td>
              </tr>
            )}
            {member.withdrawnAt && (
              <tr className="hover:bg-gray-100">
                <th className="text-right py-4 px-6 bg-gray-50 text-gray-700 font-semibold border-b">탈퇴일</th>
                <td className="py-4 px-6 border-b">{member.withdrawnAt.slice(0, 10)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end mt-8">
          <DeleteMembers
            selectedEmails={[member.email]}
            onSuccess={() => window.location.href = "/admin/member"}
          />
        </div>
      </div>
    </div>
  );
};

export default GetMemberInfo;