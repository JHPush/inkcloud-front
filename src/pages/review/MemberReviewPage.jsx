import { useState } from "react";
import MemberReviewList from "../../components/review/MemberReviewList";
import GetOrderItemList from "../../components/review/GetOrderItemList";

const MemberReviewPage = () => {
  const [tab, setTab] = useState("written"); // written: 작성한 리뷰, writable: 작성 가능한 리뷰

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-2 mb-6">
        <button
          className={`px-3 py-2 rounded ${tab === "writable" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("writable")}
        >
          작성 가능한 리뷰
        </button>
        <button
          className={`px-3 py-2 rounded ${tab === "written" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("written")}
        >
          내가 작성한 리뷰
        </button>
      </div>
      <div>
        {tab === "writable" && <GetOrderItemList />}
        {tab === "written" && <MemberReviewList />}
      </div>
    </div>
  );
};

export default MemberReviewPage;