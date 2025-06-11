import OrderCompleteComp from "../../components/Order/OrderCompleteComp";
import BasicLayout from "../../layouts/BasicLayout";

const OrderCompletePage = ()=>{
    return(
        <BasicLayout className="flex justify-center items-center min-h-screen">
            <OrderCompleteComp/>
        </BasicLayout>
    )
}
export default OrderCompletePage;