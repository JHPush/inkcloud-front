import { Suspense, lazy } from "react";
import todoRouter from "./todoRouter";


const { createBrowserRouter } = require("react-router-dom");

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const Admin = lazy(() => import("../layouts/AdminLayout"))
const About = lazy(() => import("../pages/AboutPage"))

const TodoIndex = lazy(() => import("../pages/todo/IndexPage"))
// const TodoList =  lazy(() => import("../pages/todo/ListPage"))

const ProductList = lazy(() => import("../pages/product/ProductListPage"));
const ProductDetail = lazy(() => import("../pages/product/ProductDetailPage"));


const LoginPage = lazy(() => import("../components/menus/LoginPage"))

const SignupPage = lazy(() => import("../components/menus/SignupPage"))

const MyPage = lazy(() => import("../pages/member/MyPage"))

// const MyInfoPage = lazy(() => import("../pages/member/MyInfoPage"))

const ForgotPwdPage = lazy(() => import("../pages/member/ForgotPwdPage"))

const MemberByAdmin = lazy(() => import("../pages/member/admin/MemberByAdmin"))

const MemberDetail = lazy(() => import("../components/Member/admin/GetMemberInfo"))

const AddShipping = lazy(() => import("../components/Member/shipping/AddShipping"))

const ModifyShipping = lazy(() => import("../components/Member/shipping/ModifyShipping"))

// =========================== 주문 & 결제 ==========================
const PaymentPage = lazy(()=>import("../pages/Order_Payment/PaymentPage"))
const OrderPage = lazy(()=>import("../pages/Order_Payment/OrderPage"))



const root = createBrowserRouter([

  {
    path: "",
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path: "/admin",
    element: <Suspense fallback={Loading}><Admin/></Suspense>
  },
  {
    path: "about",
    element: <Suspense fallback={Loading}><About/></Suspense>
  },
  {
    path: "login",
    element: <Suspense fallback={Loading}><LoginPage/></Suspense>
  },
  {
    path: "signup",
    element: <Suspense fallback={Loading}><SignupPage/></Suspense>
  },
  {
    path: "admin/signup",
    element: <Suspense fallback={Loading}><SignupPage/></Suspense>
  },
  {
    path: "mypage",
    element: <Suspense fallback={Loading}><MyPage/></Suspense>
  },
  {
    path: "mypage/add-shipping",
    element: <Suspense fallback={Loading}><AddShipping/></Suspense>
  },
  {
    path: "mypage/modify/:id",
    element: <Suspense fallback={Loading}><ModifyShipping/></Suspense>
  },
  // {
  //   path: "my-info",
  //   element: <Suspense fallback={Loading}><MyInfoPage/></Suspense>
  // },
  {
    path: "forgot",
    element: <Suspense fallback={Loading}><ForgotPwdPage/></Suspense>
  },
  {
    path: "admin/member",
    element: <Suspense fallback={Loading}><MemberByAdmin/></Suspense>
  },
  {
    path: "admin/member/:email",
    element: <Suspense fallback={Loading}><MemberDetail/></Suspense>
  },
  {
    path: "todo",
    element: <Suspense fallback={Loading}><TodoIndex/></Suspense>,
    children: todoRouter()
  },
  {
  path: "products",
  element: <Suspense fallback={Loading}><ProductList /></Suspense>
  },
  {
    path: "products/:id",
    element: <Suspense fallback={Loading}><ProductDetail /></Suspense>
  },
  
  {
    path: "/payment",
    element: <Suspense fallback={Loading}><PaymentPage/></Suspense>
  },
  {
    path: "/order",
    element: <Suspense fallback={Loading}><OrderPage/></Suspense>
  }

])

export default root;
