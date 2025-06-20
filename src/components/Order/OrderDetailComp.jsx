import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderInfo, patchOrdersWithState, patchUpdateOrdersWithState, putCancelOrder } from "../../api/paymentOrderApi";
import { getMyInfo } from "../../api/memberApi";
import { getReviewsByMember } from "../../api/reviewApi";
import WriteReview from "../review/WriteReview";
import { useSelector } from "react-redux";

const statusMapping = {
  PREPARE: "상품준비중",
  SHIPPING: "배송중",
  SHIPPED: "배송완료",
  CANCELED: "주문취소",
  FAILED: "주문오류",
};

const OrderDetailComp = () => {
  const user = useSelector(state => state.login.user);
  const [order, setOrder] = useState();
  const [reviewedItemIds, setReviewedItemIds] = useState([]);
  const { id } = useParams();
  const [stateType, setStateType] = useState("PREPARE");

  const refreshOrder = async () => {
    console.log('id : ', id)
    if (!id) return;

    const myOrderRes = await getOrderInfo(id);
    const myReviewRes = await getReviewsByMember();
    if (!myOrderRes) {
      alert('내 주문 조회 실패')
      return;
    }
    if (!myReviewRes) {
      alert('내 리뷰 조회 실패')
      return;
    }
    setOrder(myOrderRes);
    setReviewedItemIds(myReviewRes.map(r => String(r.productId)));
  }

  useEffect(() => {
    refreshOrder()
  }, [id]);

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

  const handleOnUpdateOrders = async (id) => {
    const res = await patchOrdersWithState(id, stateType);
    console.log('reer : ', res)
    setOrder(res);
    alert('상태가 반영되었습니다.')
  }

  const getStatusColor = (state) => {
    switch (state) {
      case "PREPARE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SHIPPING": return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED": return "bg-green-100 text-green-800 border-green-200";
      case "CANCELED": return "bg-red-100 text-red-800 border-red-200";
      case "FAILED": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">주문 상세</h1>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order?.state)}`}>
                {statusMapping[order?.state] || order?.state}
              </div>
            </div>

            {user?.role === "ADMIN" && (
              <div className="flex items-center gap-2">
                <select
                  value={stateType}
                  onChange={(e) => setStateType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PREPARE">상품준비중</option>
                  <option value="SHIPPING">배송중</option>
                  <option value="SHIPPED">배송완료</option>
                </select>
                <button
                  onClick={() => handleOnUpdateOrders(order.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  상태 변경
                </button>
              </div>
            )}

            {order?.state === "PREPARE" && (
              <button
                onClick={handleCancelOrder}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                주문 취소
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                주문 상품
              </h2>
              <div className="space-y-4">
                {order?.orderItems.map((item, idx) => {
                  const orderDate = new Date(order.createdAt);
                  const now = new Date();
                  const diffMonth = (now.getFullYear() - orderDate.getFullYear()) * 12 + (now.getMonth() - orderDate.getMonth());

                  return (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">저자: {item.author}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>수량: {item.quantity}개</span>
                            <span className="font-semibold text-gray-900">{(item.price * item.quantity).toLocaleString()}원</span>
                          </div>
                          {order.state === "SHIPPED" && diffMonth < 60 && !reviewedItemIds.includes(String(item.itemId)) && (
                            <WriteReview
                              orderItem={item}
                              onSuccess={refreshOrder}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                결제 정보
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">결제 금액</p>
                    <p className="text-2xl font-bold text-gray-900">{order?.paymentDto.price.toLocaleString()}원</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">결제 수단</p>
                    <p className="font-semibold text-gray-900">{order?.paymentDto.method}</p>
                    <p className="text-sm text-gray-600">PG: {order?.paymentDto.pg}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">결제일시</p>
                    <p className="font-medium text-gray-900">{new Date(order?.paymentDto.at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                주문 정보
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">주문번호</span>
                  <span className="font-mono text-sm font-medium">{order?.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">주문일시</span>
                  <span className="font-medium">{new Date(order?.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                주문자 정보
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">이름</span>
                  <span className="font-medium">{order?.member.memberName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">이메일</span>
                  <span className="font-medium">{order?.member.memberEmail}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">연락처</span>
                  <span className="font-medium">{order?.member.memberContact}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                배송지 정보
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">수령인</span>
                  <span className="font-medium">{order?.orderShip.receiver}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">연락처</span>
                  <span className="font-medium">{order?.orderShip.contact}</span>
                </div>
                <div className="py-2">
                  <span className="text-gray-600 block mb-2">주소</span>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-mono text-gray-700">[{order?.orderShip.zipcode}]</p>
                    <p className="font-medium text-gray-900">{order?.orderShip.addressMain}</p>
                    <p className="text-gray-700">{order?.orderShip.addressSub}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailComp;