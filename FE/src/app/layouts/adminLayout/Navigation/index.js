import React from "react";
import "./Navigation.css";
import { RxDashboard } from "react-icons/rx";
import { FaStore } from "react-icons/fa";
import { FaList } from "react-icons/fa"; // Thay GiMedicinePills bằng FaList
import { FaUsers } from "react-icons/fa";
import { FaWarehouse } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../../../assets/icons/logo_CircleK.png";

export default function Navigation() {
  const navigation = [
    { name: "Dashboard", path: "/admin", icon: <RxDashboard className="fs-5 icon" /> },
    { name: "Store Management", path: "/admin/store-management", icon: <FaStore className="fs-5 icon" /> },
    { name: "Category Management", path: "/admin/category-management", icon: <FaList className="fs-5 icon" /> }, 
    { name: "Employee Management", path: "/admin/employee-management", icon: <FaUsers className="fs-5 icon" /> },
    { name: "Inventory Management", path: "/admin/inventory-management", icon: <FaWarehouse className="fs-5 icon" /> },
    { name: "Supplier Management", path: "/admin/supplier-management", icon: <FaTruck className="fs-5 icon" /> },
    { name: "Customer Management", path: "/admin/customer-management", icon: <FaUserTie className="fs-5 icon" /> },
    { name: "Cart Management", path: "/admin/cart-management", icon: <FaShoppingCart className="fs-5 icon" /> },
    { name: "Order Management", path: "/admin/order-management", icon: <FaFileInvoice className="fs-5 icon" /> },
    { name: "Account Management", path: "/admin/account-management", icon: <FaUserCog className="fs-5 icon" /> },
  ];

  const { pathname } = useLocation();
  const getPageTitle = () => {
    const navItem = navigation.find(item => pathname === item.path);
    const title = navItem ? navItem.name : "Smart Chain";
    console.log(title); // In tiêu đề ra console
    return title;
  };

  return (
    <div className="Navigation_admin">
      <div className="slide-bar bg-white min-vh-100 d-flex justify-content-between flex-column">
        <div>
          <a className="logo-app text-decoration-none d-flex align-items-center text-black mt-0">
            <img
              src={Logo}
              className="inner-image"
              alt="Circle K Logo"
            />
            <span className="fs-4 inner-title fw-bold">Smart Chain</span>
          </a>
          <hr className="text-secondary mt-3"></hr>
          <ul className="nav nav-pills flex-column">
            {navigation.map(item => (
              <li key={item.path} className="nav-item text-black fs-5 py-2 py-sm-0">
                <NavLink
                  to={item.path}
                  className="nav-link d-flex align-items-center text-black fs-5 my-2"
                  aria-current="page"
                  end
                >
                  {item.icon}
                  <span className="ms-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="section_Left fs-3">{getPageTitle()}</div>
    </div>
  );
}