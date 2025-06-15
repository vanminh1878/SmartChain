import React, { useEffect, useState,useCallback } from "react";
import { Link } from "react-router-dom";
import productimage1 from '../../../../assets/images/product-img-1.jpg'
import productimage2 from '../../../../assets/images/product-img-2.jpg'
import productimage3 from '../../../../assets/images/product-img-3.jpg'
import productimage4 from '../../../../assets/images/product-img-4.jpg'
import { MagnifyingGlass } from 'react-loader-spinner'
import ScrollToTop from "../ScrollToTop";
import { ToastContainer, toast } from "react-toastify";
import { fetchGet, fetchPut,fetchDelete,fetchPost } from "../../../../lib/httpHandler";
import { showSuccessMessageBox } from "../../../../components/MessageBox/SuccessMessageBox/showSuccessMessageBox"
import {showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox"
import {showYesNoMessageBox } from "../../../../components/MessageBox/YesNoMessageBox/showYesNoMessgeBox"
import { BE_ENPOINT } from "../../../../lib/httpHandler";

const ShopCheckOut = () => {
     const [cart, setCart] = useState(null);
  const [tempQuantities, setTempQuantities] = useState({});
  const [customerId, setCustomerId] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]); // State lưu danh sách đơn hàng
  const [orderDetails, setOrderDetails] = useState({}); // State lưu chi tiết đơn hàng theo id

  // Hàm lấy danh sách đơn hàng và chi tiết đơn hàng
  const fetchOrdersByCustomer = useCallback(async (customerId) => {
    try {
      setLoading(true);
      // Lấy danh sách đơn hàng theo customerId
      const ordersResponse = await new Promise((resolve, reject) => {
        fetchGet(
          `/Orders/customer/${customerId}`,
          (data) => resolve(data),
          (err) => reject(err),
          () => console.log("Get orders completed")
        );
      });

      if (!Array.isArray(ordersResponse)) {
        console.error("API /Orders/{CustomerId} trả về dữ liệu không phải mảng:", ordersResponse);
        throw new Error("Dữ liệu đơn hàng không hợp lệ!");
      }

      // Lưu danh sách đơn hàng vào state
      setOrders(ordersResponse);
      console.log("Orders data:", ordersResponse);

      // Lấy chi tiết đơn hàng cho từng id
      const orderDetailsMap = {};
      await Promise.all(
        ordersResponse.map(async (order) => {
          try {
            const orderDetailsResponse = await new Promise((resolve, reject) => {
              fetchGet(
                `/Orders/details/${order.id}`,
                (data) => resolve(data),
                (err) => reject(err),
                () => console.log(`Get order details for ${order.id} completed`)
              );
            });

            if (!Array.isArray(orderDetailsResponse)) {
              console.error(
                `API /Orders/details/{id} trả về dữ liệu không phải mảng cho id ${order.id}:`,
                orderDetailsResponse
              );
              throw new Error("Dữ liệu chi tiết đơn hàng không hợp lệ!");
            }

            // Lấy thông tin sản phẩm cho từng productId trong orderDetails
            const updatedOrderDetails = await Promise.all(
              orderDetailsResponse.map(async (detail) => {
                try {
                  const product = await new Promise((resolve, reject) => {
                    fetchGet(
                      `/Products/${detail.productId}`,
                      (productData) => resolve(productData),
                      (err) => reject(err),
                      () => console.log(`Get product ${detail.productId} completed`)
                    );
                  });
                  return { ...detail, product };
                } catch (err) {
                  console.error(`Error fetching product ${detail.productId}:`, err);
                  return { ...detail, product: null };
                }
              })
            );

            orderDetailsMap[order.id] = updatedOrderDetails;
          } catch (err) {
            console.error(`Error fetching order details for id ${order.id}:`, err);
            orderDetailsMap[order.id] = [];
          }
        })
      );

      // Lưu chi tiết đơn hàng vào state
      setOrderDetails(orderDetailsMap);
      console.log("Order details data:", orderDetailsMap);
    } catch (err) {
      console.error("Get orders error:", err.response?.data || err.message);
      toast.error(err.message || "Không thể lấy thông tin đơn hàng!");
      setOrders([]);
      setOrderDetails({});
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem chi tiết đơn hàng!");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchGet(
      "/Customers/Profile",
      async (profile) => {
        setCustomerId(profile.customerId);
        
        console.log("customer :", profile);
        // Gọi hàm fetchOrdersByCustomer để lấy danh sách đơn hàng
        await fetchOrdersByCustomer(profile.customerId);
      },
      (err) => {
        console.error("Get profile error:", err.response?.data || err.message);
        toast.error(err.message || "Không thể lấy thông tin hồ sơ người dùng!");
        setLoading(false);
      },
      () => console.log("Get profile completed")
    );
  }, [ fetchOrdersByCustomer]);


   // loading
   const [loaderStatus, setLoaderStatus] = useState(true);
   useEffect(() => {
     setTimeout(() => {
       setLoaderStatus(false);
     }, 1500);
   }, []);
 
  return (
<div>
  <div>
    {loaderStatus ? (
      <div className="loader-container">
        <MagnifyingGlass
          visible={true}
          height="100"
          width="100"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClassName="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#0aad0a"
        />
      </div>
    ) : (
      <>
        <ScrollToTop />
        <section className="mb-lg-14 mb-8 mt-8">
          <div className="container">
            {/* row */}
            <div className="row">
              {/* col */}
              <div className="col-12">
                <div>
                  <div className="mb-8">
                    {/* text */}
                    <h1 className="fw-bold mb-0">Checkout</h1>
                   
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* row */}
              <div className="row">
                {/* Order Details List */}
                <div className="col-12 col-md-12 offset-lg-1 col-lg-10">
                  <div className="mt-4 mt-lg-0">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <div key={order.id} className="card shadow-sm mb-4">
                          <h5 className="px-6 py-4 bg-transparent mb-0">
                            Order Details (Ngày: {new Date(order.createdAt).toLocaleDateString("vi-VN")})
                          </h5>
                          <ul className="list-group list-group-flush">
                            {orderDetails[order.id] && orderDetails[order.id].length > 0 ? (
                              orderDetails[order.id].map((detail, index) => (
                                <li key={`${detail.orderId}-${detail.productId}-${index}`} className="list-group-item px-4 py-3">
                                  <div className="row align-items-center">
                                    <div className="col-2 col-md-2">
                                      <img
                                        src={detail.product?.image ? `${BE_ENPOINT}/api/asset/view-image/${detail.product?.image}`
                                                      : "https://via.placeholder.com/150"
                                                  }
                                        alt={detail.product?.name || "Product"}
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="col-5 col-md-5">
                                      <h6 className="mb-0">{detail.product?.name || `Sản phẩm ID: ${detail.productId}`}</h6>
                                      <span>
                                        <small className="text-muted">{detail.product?.description || "Không có mô tả"}</small>
                                      </span>
                                    </div>
                                    <div className="col-2 col-md-2 text-center text-muted">
                                      <span>{detail.quantity}</span>
                                    </div>
                                    <div className="col-3 text-lg-end text-start text-md-end col-md-3">
                                      <span className="fw-bold">
                                        {(detail.quantity * detail.price || 0).toLocaleString("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="list-group-item px-4 py-3">
                                <p>Không có chi tiết đơn hàng</p>
                              </li>
                            )}
                            {/* Item Subtotal, Status, Subtotal */}
                            <li className="list-group-item px-4 py-3">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div>Item Subtotal</div>
                                <div className="fw-bold">
                                  {orderDetails[order.id]
                                    ? orderDetails[order.id]
                                        .reduce((total, detail) => total + detail.quantity * detail.price, 0)
                                        .toLocaleString("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        })
                                    : "0 VND"}
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <div>Status</div>
                                <div className="fw-bold text-capitalize">{order.status || "Unknown"}</div>
                              </div>
                            </li>
                            <li className="list-group-item px-4 py-3">
                              <div className="d-flex align-items-center justify-content-between fw-bold">
                                <div>Subtotal</div>
                                <div>
                                  {orderDetails[order.id]
                                    ? orderDetails[order.id]
                                        .reduce((total, detail) => total + detail.quantity * detail.price, 0)
                                        .toLocaleString("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        })
                                    : "0 VND"}
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="card shadow-sm">
                        <h5 className="px-6 py-4 bg-transparent mb-0">Order Details</h5>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item px-4 py-3">
                            <p>Không có đơn hàng nào</p>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    )}
  </div>
</div>
  );
};

export default ShopCheckOut;
