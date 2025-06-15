import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderInfo, patchOrdersWithState, patchUpdateOrdersWithState, putCancelOrder } from "../../api/paymentOrderApi";
import { getMyInfo } from "../../api/memberApi";

const statusMapping = {
  PREPARE: "상품준비중",
  SHIPPING: "배송중",
  SHIPPED: "배송완료",
  CANCELED: "주문취소",
  FAILED: "주문오류",
};


const OrderDetailComp = () => {
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState();
  const { id } = useParams();
  const [stateType, setStateType] = useState("PREPARE");

  useEffect(() => {
    if (!id) return;

    getMyInfo().then(data => {
      setUser(data)
    }).catch(e => {
      console.error('내 정보 조회 실패')
    })


    getOrderInfo(id).then(data => {
      setOrder(data);
    }).catch(e => {
      console.error('데이터 조회 실패 : ', e)
    })
  }, [id])


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

  return (

    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mb-6">주문 상세</h1>
        {order?.state === "PREPARE" || user?.role === "ADMIN" ?
          <>
            <div className="flex items-center gap-2">
              <select value={stateType}
                onChange={(e) => setStateType(e.target.value)}
                className="border rounded px-3 py-1">
                <option value="PREPARE">상품준비중</option>
                <option value="SHIPPING">배송중</option>
                <option value="SHIPPED">배송완료</option>
                {/* <option value="CANCELED">주문 취소</option> */}
              </select>
              <button onClick={() => handleOnUpdateOrders(order.id)} type="button" className="bg-blue-500 text-white px-4 py-1 rounded">
                변경
              </button>
            </div>
            <button
              onClick={handleCancelOrder}
              className="text-white text-sm m-1 rounded bg-red-500 px-3 py-1 ml-auto">
              주문 취소
            </button>
          </>
          : <></>}

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
            {order?.orderItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">저자: {item.author}</p>
                </div>
                <div className="text-right">
                  <p>수량: {item.quantity}</p>
                  <p>{(item.price * item.quantity).toLocaleString()}원</p>
                </div>
              </div>
            ))}
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