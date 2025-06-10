import { useEffect, useRef, useState } from "react";
import { getMyInfo } from "../../api/memberApi";
import { getShipList, modifyShip, registerShip } from "../../api/shipApi";
import { postOrderStart } from "../../api/paymentApi";
import PortOne from "@portone/browser-sdk/v2";

const dummyCartItems = [
    {
        itemId: '1',
        name: "그때 어떻게 살건인가",
        author: "김",
        publisher: "잡빛",
        price: 500,
        quantity: 1,
    },
    {
        itemId: '2',
        name: "생각하는 힘",
        author: "이",
        publisher: "생각출판",
        price: 500,
        quantity: 1,
    },
];

const OrderComp = () => {
    const [cartItems, setCartItems] = useState(dummyCartItems);
    const [user, setUser] = useState(null)
    const [userShip, setUserShip] = useState([])
    const [orderShip, setOrderShip] = useState(null)
    const [isFixable, setIsFixable] = useState(false)
    const [updateRefId, setUpdateRefId] = useState(0)
    const nameRef = useRef()
    const receiverRef = useRef()
    const contactRef = useRef()
    const shipRadioRef = useRef({})
    const [paymentStatus, setPaymentStatus] = useState({
        status: "IDLE",
    })

    useEffect(() => {
        if (user) return;
        const fetchMyInfo = async () => {
            const res = await getMyInfo();
            setUser(prev => {
                const updatedUser = { ...prev, ...res };

                setOrderShip({
                    addressMain: updatedUser.addressMain,
                    addressSub: updatedUser.addressSub,
                    contact: updatedUser.phoneNumber,
                    name: updatedUser.firstName + updatedUser.lastName,
                    receiver: updatedUser.firstName + updatedUser.lastName,
                    zipcode: updatedUser.zipcode,
                    memberEmail: updatedUser.email
                });
                return updatedUser;
            })
        }

        fetchMyInfo();
        fetchMyDelivery();
    }, [])

    useEffect(() => {
        const ref = shipRadioRef.current[updateRefId]
        if (ref)
            ref.checked = true;

    }, [updateRefId])


    const fetchMyDelivery = async () => {
        const res = await getShipList();
        setUserShip(res)
    }


    const increaseQuantity = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        if (window.confirm('정말 삭제하시겠습니까?'))
            setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const onChangeShipment = (e) => {
        const { name, value } = e.target;
        setOrderShip((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                setOrderShip((prev) => ({
                    ...prev,
                    zipcode: data.zonecode,
                    addressMain: data.address,
                }));
            },
        }).open();
    };

    const checkOrderShip = () => {
        if (!orderShip.name) {
            alert('배송지 이름을 입력하세요')
            nameRef.current?.focus()
            return false;
        }
        else if (!orderShip.receiver) {
            alert('수령인을 입력하세요')
            receiverRef.current?.focus()
            return false;
        }
        else if (!orderShip.contact) {
            alert('수령인 연락처를 입력하세요')
            contactRef.current?.focus()
            return false;
        }
        else if (!orderShip.zipcode) {
            alert('주소를 입력하세요')
            return false;
        }

        return true;
    }

    const handleRegisterShipment = () => {
        if (!checkOrderShip)
            return;

        const regist = async () => {
            const res = await registerShip(orderShip)
            setOrderShip(res)

            alert('배송지 등록 완료')
            await fetchMyDelivery();
            setUpdateRefId(res.id)
        }
        regist()
    }
    const handleUpdateShipment = () => {
        if (!checkOrderShip)
            return;

        const update = async () => {
            const res = await modifyShip(orderShip)
            setOrderShip(res.ship)
            alert('배송지 업데이트 완료')
            fetchMyDelivery();
        }
        update();
    }

    const shipSelect = (e) => {
        switch (e.target.id) {
            case '0':
                setIsFixable(false)
                setOrderShip({
                    addressMain: user.addressMain,
                    addressSub: user.addressSub,
                    contact: user.phoneNumber,
                    name: user.firstName + user.lastName,
                    receiver: user.firstName + user.lastName,
                    zipcode: user.zipcode
                });
                break;
            case '99':
                setIsFixable(true)
                setOrderShip(null);
                break;

            default:
                setIsFixable(true)
                setOrderShip(userShip.find(ship => String(ship.id) === e.target.id));
                break;
        }
    }

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        const orderStartResult = await postOrderStart({
            price: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            member: {
                memberEmail: user.email,
                memberContact: user.phoneNumber,
                memberName: user.firstName + user.lastName
            },
            orderItems: cartItems,
            orderShip: orderShip
        })
        console.log('result :', orderStartResult)
        if(orderStartResult.code == '500'){
            console.error('주문 생성 오류')
            return;
        }

        const payment = await PortOne.requestPayment({
            storeId: process.env.REACT_APP_STORE_ID,
            channelKey: process.env.REACT_APP_CHANNEL_ID,
            paymentId: orderStartResult.paymentId,
            orderName: cartItems[0].name + '외 ' + cartItems.reduce((sum, item) => sum + item.quantity, 0) + '건',
            totalAmount: orderStartResult.price,
            currency: "KRW",
            payMethod: "CARD",
            customer: {
                customerId: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                address: {
                    country: 'COUNTRY_KR',
                    addressLine1: user.addressMain,
                    addressLine2: user.addressSub || ''
                }
            },
            products: cartItems.map(item => ({
                id: item.itemId,
                name: item.name,
                amount: item.price,
                quantity: item.quantity
            }))
            // customData: {
            //     count: items.reduce((sum, payment)=> sum + payment.count),
            // },
        })

        if (payment.code !== undefined) {
            setPaymentStatus({
                status: "FAILED",
                message: payment.message
            })
            console.log('status : ', payment.code)

            return;
        }
        setPaymentStatus(payment.transactionType === "PAYMENT" ? { status: 'PAID' } : { status: 'FAILED' })
    }

    const isWaitingPayment = paymentStatus.status !== "IDLE"

    return (
        <div className="w-full flex justify-center bg-gray-50 py-10 px-4">
            <div className="max-w-screen-xl w-full grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-12">
                {/* 주문 + 배송 정보 (좌측) */}
                <div className="space-y-8">
                    {/* 주문 상품 정보 */}
                    <section className="border rounded-2xl p-6 shadow-md bg-white">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">🛒 주문 상품 정보</h2>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center border-b pb-4">
                                    <div className="w-24 h-32 bg-gray-200 rounded-lg" />
                                    <div className="ml-4 flex-1">
                                        <p className="text-base font-medium text-gray-700">{item.name}</p>
                                        <p className="text-sm text-gray-500">저자: {item.author}</p>
                                        <p className="text-sm text-gray-500">출판사: {item.publisher}</p>
                                    </div>
                                    <div className="text-lg font-semibold w-24 text-right text-gray-700">
                                        {(item.price * item.quantity).toLocaleString()}원
                                    </div>
                                    <div className="ml-4 flex items-center gap-2">
                                        <button
                                            className="px-2 py-1 rounded border text-sm"
                                            onClick={() => decreaseQuantity(item.id)}
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center">{item.quantity}</span>
                                        <button
                                            className="px-2 py-1 rounded border text-sm"
                                            onClick={() => increaseQuantity(item.id)}
                                        >
                                            +
                                        </button>
                                        {cartItems.length > 1 ?
                                            <button className="ml-2 text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)} >
                                                🗑
                                            </button> : <></>
                                        }
                                    </div>
                                </div>
                            ))}
                            <div className="text-right font-semibold text-xl text-gray-800">
                                총 결제 금액: <span className="text-blue-600">{totalAmount.toLocaleString()}원</span>
                            </div>
                        </div>
                    </section>

                    {/* 주문자 정보 */}
                    <section className="border rounded-2xl p-6 shadow-md bg-white">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">👤 주문자 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <label className="block mb-1 font-medium">이름</label>
                                <input type="text" value={user?.firstName + user?.lastName || ''} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">연락처</label>
                                <input type="text" value={user?.phoneNumber
                                    ? user.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                                    : ''}
                                    readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">우편번호</label>
                                <input type="text" value={user?.zipcode || ''} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">주소</label>
                                <input type="text" value={user?.addressMain || ''} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">상세주소</label>
                                <input type="text" value={user?.addressSub || ''} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">회원 정보에서 수정해 주세요.</p>
                    </section>

                    {/* 배송 정보 */}
                    <section className="border rounded-2xl p-6 shadow-md bg-white">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">📦 배송 정보</h2>
                        <div className="space-y-6 text-sm">
                            {/* 배송지 선택 */}
                            <div className="flex flex-wrap items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input id="0" type="radio" name="address" onClick={shipSelect} defaultChecked />
                                    <span>주문자 정보와 동일</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input id="99" type="radio" name="address" onClick={shipSelect} />
                                    <span>새로운 배송지 입력</span>
                                </label>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">

                                {userShip.map((ship) => (
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <label className="flex items-center gap-2">
                                            <input ref={(el) => (shipRadioRef.current[ship.id] = el)}
                                                id={String(ship.id)} type="radio" name="address" onClick={shipSelect} />
                                            <span>{ship.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>


                            {/* 배송지 이름 + 버튼 */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <input ref={nameRef} name="name" onChange={onChangeShipment} value={orderShip?.name || ''} readOnly={!isFixable} type="text" placeholder="배송지 이름" className={`border rounded px-3 py-2 w-full sm:w-60 ${!isFixable ? 'bg-gray-200 text-gray-500' : 'bg-white text-black'}`} />
                                <button onClick={handleRegisterShipment} disabled={!isFixable} className={`text-xs underline whitespace-nowrap ${isFixable ? 'text-blue-600' : 'text-gray-600'}`}>새로운 배송지에 추가</button>
                                <button onClick={handleUpdateShipment} disabled={!isFixable} className={`text-xs underline whitespace-nowrap ${isFixable ? 'text-blue-600' : 'text-gray-600'}`}>배송지 정보 저장</button>
                            </div>

                            {/* 수령인 / 연락처 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="font-medium mb-1">수령인</label>
                                    <input ref={receiverRef} name='receiver' onChange={onChangeShipment} value={orderShip?.receiver || ''} readOnly={!isFixable} type="text" placeholder="수령인 이름" className={`border rounded px-3 py-2 ${!isFixable ? 'bg-gray-200 text-gray-500' : 'bg-white text-black'}`}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium mb-1">수령인 연락처</label>
                                    <input ref={contactRef} name='contact' onChange={onChangeShipment} value={orderShip?.contact || ''} readOnly={!isFixable} type="text" placeholder="010-xxxx-xxxx" className={`border rounded px-3 py-2 ${!isFixable ? 'bg-gray-200 text-gray-500' : 'bg-white text-black'}`} />
                                </div>
                            </div>

                            {/* 주소 입력 */}
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <input name='zipcode' onChange={onChangeShipment} value={orderShip?.zipcode || ''} readOnly type="text" placeholder="우편번호" className={`border rounded px-3 py-2 w-32 bg-gray-200 text-gray-500`} />
                                    <button disabled={!isFixable} onClick={handleSearch} className={`px-3 py-2 text-sm rounded border ${isFixable ? 'border-blue-300 hover:bg-blue-200 bg-blue-100 text-blue-700' : 'border-gray-300 hover:bg-gray-200 bg-gray-100 text-gray-700'}`}>
                                        주소 검색
                                    </button>
                                </div>
                                <input name='addressMain' onChange={onChangeShipment} value={orderShip?.addressMain || ''} readOnly type="text" placeholder="주소" className={`border rounded px-3 py-2 w-full bg-gray-200 text-gray-500 `} />
                                <input name='addressSub' onChange={onChangeShipment} value={orderShip?.addressSub || ''} readOnly={!isFixable} type="text" placeholder="상세주소" className={`border rounded px-3 py-2 w-full ${!isFixable ? 'bg-gray-200 text-gray-500' : 'bg-white text-black'}`} />
                            </div>
                        </div>
                    </section>
                </div>

                {/* 결제 정보 (우측) */}
                <aside  className="space-y-6 border rounded-2xl p-6 shadow-md h-fit bg-white">
                    <h2 className="text-xl font-bold text-gray-800">💳 결제 정보</h2>
                    <div className="text-sm space-y-2 text-gray-700">
                        <p>주문 수량: <span className="font-medium">{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</span></p>
                        <p>배송비: <span className="font-medium text-green-600">무료배송</span></p>
                        <p className="text-base font-semibold text-gray-800">결제 금액: <span className="text-blue-600 text-xl">{totalAmount.toLocaleString()}원</span></p>
                    </div>
                    <div className="space-y-3">
                        <button onClick={handleOrderSubmit} type="button" aria-busy={isWaitingPayment} disabled={isWaitingPayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all">
                            다음
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default OrderComp;