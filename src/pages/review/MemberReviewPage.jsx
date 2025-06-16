import { useState } from "react";
import MemberReviewList from "../../components/review/MemberReviewList";
import GetOrderItemList from "../../components/review/GetOrderItemList";

const MemberReviewPage = () => {
  const [tab, setTab] = useState("written"); // written: 작성한 리뷰, writable: 작성 가능한 리뷰

  return (
    <div className="w-full h-full flex flex-col items-center bg-white-50 min-h-[70vh] py-10">
      <div className="w-full max-w-4xl">
        <div className="flex gap-4 mb-6 justify-center">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition border-2
              ${tab === "writable"
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-blue-600 border-blue-400 hover:bg-blue-50"}
            `}
            onClick={() => setTab("writable")}
          >
            작성 가능한 리뷰
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition border-2
              ${tab === "written"
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-blue-600 border-blue-400 hover:bg-blue-50"}
            `}
            onClick={() => setTab("written")}
          >
            내가 작성한 리뷰
          </button>
        </div>
        <div className="bg-white rounded-2xl p-10 min-h-[50vh] w-full">
          {tab === "writable" && <GetOrderItemList />}
          {tab === "written" && <MemberReviewList />}
        </div>
      </div>
    </div>
  );
};

export default MemberReviewPage;