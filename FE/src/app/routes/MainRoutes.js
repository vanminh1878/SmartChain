import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutCustomer from "../layouts/customerLayout";
import CustomerHome from "../pages/Customer/CustomerHome";
import Forbidden from "../layouts/adminLayout/Forbidden";
import PageNotFound from "../layouts/adminLayout/PageNotFound";
import DashBoard from "../pages/Admin/DashBoard";
import LayoutAdmin from "../layouts/adminLayout";
import CategoryManagement from "../pages/Admin/CategoryManagement";
import Login from "../pages/Other/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import MedicalExamList from "../pages/Customer/Service/MedicalExamList";
import LayoutStaff from "../layouts/staffLayout";
// Placeholder components (cần tạo sau)
import StoreManagement from "../pages/Admin/StoreManagement";
import ReportManagement from "../pages/Admin/CategoryManagement";
import EmployeeManagement from "../pages/Admin/EmployeeManagement";
import InventoryManagement from "../pages/Admin/InventoryManagement";
import SupplierManagement from "../pages/Admin/SupplierManagement";
import CustomerManagement from "../pages/Admin/CustomerManagement";
import CartManagement from "../pages/Admin/CategoryManagement";
import OrderManagement from "../pages/Admin/CategoryManagement";
import AccountManagement from "../pages/Admin/CategoryManagement";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout khách hàng */}
        <Route path="/" element={<LayoutCustomer />}>
          <Route index element={<CustomerHome />} />
          <Route path="login" element={<Login />} />
          <Route path="register-medical" element={<MedicalExamList />} />
        </Route>

        {/* Layout quản trị viên - Bảo vệ bằng ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<DashBoard />} />
            <Route path="store-management" element={<StoreManagement />} />
            <Route path="category-management" element={<CategoryManagement />} />
            <Route path="report-management" element={<ReportManagement />} />
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