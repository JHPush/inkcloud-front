import PaymentComp from "../components/menus/payment/PaymentComp";
import BasicLayout from "../layouts/BasicLayout";

const AboutPage = () => {
  return ( 
    <BasicLayout>
      <div className=" text-3xl">Payment Page</div>
      <PaymentComp/>
    </BasicLayout>
    
   );
}
 
export default AboutPage;
