import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrderInfo } from "../../api/paymentOrderApi";

const OrderCompleteComp = () => {
    const loc = useLocation()
    const navi = useNavigate();
    const [order, setOrder] = useState(null);

    let retryCount = 0;
    const MAX_RETRY = 10;

    useEffect(() => {
        const data = loc.state;
        if (data?.orderId)
            getOrderComplete(data.orderId);
        else
            console.error('주문 정보 없음')

    }, [])

    const getOrderComplete = async (orderId) => {
        if (retryCount >= MAX_RETRY) {
            console.error('최대 재시도 횟수 초과');
            return;
        }
        const res = await getOrderInfo(orderId);
        if (res.paymentDto.price === 0 && retryCount < MAX_RETRY) {
            retryCount++;
            console.log('결제 정보 미완료, 재시도:', retryCount);
            setTimeout(() => getOrderComplete(orderId), 500);
            return;
        }
        setOrder(res);
    };

    const handleToHome = () => {
        navi('/', { replace: true })
    }

    if (!order) {
        return (
            <div className="max-w-6xl mx-auto px-8 py-12 text-center">
                <div className="text-gray-500">주문 정보를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-8 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">주문이 완료되었습니다</h1>
                    <p className="text-lg text-gray-600 mb-6">구매해주셔서 감사합니다! 곧 배송해드릴게요.</p>
                    <div className="inline-block bg-gray-100 rounded-lg px-6 py-3 text-gray-700">
                        <span className="font-medium">주문번호:</span> {order.id}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-8 py-10">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column - 8/12 */}
                    <div className="col-span-8 space-y-8">
                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">
                                구매한 상품 ({order.quantity}개)
                            </h2>

                            <div className="space-y-6">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <img
                                            src={item.thumbnailUrl}
                                            alt={item.name}
                                            className="w-20 h-24 object-cover rounded-lg shadow-sm"
                                        />
                                        <div className="ml-6 flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="text-gray-600">
                                                    <span className="font-medium">수량:</span> {item.quantity}개
                                                </div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {item.price.toLocaleString()}원
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white rounded-xl shadow-sm border p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">배송 정보</h2>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">받는 분</label>
                                        <p className="text-lg text-gray-900">{order.orderShip.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">연락처</label>
                                        <p className="text-lg text-gray-900">{order.orderShip.contact}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">배송 주소</label>
                                    <p className="text-lg text-gray-900 leading-relaxed">
                                        ({order.orderShip.zipcode}) {order.orderShip.addressMain}<br />
                                        {order.orderShip.addressSub}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 4/12 */}
                    <div className="col-span-4 space-y-8">
                        {/* Customer Info */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b">주문자 정보</h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">이름</span>
                                    <p className="text-base font-semibold text-gray-900">{order.member.memberName}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">이메일</span>
                                    <p className="text-base font-semibold text-gray-900">{order.member.memberEmail}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">연락처</span>
                                    <p className="text-base font-semibold text-gray-900">{order.member.memberContact}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b">결제 정보</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">결제 수단</span>
                                    <span className="font-semibold text-gray-900">
                                        {order.paymentDto.method === 'CARD' ? '신용카드' : order.paymentDto.method}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">상품 금액</span>
                                    <span className="font-semibold text-gray-900">{order.paymentDto.price.toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">배송비</span>
                                    <span className="font-semibold text-green-600">무료배송</span>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">총 결제금액</span>
                                        <span className="text-2xl font-bold text-blue-600">{order.paymentDto.price.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Home Button */}
                        <button
                            onClick={handleToHome}
                            className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            홈으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderCompleteComp