import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMemberOrders } from "../../api/orderApi1";
import WriteReview from "./WriteReview";

const GetOrderItemList = () => {
  const [items, setItems] = useState([]);
  const user = useSelector((state) => state.login.user);

  const refreshOrderItems = async () => {
    try {
      const data = await getMemberOrders();
      console.log(data)
      const allOrderItems = data?.content
        .flatMap((order) => order.orderItems || []);
      // itemId 기준 중복 제거
      const uniqueItems = Array.from(
        new Map(allOrderItems.map((item) => [item.itemId, item])).values()
      );

      // 회원이 작성한 리뷰 목록 가져오기
      const { getReviewsByMember } = await import("../../api/reviewApi");
      const myReviews = await getReviewsByMember();
      const reviewedItemIds = myReviews.map(r => String(r.productId));

      // 이미 리뷰 작성한 아이템은 제외
      const filteredItems = uniqueItems.filter(
        item => !reviewedItemIds.includes(String(item.itemId))
      );

      setItems(filteredItems);
    } catch (e) {
      console.error("error:", e);
    }
  };

  useEffect(() => {
    if (user?.email) refreshOrderItems();
  }, [user]);

  return (
    <div>
      {items.length === 0 ? (
        <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm min-h-[30vh]">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.364 17.364A9 9 0 1 1 17.364 15.364M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0"
            />
          </svg>
          <div className="text-lg text-gray-500 font-semibold mb-2">
            작성 가능한 리뷰가 없습니다.
          </div>
          <div className="text-sm text-gray-400">
            주문 후 배송 완료된 상품만 리뷰를 작성할 수 있습니다.
          </div>
        </div>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.itemId}
              className="mb-6 pb-4 border-b flex gap-4 items-center"
            >
              <img
                src={item.thumbnailUrl}
                alt={item.name}
                className="w-20 h-28 object-cover rounded border"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">{item.name}</span>
                  <span className="text-base font-bold text-blue-700">{item.price}원</span>
                </div>
                <div className="text-sm text-gray-500 mt-1 mb-2">
                  저자: {item.author} | 출판사: {item.publisher}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  수량: {item.quantity}
                </div>
                {/* WriteReview 컴포넌트 사용 */}
                <WriteReview orderItem={item} onSuccess={refreshOrderItems} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetOrderItemList;
