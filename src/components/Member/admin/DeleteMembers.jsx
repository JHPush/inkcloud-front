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
    <div className="my-4">
      <button
        className="btn btn-error"
        onClick={handleDelete}
        disabled={selectedEmails.length === 0}
      >탈퇴
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default DeleteMembers;