import { Suspense, lazy } from "react";
import todoRouter from "./todoRouter";

const { createBrowserRouter } = require("react-router-dom");

const Loading = <div>Loading....</div>

const Main = lazy(() => import("../pages/MainPage"))
const About = lazy(() => import("../pages/AboutPage"))

const TodoIndex = lazy(() => import("../pages/todo/IndexPage"))
// const TodoList =  lazy(() => import("../pages/todo/ListPage"))

const ProductList = lazy(() => import("../pages/product/ProductListPage"));
const ProductDetail = lazy(() => import("../pages/product/ProductDetailPage"));

const Payment = lazy(()=>import("../pages/PaymentPage"))

const root = createBrowserRouter([

  {
    path: "",
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path: "about",
    element: <Suspense fallback={Loading}><About/></Suspense>
  },
  {
    path: "todo",
    element: <Suspense fallback={Loading}><TodoIndex/></Suspense>,
    children: todoRouter()
  },
  {
    path: "/payment",
    element: <Suspense fallback={Loading}><Payment/></Suspense>
  },
  {
  path: "products",
  element: <Suspense fallback={Loading}><ProductList /></Suspense>
  },
  {
    path: "products/:id",
    element: <Suspense fallback={Loading}><ProductDetail /></Suspense>
  }

])

export default root;
