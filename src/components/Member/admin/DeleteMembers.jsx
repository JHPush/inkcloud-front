import { useState } from "react";
import { deleteMember } from "../../../api/memberApi";

const DeleteMembers = ({ selectedEmails = [], onSuccess }) => {
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (selectedEmails.length === 0) {
      setError("삭제할 회원을 선택하세요.");
      return;
    }
    if (!window.confirm("정말로 선택한 회원을 삭제하시겠습니까? 선택된 회원은 탈퇴처리 됩니다.")) return;

    setError("");
    try {
      await deleteMember(selectedEmails);
      window.alert("회원 삭제가 완료되었습니다.");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("회원 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="my-4 w-full">
      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          disabled={selectedEmails.length === 0}
          className="px-2 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          회원 탈퇴
        </button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}

      <div className="flex justify-end mt-3 text-xs text-gray-500">
        ※ 관리자 강제 회원 탈퇴는 복구가 불가능합니다. 탈퇴된 회원은 동일 이메일로 재가입이 일주일간 제한됩니다.
      </div>
    </div>
  );
};

export default DeleteMembers;