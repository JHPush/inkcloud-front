import { useEffect, useState } from "react";
import BasicLayout from "../../layouts/BasicLayout";
import MyInfoPage from "./MyInfoPage";
import WithdrawMember from "../../components/Member/WithdrawMember"; 
import { useLocation } from "react-router-dom";
import ShippingList from "../../components/Member/shipping/ShippingList";

const MyPage = () => {
  const [tab, setTab] = useState("info");
  const location = useLocation();

  //location 에서 tab 상태 받아오기
  useEffect(() =>{
    if(location.state?.tab){
      setTab(location.state.tab);
    }
  },[location.state])

  return (
    <BasicLayout>
      <div className="text-3xl mb-4">마이페이지</div>
      <div className="flex gap-4 mb-6">
        <button
          className={`btn btn-outline ${tab === "info" ? "btn-active" : ""}`}
          onClick={() => setTab("info")}
        >
          내 정보
        </button>
        <button
          className={`btn btn-outline ${tab === "address" ? "btn-active" : ""}`}
          onClick={() => setTab("address")}
        >
          배송지 관리
        </button>
        <button
          className={`btn btn-outline ${tab === "withdraw" ? "btn-active" : ""}`}
          onClick={() => setTab("withdraw")}
        >
          회원탈퇴
        </button>
      </div>
      {tab === "info" && <MyInfoPage />}
      {tab === "address" && <ShippingList />}
      {tab === "withdraw" && <WithdrawMember />}
    </BasicLayout>
  );
};

export default MyPage;