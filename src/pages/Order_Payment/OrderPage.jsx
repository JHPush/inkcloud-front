import OrderComp from "../../components/Order/OrderComp";
import BasicLayout from "../../layouts/BasicLayout";

const OrderPage = ()=>{
    return(
        <BasicLayout className="flex justify-center items-center min-h-screen">
            <OrderComp/>
        </BasicLayout>
    )
}
export default OrderPage;