import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderInfo, putCancelOrder } from "../../api/paymentOrderApi";
import { getReviewsByMember } from "../../api/reviewApi";
import WriteReview from "../review/WriteReview";

// mock data
const mockOrder = {
  id: '23423',
  createdAt: "2025-06-11T05:21:24.366348",
  updatedAt: "2025-06-11T05:21:24.366354",
  member: {
    name: "지호박",
    contact: "01043544354",
    email: "a@gmail.com",
  },
  orderItems: [
    {
      itemId: "1",
      name: "자바스페셜2",
      price: 1000,
      quantity: 1,
      author: "남궁성",
    },
  ],
  orderShip: {
    receiver: "지호박",
    contact: "01043544354",
    zipcode: "6364",
    addressMain: "서울 강남구 밤고개로 120",
    addressSub: "",
  },
  paymentDto: {
    price: 1000,
    count: 1,
    method: "CARD",
    pg: "INICIS_V2",
    at: "2025-06-11T14:21:53.857693",
  },
  state: "PENDING",
};

const statusMapping = {
  PREPARE: "상품준비중",
  SHIPPING: "배송중",
  SHIPPED: "배송완료",
  CANCELED: "주문취소",
  FAILED: "주문오류",
};

const OrderDetailComp = () => {

  const [order, setOrder] = useState();
  const [reviewedItemIds, setReviewedItemIds] = useState([]);
  const { id } = useParams();

  // 주문 상세 새로고침 함수
  const refreshOrder = async () => {
    if (!id) return;
    try {
      const data = await getOrderInfo(id);
      setOrder(data);
      // 리뷰 목록도 같이 갱신
      const myReviews = await getReviewsByMember();
      setReviewedItemIds(myReviews.map(r => String(r.productId)));
    } catch (e) {
      console.error('데이터 조회 실패 : ', e);
    }
  };

  useEffect(() => {
    refreshOrder();
  }, [id]);


  // 내 리뷰 목록 조회
  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const myReviews = await getReviewsByMember();
        setReviewedItemIds(myReviews.map(r => String(r.productId)));
      } catch (e) {
        console.error("내 리뷰 목록 조회 실패:", e);
      }
    };
    fetchMyReviews();
  }, []);


  console.log('order : ', order)

  const handleCancelOrder = () => {
    if (!window.confirm('주문을 취소하시겠습니까?'))
      return;
    const res = putCancelOrder(id).then(data => {
      console.log('주문취소 완료')
      alert('주문이 취소되었습니다')
      window.history.back();
    }).catch(e => {
      console.error('주문 취소 실패')

    })

  }

  return (

    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mb-6">주문 상세</h1>
        {order?.state === "PREPARE" ? <button
          onClick={handleCancelOrder}
          className="text-white text-sm m-1 rounded bg-red-500 px-3 py-1 ml-auto">
          주문 취소
        </button> : <></>}

      </div>

      <div className="bg-white p-6 rounded-2xl shadow space-y-6">

        {/* 주문 요약 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">주문 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p>주문번호: {order?.id}</p>
            <p>주문일시: {new Date(order?.createdAt).toLocaleString()}</p>
            <p>주문 상태:
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${order?.state === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
                }`}>
                {statusMapping[order?.state] || order?.state}
              </span>
            </p>
          </div>
        </div>

        {/* 주문자 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">주문자 정보</h2>
          <div className="text-sm space-y-1">
            <p>이름: {order?.member.memberName}</p>
            <p>이메일: {order?.member.memberEmail}</p>
            <p>연락처: {order?.member.memberContact}</p>
          </div>
        </div>

        {/* 배송지 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">배송지 정보</h2>
          <div className="text-sm space-y-1">
            <p>수령인: {order?.orderShip.receiver}</p>
            <p>연락처: {order?.orderShip.contact}</p>
            <p>주소: [{order?.orderShip.zipcode}] {order?.orderShip.addressMain} {order?.orderShip.addressSub}</p>
          </div>
        </div>

        {/* 상품 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">주문 상품</h2>
          <div className="space-y-3 text-sm">
            {order?.orderItems.map((item, idx) => {
              // 주문일로부터 6개월(약 183일) 이내인지 계산
              const orderDate = new Date(order.createdAt);
              const now = new Date();
              //테스트용 코드 (1분 뒤 계산)
              // const diffSeconds = (now - orderDate) / 1000; // 초 단위 차이
              // console.log("diffSeconds:", diffSeconds, "orderDate:", orderDate, "now:", now);
              const diffMonth = (now.getFullYear() - orderDate.getFullYear()) * 12 + (now.getMonth() - orderDate.getMonth());
        

              return (
                <div key={idx} className="flex justify-between items-end border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">저자: {item.author}</p>
                  </div>
                  <div className="text-right">
                    <p>수량: {item.quantity}</p>
                    <p>{(item.price * item.quantity).toLocaleString()}원</p>
                    {/* SHIPPED 상태이고 6개월 이내이고 리뷰 작성 하지 않은 경우에만 리뷰작성 버튼 노출 */}
                    {order.state === "SHIPPED" && diffMonth < 60 && !reviewedItemIds.includes(String(item.itemId)) && (
                      <WriteReview
                        orderItem={item}
                        onSuccess={refreshOrder}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 결제 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">결제 정보</h2>
          <div className="text-sm space-y-1">
            <p>결제 금액: {order?.paymentDto.price.toLocaleString()}원</p>
            <p>결제 수단: {order?.paymentDto.method} (PG: {order?.paymentDto.pg})</p>
            <p>결제일시: {new Date(order?.paymentDto.at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrderDetailComp