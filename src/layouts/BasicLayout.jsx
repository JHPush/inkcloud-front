// src/layouts/BasicLayout.jsx
import BasicMenu from "../components/menus/BasicMenu";
import CategoryMenu from "../components/main/CategoryMenu"; // 추가

const BasicLayout = ({ children }) => {
  return (
    <>
      <BasicMenu />

      <CategoryMenu />

      <div className="bg-white my-5 w-full flex flex-col space-y-1 md:flex-row md:space-x-1 md:space-y-0">
        <main className="md:w-4/5 lg:w-3/4 px-5 py-5">
          {children}
        </main>
      </div>
    </>
  );
};

export default BasicLayout;
