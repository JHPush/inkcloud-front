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
      await withdrawMyself(); // JWT 토큰으로 본인 탈퇴 요청

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
    <div>
      <div className="mb-4 text-lg font-bold">회원 탈퇴</div>
      <button className="btn btn-error" onClick={handleWithdraw}>
        회원 탈퇴하기
      </button>
    </div>
  );
};

export default WithdrawMember;