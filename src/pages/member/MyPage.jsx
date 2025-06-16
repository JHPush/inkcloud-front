import { useEffect, useRef, useState } from "react";
import MyInfoPage from "./MyInfoPage";
import WithdrawMember from "../../components/Member/WithdrawMember"; 
import { useLocation, useNavigate } from "react-router-dom";
import ShippingList from "../../components/Member/shipping/ShippingList";
import MemberLayout from "../../layouts/MemberLayout";
import MemberReviewPage from "../review/MemberReviewPage";
import { getAccessToken } from "../../utils/cookieUtils";

const MyPage = () => {
  const [tab, setTab] = useState("info");
  const [blocked, setBlocked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const alerted = useRef(false);

  // 토큰 없으면 접근 막기
  useEffect(() => {
    const token = getAccessToken();
    if (!token && !alerted.current) {
      alerted.current = true;
      window.alert("로그인이 필요합니다.");
      setBlocked(true);
      navigate("/login");
    }
  }, [navigate]);

  // location에서 tab 상태 받아오기
  useEffect(() => {
    if (location.state?.tab) {
      setTab(location.state.tab);
    }
  }, [location.state]);

  if (blocked) return null;

  return (
    <MemberLayout tab={tab} setTab={setTab}>
      {tab === "info" && <MyInfoPage />}
      {tab === "review" && <MemberReviewPage />}
      {tab === "address" && <ShippingList />}
      {tab === "withdraw" && <WithdrawMember />}
    </MemberLayout>
  );
};

export default MyPage;