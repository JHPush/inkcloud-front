import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrderInfo } from "../../api/paymentApi";



const OrderCompleteComp = () => {
    const loc = useLocation()
    const navi = useNavigate();
    const [order, setOrder] = useState(null);


    useEffect(()=>{
        const data = loc.state;
        getOrderInfo(data.orderId).then((res)=>{
            setOrder(res)
            console.log("res :: ",res);
        }).catch(e=>{
            console.error('에러 : ', e)
        });

    }, [])

    const handleToHome = ()=>{
        navi('/', {replace:true})
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* 상단 메시지 */}
            <div className="bg-white rounded-2xl shadow-md p-8 mb-10 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다</h1>
                <p className="text-gray-600">구매해주셔서 감사합니다! 곧 배송해드릴게요.</p>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="flex flex-col md:flex-row gap-8 mb-10">
                {/* 메인 영역: 배송정보 + 상품 */}
                <div className="flex-1 space-y-8">
                    {/* 배송 정보 */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">배송 정보</h2>
                        <div className="space-y-2 text-gray-700 text-sm leading-relaxed">
                            <div><span className="font-medium font-semibold">받는 분:</span> {order?.orderShip.name}</div>
                            <div><span className="font-medium font-semibold">연락처:</span> {order?.orderShip.contact}</div>
                            <div>
                                <span className="font-medium font-semibold">주소:</span><br />
                                {order?.orderShip.addressMain}<br />
                                {order?.orderShip.addressSub}
                            </div>
                            {/* <div><span className="font-medium">배송 업체:</span> 내맘대로 통운</div> */}
                        </div>
                    </div>

                    {/* 구매 상품 */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">구매한 상품 ({order?.quantity})</h2>
                        <ul className="divide-y text-sm text-gray-800">
                            {
                            order?.orderItems.map((item, idx) => (
                                <li key={idx} className="py-4 flex justify-between items-center">
                                    <img src={item.thumbnailUrl} alt={item.name} className="h-auto rounded shadow" />
                                    <span className="flex text-gray-700 text-left self-end font-medium font-semibold">{item.name}</span>
                                    <div><span className="font-medium font-semibold">수량 : </span> {item.quantity}<span className="font-medium font-semibold">   가격 : </span> {item.price}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 우측 사이드 정보 */}
                <aside className="w-full md:w-80 shrink-0 space-y-6">
                    {/* 주문자 정보 */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">주문자 정보</h2>
                        <div className="space-y-2 text-gray-700 text-sm leading-relaxed">
                            <div><span className="font-medium font-semibold">이름:</span> {order?.member.memberName}</div>
                            <div><span className="font-medium font-semibold">이메일:</span> {order?.member.memberEmail}</div>
                            <div><span className="font-medium font-semibold">연락처:</span> {order?.member.memberContact}</div>
                        </div>
                    </div>

                    {/* 결제 정보 */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 border-b pb-2">결제 정보</h2>
                        <div className="space-y-2 text-gray-700 text-sm leading-relaxed">
                            <div><span className="font-medium font-semibold">주문 번호:</span> {order?.id}</div>
                            <div><span className="font-medium font-semibold">결제 수단:</span> {order?.paymentDto.method}</div>
                            <div><span className="font-medium font-semibold">총 결제금액:</span> {order?.paymentDto.price}</div>
                            <div><span className="font-medium font-semibold">배송비:</span> 무료배송</div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* CTA 버튼 */}
            <div className="text-center">
                <button onClick={handleToHome} type="button" className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition">
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
}

export default OrderCompleteComp