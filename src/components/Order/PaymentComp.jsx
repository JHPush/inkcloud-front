import PortOne from "@portone/browser-sdk/v2"
import { useEffect, useState } from "react"
import { getPaymentValidation, postOrderStart, postPaymentSuccess, postValidationAddServer } from "../../api/paymentOrderApi"

const PaymentComp = () => {
    const [items, setItems] = useState([])
    const [user, setUser] = useState(null)
    const [ship, setShip] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState({
        status: "IDLE",
    })

    //   useEffect(() => {
    //     async function loadItem() {
    //       const response = await fetch("/api/item")
    //       setItem(await response.json())
    //     }

    //     loadItem().catch((error) => console.error(error))
    //   }, [])
    useEffect(() => {
        console.log("payment Status : ", paymentStatus)

    }, [paymentStatus])

    useEffect(() => {
        if (items && items.length === 0)
            setItems([
                {
                    name: "객체지향의 사실과 오해",
                    price: 500,
                    quantity: 1,
                    auther: "조영호",
                    publisher: "위키북스",
                    thumbnailUrl: "https://example.com/item1.jpg"
                },
                {
                    name: "클린 코드",
                    price: 500,
                    quantity: 1,
                    auther: "로버트 C. 마틴",
                    publisher: "인사이트",
                    thumbnailUrl: "https://example.com/item2.jpg"
                }
            ])
        if (!user) {
            setUser({
                memberEmail: 'qnrntmvls@gmail.comm',
                memberContact: '010-9524-4987',
                memberName: '박지호',

            })
        }
        if (!ship) {
            setShip({
                name: "김철수",
                receiver: "박지호",
                addressMain: "서울시 강남구 테헤란로 123",
                addressSub: "402호",
                contact: "010-9876-5432"
            })
        }
    }, [])

    if (items && items.length === 0) {
        return (
            <dialog open>
                <article aria-busy>결제 정보를 불러오는 중입니다.</article>
            </dialog>
        )
    }

    function randomId() {
        return [...crypto.getRandomValues(new Uint32Array(2))]
            .map((word) => word.toString(16).padStart(8, "0"))
            .join("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // =====================
        // 여기 재고 확인 api 필요
        // =====================

        const orderStartResult = await postOrderStart({
            price: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            quantity: items.reduce((sum, item) => sum + item.quantity, 0),
            member: user,
            orderItems: items,
            orderShip:ship
        })

        setPaymentStatus({ status: "PENDING" })
        const payment = await PortOne.requestPayment({
            storeId: process.env.REACT_APP_STORE_ID,
            channelKey: process.env.REACT_APP_CHANNEL_ID,
            paymentId: orderStartResult.paymentId,
            orderName: items[0].name + '외 ' + items.reduce((sum, item) => sum + item.quantity, 0) + '건',
            totalAmount: orderStartResult.price,
            currency: "KRW",
            payMethod: "CARD",
            customer: {
                fullName: user.memberName,
                email: user.memberEmail,
                phoneNumber: user.memberContact,
            },
            products: [
                { id: 'testId', name: '테스트이름', amount: 500, quantity: 2 }
            ]
            // customData: {
            //     count: items.reduce((sum, payment)=> sum + payment.count),
            // },
        })
        if (payment.code !== undefined) {
            setPaymentStatus({
                status: "FAILED",
                message: payment.message,
            })
            return
        }
        console.log('status : ', payment.code);
        setPaymentStatus(payment.transactionType === "PAYMENT" ? { status: 'PAID' } : { status: 'FAILED' })
    }

    const isWaitingPayment = paymentStatus.status !== "IDLE"

    const handleClose = () =>
        setPaymentStatus({
            status: "IDLE",
        })

    return (
        <>
            <main>
                <form onSubmit={handleSubmit}>
                    <article>
                        <div className="item">
                            <div className="item-image">
                                <img src={`/${items[0].id}.png`} />
                            </div>
                            <div className="item-text">
                                {items.map((item, idx) => (
                                    <>
                                        <h5>상품명 : {item.name}</h5>
                                        <p>결제 수량 : {item.quantity}</p>
                                        <p>결제 금액 : {item.price}원</p>
                                    </>
                                )
                                )}
                            </div>
                        </div>
                        <div className="price">
                            <label>총 구입 가격</label>
                            {items.reduce((sum, item) => sum + item.price * item.quantity, 0)}원
                        </div>
                    </article>
                    <button
                        type="submit"
                        aria-busy={isWaitingPayment}
                        disabled={isWaitingPayment}
                    >
                        결제
                    </button>
                </form>
            </main>
            {paymentStatus.status === "FAILED" && (
                <dialog open>
                    <header>
                        <h1>결제 실패</h1>
                    </header>
                    <p>{paymentStatus.message}</p>
                    <button type="button" onClick={handleClose}>
                        닫기
                    </button>
                </dialog>
            )}
            <dialog open={paymentStatus.status === "PAID"}>
                <header>
                    <h1>결제 성공</h1>
                </header>
                <p>결제에 성공했습니다.</p>
                <button type="button" onClick={handleClose}>
                    닫기
                </button>
            </dialog>
        </>
    )
}

export default PaymentComp;