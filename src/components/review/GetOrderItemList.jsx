import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMemberOrders } from "../../api/orderApi1";
import { writeReview, updateReview } from "../../api/reviewApi";
import ReviewForm from "./ReviewForm";

const GetOrderItemList = () => {
  const [items, setItems] = useState([]);
  const [openForm, setOpenForm] = useState(null); // {item, mode, review}
  const user = useSelector((state) => state.login.user);

  const refreshOrderItems = async () => {
    try {
      const data = await getMemberOrders(user.email);
      const allOrderItems = data.content
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
      // console.log(items)
    } catch (e) {
      console.error("error:", e);
    }
  };

  useEffect(() => {
    if (user?.email) refreshOrderItems();
  }, [user]);

  // 리뷰 작성/수정 완료 시
  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!openForm) return;
    const { item, mode } = openForm;
    try {
      await writeReview({
        productId: item.itemId,
        productName: item.name,
        rating,
        comment,
      });
      alert("리뷰가 등록되었습니다.");
      setOpenForm(null);
      refreshOrderItems();
    } catch (e) {
      // // 409: 이미 리뷰가 있음
      // if (e?.response?.status === 409) {
      //   const reviewId = e.response.data.reviewId
      //   console.log("reviewId:", reviewId)
      //   if (window.confirm("이미 작성한 리뷰가 있습니다. 이 내용으로 리뷰를 수정하시겠습니까?")) {
      //     // 기존 리뷰 정보 없이 바로 덮어쓰기(수정)
      //     // 서버에서 productId로 리뷰를 찾아서 수정한다고 가정
      //     try {
      //       await updateReview(
      //         reviewId, // 기존 리뷰 id를 모를 때, 서버에서 productId로 처리하도록 구현 필요
      //         { rating, comment }
      //       );
      //       alert("리뷰가 수정되었습니다.");
      //       setOpenForm(null);
      //       refreshOrderItems();
      //     } catch (err) {
      //       alert("리뷰 수정에 실패했습니다.");
      //       setOpenForm(null);
      //     }
      //   } else {
      //     setOpenForm(null);
      //   }
      // } else {
      //   alert("리뷰 등록에 실패했습니다.");
      //   setOpenForm(null);
      // }
      console.error(e);
    }
  };

  return (
    <>
  
    <div>
    {items.length === 0 ? (
      <div>작성 가능한 리뷰가 없습니다.</div>
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
              <button
                className="text-blue-600 border border-blue-400 px-3 py-1 rounded hover:bg-blue-50 text-sm"
                onClick={() => setOpenForm({ item, mode: "write" })}
              >
                리뷰작성
              </button>
            </div>
            {openForm && openForm.item.itemId === item.itemId && (
              <ReviewForm
                open={!!openForm}
                onClose={() => setOpenForm(null)}
                productName={item.name}
                initialRating={openForm.mode === "edit" ? openForm.review?.rating : 0}
                initialComment={openForm.mode === "edit" ? openForm.review?.comment : ""}
                onSubmit={handleReviewSubmit}
              />
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
    </>
  );
};

export default GetOrderItemList;
