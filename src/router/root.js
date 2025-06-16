import { Suspense, lazy } from "react";
import todoRouter from "./todoRouter";
import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "./AdminRoute";


const { createBrowserRouter } = require("react-router-dom");

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
// const Admin = lazy(() => import("../layouts/AdminLayout"))
const About = lazy(() => import("../pages/AboutPage"))

const TodoIndex = lazy(() => import("../pages/todo/IndexPage"))
// const TodoList =  lazy(() => import("../pages/todo/ListPage"))

const ProductList = lazy(() => import("../pages/product/ProductListPage"));
const ProductDetail = lazy(() => import("../pages/product/ProductDetailPage"));

const CartPage = lazy(() => import("../pages/cart/CartPage"))

const AdminProductPage = lazy(() => import("../pages/admin/AdminProductPage"))
const AdminCategoryPage = lazy(() => import("../pages/admin/AdminCategoryPage"))

const LoginPage = lazy(() => import("../pages/member/LayoutLoginPage"))

const SignupPage = lazy(() => import("../components/menus/SignupPage"))

const MyPage = lazy(() => import("../pages/member/MyPage"))

const ForgotPwdPage = lazy(() => import("../pages/member/ForgotPwdPage"))

const MemberByAdmin = lazy(() => import("../pages/member/admin/MemberByAdmin"))

const MemberDetail = lazy(() => import("../components/Member/admin/GetMemberInfo"))

const AdminReviewPage = lazy(() => import("../pages/review/AdminReviewPage"))
// =========================== 주문 & 결제 ==========================
const PaymentPage = lazy(() => import("../pages/Order_Payment/PaymentPage"))
const OrderPage = lazy(() => import("../pages/Order_Payment/OrderPage"))
const OrderCompletePage = lazy(() => import("../pages/Order_Payment/OrderCompletePage"))
const MemberOrdersPage = lazy(() => import("../pages/Order_Payment/MemberOrdersPage"))
const OrderDetailPage = lazy(() => import("../pages/Order_Payment/OrderDetailPage"))
const OrderManagementPage = lazy(() => import('../pages/Order_Payment/admin/OrderManagementPage'))


const SalesStatsChart = lazy(() => import("../components/stats/SalesChart"))

const AdminLoginPage = lazy(() => import("../pages/member/admin/AdminLoginPage"))

const AdminReviewReport = lazy(() => import("../pages/review/AdminReviewReportPage"))

const AdminReviewDetail = lazy(() => import("../components/review/AdminReviewDetail"))



const root = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={Loading}><Main /></Suspense>
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <Suspense fallback={Loading}><AdminLayout /></Suspense>
      </AdminRoute>
    ),
    children: [
      {
        path: "member",
        element: <Suspense fallback={Loading}><MemberByAdmin /></Suspense>
      },
      {
        path: "member/:email",
        element: <Suspense fallback={Loading}><MemberDetail /></Suspense>
      },
      {
        path: "orders",
        element: <Suspense fallback={Loading}><OrderManagementPage /></Suspense>
      },
      {
        path: "reviews",
        element: <Suspense fallback={Loading}><AdminReviewPage /></Suspense>
      },
      {
        path: "reviews/:id",
        element: <Suspense fallback={Loading}><AdminReviewDetail /></Suspense>
      },
      {
        path: "reviews/reports",
        element: <Suspense fallback={Loading}><AdminReviewReport /></Suspense>
      },
      {
        path: "stats",
        element: <Suspense fallback={Loading}><SalesStatsChart /></Suspense>
      },
      ,
      {
        path: "products",
        element: <Suspense fallback={Loading}><AdminProductPage /></Suspense>
      },
      {
        path: "categories",
        element: <Suspense fallback={Loading}><AdminCategoryPage /></Suspense>
      }
      // ...필요시 추가
    ]
  },
  {
    path: "about",
    element: <Suspense fallback={Loading}><About /></Suspense>
  },
  {
    path: "login",
    element: <Suspense fallback={Loading}><LoginPage /></Suspense>
  },
  {
    path: "signup",
    element: <Suspense fallback={Loading}><SignupPage /></Suspense>
  },
  {
    path: "admin/signup",
    element: <Suspense fallback={Loading}><SignupPage /></Suspense>
  },
  {
    path: "mypage",
    element: <Suspense fallback={Loading}><MyPage /></Suspense>
  },
  {
    path: "forgot",
    element: <Suspense fallback={Loading}><ForgotPwdPage /></Suspense>
  },
  {
    path: "todo",
    element: <Suspense fallback={Loading}><TodoIndex /></Suspense>,
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
    path: "/carts",
    element: <Suspense fallback={Loading}><CartPage /></Suspense>
  },
  {
    path: "/payment",
    element: <Suspense fallback={Loading}><PaymentPage /></Suspense>
  },
  {
    path: "/order",
    element: <Suspense fallback={Loading}><OrderPage /></Suspense>
  },
  {
    path: "/order/complete",
    element: <Suspense fallback={Loading}><OrderCompletePage /></Suspense>
  },
  {
    path: "/order/member",
    element: <Suspense fallback={Loading}><MemberOrdersPage /></Suspense>
  },
  {
    path: "/order/member/:id",
    element: <Suspense fallback={Loading}><OrderDetailPage /></Suspense>
  },
  {
    path: "/admin/login",
    element: <Suspense fallback={Loading}><AdminLoginPage /></Suspense>
  }
])

export default root;
