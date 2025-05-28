import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutCustomer from "../layouts/customerLayout";
import CustomerHome from "../pages/Customer/CustomerHome/Home.jsx";
import Forbidden from "../layouts/adminLayout/Forbidden";
import PageNotFound from "../layouts/adminLayout/PageNotFound";
import DashBoard from "../pages/Admin/DashBoard";
import LayoutAdmin from "../layouts/adminLayout";
import CategoryManagement from "../pages/Admin/CategoryManagement";
import StoreManagement from "../pages/Admin/StoreManagement";
import EmployeeManagement from "../pages/Admin/EmployeeManagement";
import InventoryManagement from "../pages/Admin/InventoryManagement";
import SupplierManagement from "../pages/Admin/SupplierManagement";
import CustomerManagement from "../pages/Admin/CustomerManagement";
import CartManagement from "../pages/Admin/CartManagement";
import OrderManagement from "../pages/Admin/OrderManagement";
import AccountManagement from "../pages/Admin/AccountManagement";
import Login from "../pages/Other/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import LayoutStaff from "../layouts/staffLayout";
// Từ App.js
import Home from "../pages/Customer/CustomerHome/Home.jsx";
import Shop from "../pages/Customer/CustomerHome/Shop/Shop.jsx";
import ShopGridCol3 from "../pages/Customer/CustomerHome/Shop/ShopGridCol3";
import ShopListCol from "../pages/Customer/CustomerHome/Shop/ShopListCol";
import ShopWishList from "../pages/Customer/CustomerHome/Shop/ShopWishList";
import StoreList from "../pages/Customer/CustomerHome/store/StoreList";
import SingleShop from "../pages/Customer/CustomerHome/store/SingleShop";
import MyAccountOrder from "../pages/Customer/CustomerHome/Accounts/MyAccountOrder";
import MyAccountSetting from "../pages/Customer/CustomerHome/Accounts/MyAccountSetting";
import MyAccountNotification from "../pages/Customer/CustomerHome/Accounts/MyAccountNotification";
import MyAccountPaymentMethod from "../pages/Customer/CustomerHome/Accounts/MyAccountAddress.jsx";
import MyAccountAddress from "../pages/Customer/CustomerHome/Accounts/MyAccountAddress.jsx";
import MyAccountForgetPassword from "../pages/Customer/CustomerHome/Accounts/MyAccountForgetPassword";
import MyAccountSignIn from "../pages/Customer/CustomerHome/Accounts/MyAccountSignIn";
import MyAccountSignUp from "../pages/Customer/CustomerHome/Accounts/MyAccountSignUp";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout khách hàng */}
        <Route path="/" element={<LayoutCustomer />}>
          <Route index element={<CustomerHome />} />
          <Route path="home" element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop-grid-col3" element={<ShopGridCol3 />} />
          <Route path="shop-list-col" element={<ShopListCol />} />
          <Route path="shop-wishlist" element={<ShopWishList />} />
          <Route path="store-list" element={<StoreList />} />
          <Route path="store/:id" element={<SingleShop />} />
          <Route path="my-account/order" element={<MyAccountOrder />} />
          <Route path="my-account/setting" element={<MyAccountSetting />} />
          <Route path="my-account/notification" element={<MyAccountNotification />} />
          <Route path="my-account/payment-method" element={<MyAccountPaymentMethod />} />
          <Route path="my-account/address" element={<MyAccountAddress />} />
          <Route path="my-account/forget-password" element={<MyAccountForgetPassword />} />
          <Route path="my-account/sign-in" element={<MyAccountSignIn />} />
          <Route path="my-account/sign-up" element={<MyAccountSignUp />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Layout quản trị viên - Bảo vệ bằng ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<DashBoard />} />
            <Route path="store-management" element={<StoreManagement />} />
            <Route path="category-management" element={<CategoryManagement />} />
            <Route path="employee-management" element={<EmployeeManagement />} />
            <Route path="inventory-management" element={<InventoryManagement />} />
            <Route path="supplier-management" element={<SupplierManagement />} />
            <Route path="customer-management" element={<CustomerManagement />} />
            <Route path="cart-management" element={<CartManagement />} />
            <Route path="order-management" element={<OrderManagement />} />
            <Route path="account-management" element={<AccountManagement />} />
          </Route>
        </Route>

        {/* Layout Nhân viên */}
        <Route path="/staff" element={<LayoutStaff />}>
          {/* <Route index element={<MedicalShiftDoctor />} />
          <Route path="register-shift" element={<MedicalShiftRegister />} />
          <Route path="shift-management" element={<MedicalShiftDoctor />} /> */}
        </Route>

        {/* Route cho trang Forbidden */}
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Trang không tìm thấy */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}