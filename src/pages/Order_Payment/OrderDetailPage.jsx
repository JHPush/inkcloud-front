import BasicLayout from "../../layouts/BasicLayout";
import AdminLayout from "../../layouts/AdminLayout"
import OrderDetailComp from "../../components/Order/OrderDetailComp"
import { useSelector } from "react-redux";

const OrderDetailPage = () => {
    const user = useSelector(state => state.login.user);
    console.log('detail user : ', user)

    return (
        <>
            {user?.role !== 'ADMIN' ?( 
            <BasicLayout>
                <OrderDetailComp />
            </BasicLayout>) : 
            (<AdminLayout>
                <OrderDetailComp />
            </AdminLayout>)}
        </>
    )
}

export default OrderDetailPage;