import PortOne from "@portone/browser-sdk/v2"
import { useEffect, useState } from "react"
import { getPaymentValidation, postPaymentSuccess, postValidationAddServer } from "../../../api/paymentApi"

const PaymentComp = () => {
    const [items, setItems] = useState([])
    const [user, setUser] =useState(null)
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
    useEffect(()=>{
        console.log("payment Status : ", paymentStatus)

    },[paymentStatus])

    useEffect(() => {
        if (items && items.length === 0)
            setItems([{
                name: "테스트",
                price: 500,
                count: 2
            }])
        if(!user){
            setUser({
                fullName:'테스트유저',
                email:'qnrntmvls@gmail.com',
                phoneNumber:'01095244987'
                
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
        const paymentId = randomId()
        e.preventDefault()

        const addValidationResponse = await postValidationAddServer({
                                    paymentId: paymentId,
                                    email: user.email,
                                    // method:"CARD",
                                    totalCount: items.reduce((sum, item)=> sum + item.count,0), 
                                    totalAmount: items.reduce((sum, item)=> sum + item.count * item.price,0)
                                })
        setPaymentStatus({ status: "PENDING" })
        const payment = await PortOne.requestPayment({
            storeId: process.env.REACT_APP_STORE_ID,
            channelKey: process.env.REACT_APP_CHANNEL_ID,
            paymentId,
            orderName: items[0].name,
            totalAmount: items.reduce((sum, payment)=>  sum + payment.price*payment.count, 0),
            currency: "KRW",
            payMethod: "CARD",
            customer: {
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
            products: [
                {id: 'testId', name:'테스트이름', amount:500, quantity:2}
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
        setPaymentStatus(payment.transactionType === "PAYMENT"?{status:'PAID'}:{status:'FAILED'}) 
        
        
       
        // console.log('res : ',addValidationResponse)
        // if (completeResponse.ok) {
        //     console.log("paymentComp Data : ", completeResponse)
        //     setPaymentStatus({
        //         status: completeResponse.status,
        //     })
        // } else {
        //     setPaymentStatus({
        //         status: "FAILED",
        //         message: completeResponse,
        //     })
        // }
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
                                {items.map((item, idx)=>(
                                <>
                                <h5>상품명 : {item.name}</h5>
                                <p>결제 수량 : {item.count}</p>
                                <p>결제 금액 : {item.price}원</p>
                                </>
                                )
                                )}
                            </div>
                        </div>
                        <div className="price">
                            <label>총 구입 가격</label>
                            {items.reduce((sum, payment)=>  sum + payment.price*payment.count, 0)}원
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