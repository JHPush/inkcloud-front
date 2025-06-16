import { useNavigate } from "react-router-dom";
import { withdrawMyself } from "../../api/memberApi";
import { removeAccessToken } from "../../utils/cookieUtils";
import { useDispatch } from "react-redux";
import { logout } from "../../store/loginSlice";

const WithdrawMember = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleWithdraw = async () => {
    if (!window.confirm("정말로 회원을 탈퇴하시겠습니까? 탈퇴 후 7일간 가입이 불가능합니다.")) return;
    try {
      await withdrawMyself();
      removeAccessToken();
      dispatch(logout());
      window.alert("회원 탈퇴가 완료되었습니다.");
      navigate('/');
    } catch (err) {
      window.alert("회원 탈퇴에 실패했습니다.");
      console.log("err:", err)
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl p-10 flex flex-col items-center">
      <div className="text-2xl font-bold text-gray-600 mb-4">회원 탈퇴</div>
      <div className="text-gray-700 text-center mb-6">
        탈퇴 시 7일간 재가입이 불가능합니다.<br />
        정말로 탈퇴하시겠습니까?
      </div>
      <button
        className="px-4 py-2 rounded-lg bg-red-400 text-white font-semibold hover:bg-gray-300 transition"
        onClick={handleWithdraw}
      >
        회원 탈퇴하기
      </button>
    </div>
  );
};

export default WithdrawMember;