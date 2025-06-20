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
        const data = await getUserInfo({ email });
        setMember(data);
      } catch (e) {
        setMember(null);
      }
    };
    fetchMember();
  }, [email]);

  if (!member) {
    return (
      <div className="p-10 text-lg text-center text-gray-500">
        회원 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">회원 상세 정보</h2>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <th className="text-left py-4 px-6 w-40 bg-gray-50 text-gray-700 font-semibold">
                이메일
              </th>
              <td className="py-4 px-6">{member.email}</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <th className="text-left py-4 px-6 bg-gray-50 text-gray-700 font-semibold">
                이름
              </th>
              <td className="py-4 px-6">
                {member.lastName} {member.firstName}
              </td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <th className="text-left py-4 px-6 bg-gray-50 text-gray-700 font-semibold">
                전화번호
              </th>
              <td className="py-4 px-6">{member.phoneNumber}</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <th className="text-left py-4 px-6 bg-gray-50 text-gray-700 font-semibold">
                주소
              </th>
              <td className="py-4 px-6">
                {member.zipcode && <>{member.zipcode} </>}
                {member.addressMain && <>{member.addressMain} </>}
                {member.addressSub && <>{member.addressSub}</>}
              </td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <th className="text-left py-4 px-6 bg-gray-50 text-gray-700 font-semibold">
                가입일
              </th>
              <td className="py-4 px-6">
                {member.createdAt ? member.createdAt.slice(0, 10) : ""}
              </td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <th className="text-left py-4 px-6 bg-gray-50 text-gray-700 font-semibold">
                상태
              </th>
              <td className="py-4 px-6">
                {member.status === "WITHDRAW" ? (
                  <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 font-bold">
                    탈퇴
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-semibold">
                    정상
                  </span>
                )}
              </td>
            </tr>
            {member.rejoinedAt && (
              <tr className="border-b hover:bg-gray-50">
                <th className="text-left py-4 px-6 bg-gray-50 text-gray-700 font-semibold">
                  재가입일
                </th>
                <td className="py-4 px-6">{member.rejoinedAt.slice(0, 10)}</td>
              </tr>
            )}
            {member.withdrawnAt && (
              <tr className="border-b hover:bg-gray-50">
                <th className="text-left py-4 px-6 bg-gray-50 text-gray-700 font-semibold">
                  탈퇴일
                </th>
                <td className="py-4 px-6">{member.withdrawnAt.slice(0, 10)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end mt-8">
          {member.status !== "WITHDRAW" && (
            <DeleteMembers
              selectedEmails={[member.email]}
              onSuccess={() => window.location.href = "/admin/member"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GetMemberInfo;