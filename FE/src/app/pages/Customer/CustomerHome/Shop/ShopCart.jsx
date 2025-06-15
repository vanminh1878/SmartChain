import React, { useEffect, useState,useCallback } from "react";
import { Link } from "react-router-dom";
import productimage1 from '../../../../assets/images/product-img-1.jpg'
import productimage2 from '../../../../assets/images/product-img-2.jpg'
import productimage3 from '../../../../assets/images/product-img-3.jpg'
import productimage4 from '../../../../assets/images/product-img-4.jpg'
import productimage5 from '../../../../assets/images/product-img-5.jpg'
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { ToastContainer, toast } from "react-toastify";
import { fetchGet, fetchPut,fetchDelete,fetchPost } from "../../../../lib/httpHandler";
import { showSuccessMessageBox } from "../../../../components/MessageBox/SuccessMessageBox/showSuccessMessageBox"
import {showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox"

const ShopCart = () => {
  const [cart, setCart] = useState(null);
    const [tempQuantities, setTempQuantities] = useState({});
      const [cartDetails, setCartDetails] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [storeId, setStoreId] = useState(null);

  // Hàm lấy chi tiết giỏ hàng
  const fetchCartDetails = useCallback((cartId) => {
    fetchGet(
      `/Carts/${cartId}`,
      async (response) => {
        // Lấy thông tin sản phẩm cho từng productId trong cartDetails
        const updatedCartDetails = await Promise.all(
          response.cartDetails.map(async (detail) => {
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

        // Cập nhật cart với cartDetails đã có thông tin sản phẩm
        const updatedCart = { ...response, cartDetails: updatedCartDetails };
        setCart(updatedCart);
        console.log("Updated cart data:", updatedCart);
        setLoaderStatus(false);
      },
      (err) => {
        console.error("Get cart error:", err);
        toast.error(err.message || "Không thể lấy thông tin giỏ hàng!");
        setCart(null);
        setLoaderStatus(false);
      },
      () => {
        console.log("Get cart completed");
      }
    );
  }, []);

  useEffect(() => {
    // Kiểm tra token
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng!");
      setLoaderStatus(false);
      return;
    }

    // Gọi API /Customers/Profile để lấy cartId
    fetchGet(
      "/Customers/Profile",
      (profile) => {
        setCustomerId(profile.customerId);
        const cartId = profile.cartId;
        if (!cartId) {
          toast.info("Giỏ hàng của bạn hiện đang trống!");
          setLoaderStatus(false);
          setCart(null);
          return;
        }

        // Gọi API /Carts/{CartId} để lấy thông tin giỏ hàng
        fetchGet(
          `/Carts/${cartId}`,
          async (response) => {
            // Lấy thông tin sản phẩm cho từng productId trong cartDetails
            const updatedCartDetails = await Promise.all(
              response.cartDetails.map(async (detail) => {
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

            // Cập nhật cart với cartDetails đã có thông tin sản phẩm
            const updatedCart = { ...response, cartDetails: updatedCartDetails };
            setCart(updatedCart);
            setCartDetails(updatedCartDetails);
            setStoreId(response.storeId);
            console.log("Updated cart data:", updatedCart);
            setLoaderStatus(false);
          },
          (err) => {
            console.error("Get cart error:", err);
            toast.error(err.message || "Không thể lấy thông tin giỏ hàng!");
            setCart(null);
            setLoaderStatus(false);
          },
          () => {
            console.log("Get cart completed");
          }
        );
      },
      (err) => {
        console.error("Get profile error:", err);
        toast.error(err.message || "Không thể lấy thông tin hồ sơ người dùng!");
        setLoaderStatus(false);
      },
      () => {
        console.log("Get profile completed");
      }
    );
  }, []);


    // Cập nhật số lượng sản phẩm (tăng/giảm tương đối)
    const handleUpdateQuantity = useCallback(
      (detail, delta) => {
        const currentQuantity = tempQuantities[detail.productId] !== undefined 
          ? parseInt(tempQuantities[detail.productId], 10) 
          : detail.quantity;
        const newQuantity = currentQuantity + delta;
        
        console.log("",currentQuantity,"delta:", delta, newQuantity);
  
        // Cập nhật tempQuantities trước khi gửi API
        setTempQuantities((prev) => ({
          ...prev,
          [detail.productId]: newQuantity,
        }));
  
        fetchPut(
          `/Carts/${cart?.id}/details`,
          {
            ProductId: detail.productId,
            Quantity: delta, // Gửi delta (+1 hoặc -1) cho API tương đối
          },
          () => {
            fetchCartDetails(cart.id);
            //toast.success("Đã cập nhật số lượng");
          },
          (err) => {
            // Reset tempQuantities nếu API thất bại
            setTempQuantities((prev) => ({
              ...prev,
              [detail.productId]: detail.quantity,
            }));
            toast.error(err.title || "Lỗi khi cập nhật số lượng");
          },
          () => console.log("Cập nhật số lượng hoàn tất")
        );
      },
      [cart, fetchCartDetails]
    );
  
    // Cập nhật số lượng tuyệt đối (khi nhập trực tiếp)
    const handleUpdateQuantityAbsolute = useCallback(
      (detail, newQuantity) => {
        if (newQuantity < 1) {
          handleRemoveProduct(detail.productId);
          return;
        }
  
        // Cập nhật tempQuantities trước khi gửi API
        setTempQuantities((prev) => ({
          ...prev,
          [detail.productId]: newQuantity,
        }));
  
        fetchPut(
          `/Carts/${cart?.id}/details/newquantity`,
          {
            ProductId: detail.productId,
            Quantity: newQuantity, // Gửi số lượng tuyệt đối
          },
          () => {
            fetchCartDetails(cart.id);
            toast.success("Đã cập nhật số lượng");
          },
          (err) => {
            // Reset tempQuantities nếu API thất bại
            setTempQuantities((prev) => ({
              ...prev,
              [detail.productId]: detail.quantity,
            }));
            toast.error(err.title || "Lỗi khi cập nhật số lượng");
          },
          () => console.log("Cập nhật số lượng hoàn tất")
        );
      },
      [cart, fetchCartDetails]
    );
  
    // Xử lý khi nhập số lượng trực tiếp
    const handleQuantityInputChange = useCallback(
      (detail, value) => {
        // Cập nhật giá trị tạm thời
        setTempQuantities((prev) => ({
          ...prev,
          [detail.productId]: value,
        }));
      },
      []
    );
  
    // Xử lý khi xác nhận số lượng (onBlur hoặc Enter)
    const handleQuantityConfirm = useCallback(
      (detail) => {
        const value = tempQuantities[detail.productId] || detail.quantity;
        const newQuantity = parseInt(value, 10);
        if (isNaN(newQuantity) || newQuantity < 0) {
          toast.error("Số lượng phải là số không âm");
          // Reset về giá trị gốc nếu nhập sai
          setTempQuantities((prev) => ({
            ...prev,
            [detail.productId]: detail.quantity,
          }));
          return;
        }
        handleUpdateQuantityAbsolute(detail, newQuantity);
      },
      [tempQuantities, handleUpdateQuantityAbsolute]
    );


 // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveProduct = useCallback(
    (productId) => {
      fetchDelete(
        `/Carts/${cart?.id}/details/${productId}`,
        null,
        () => {
          fetchCartDetails(cart.id);
          showSuccessMessageBox("Đã xóa sản phẩm khỏi giỏ hàng!");
          toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        },
        (err) => {
          toast.error(err.title || "Lỗi khi xóa sản phẩm");
          showErrorMessageBox(err.message || "Lỗi khi xóa sản phẩm!");
        },
        () => console.log("Xóa sản phẩm hoàn tất")
      );
    },
    [cart, fetchCartDetails]
  );

   // Hoàn tất đơn hàng
    const handleCompleteOrder = useCallback(() => {
      if (!cart || cartDetails.length === 0) {
        toast.error("Giỏ hàng trống!");
        return;
      }
      fetchPost(
        "/Orders",
        {
          CustomerId: customerId,
          StoreId: storeId,
          CartId: cart.id,
          OrderDetails: cartDetails.map((detail) => ({
            ProductId: detail.productId,
            Quantity: detail.quantity,
          })),
        },
        (res) => {
          toast.success("Đơn hàng đã được tạo thành công!");
          setCart(null);
          setCartDetails([]);
        },
        (err) => {
          toast.error(err.title || "Lỗi khi tạo đơn hàng");
        },
        () => console.log("Tạo đơn hàng hoàn tất")
      );
    }, [cart, cartDetails, customerId, storeId]);
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
          {/* <PulseLoader loading={loaderStatus} size={50} color="#0aad0a" /> */}
          <MagnifyingGlass
  visible={true}
  height="100"
  width="100"
  ariaLabel="magnifying-glass-loading"
  wrapperStyle={{}}
  wrapperclassName="magnifying-glass-wrapper"
  glassColor="#c0efff"
  color="#0aad0a"
  />
        </div>
      ) : (
        <>
         <>
            <ScrollToTop/>
            </>
      <>
        <div>
          {/* section*/}
        
          {/* section */}
          <section className="mb-lg-14 mb-8 mt-8">
            <div className="container">
              {/* row Shop Cart */}
              <div className="row">
                <div className="col-12">
                  {/* card */}
                  <div className="card py-1 border-0 mb-8">
                    <div>
                      <h1 className="fw-bold">Shop Cart</h1>

                    </div>
                  </div>
                </div>
              </div>
              {/* row */}
              <div className="row">
                <div className="col-lg-8 col-md-7">
                  <div className="py-3">
                  {/* Danh sách sản phẩm */}
                        <ul className="list-group list-group-flush">
                      {cart.cartDetails.map((detail, index) => (
                        <li
                          key={detail.productId}
                          className={`list-group-item py-3 py-lg-0 px-0 ${
                            index === 0 ? "border-top" : index === cart.cartDetails.length - 1 ? "border-bottom" : ""
                          }`}
                        >
                          <div className="row align-items-center">
                            <div className="col-3 col-md-2">
                              <img
                                src={detail.product?.image || "https://via.placeholder.com/100"}
                                alt={detail.product?.name || "Product"}
                                className="img-fluid"
                              />
                            </div>
                            <div className="col-4 col-md-6">
                              <h6 className="mb-0">{detail.product?.name || `Sản phẩm ID: ${detail.productId}`}</h6>
                              <span>
                                <small className="text-muted">Số lượng: {detail.quantity}</small>
                              </span>
                            <div className="mt-2 small">
                              <span
                                onClick={() => handleRemoveProduct(detail.productId)}
                                className="text-decoration-none text-inherit bg-transparent !border-0 !outline-0 focus:ring-0 cursor-pointer inline-flex items-center"
                              >
                                <span className="me-1 align-text-bottom">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-trash-2 text-success"
                                  >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    <line x1={10} y1={11} x2={10} y2={17} />
                                    <line x1={14} y1={11} x2={14} y2={17} />
                                  </svg>
                                </span>
                                <span className="text-muted">Remove</span>
                              </span>
                            </div>
                            </div>
                            {/* Nút tăng giảm SL */}
                            <div className="col-3 col-md-3 col-lg-2">
                              <div className="input-group flex-nowrap justify-content-center">
                                <input
                                  type="button"
                                  value="-"
                                  className="button-minus form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0"
                                  data-field="quantity"
                                  onClick={() => handleUpdateQuantity(detail, -1)}
                                />
                                <input
                                  type="number"
                                  step={1}
                                  min={1}
                                  max={10}
                                  value={tempQuantities[detail.productId] ?? detail.quantity}
                                  name="quantity"
                                  className="quantity-field form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0"
                                  onChange={(e) => handleQuantityInputChange(detail, e.target.value)}
                                  onBlur={() => handleQuantityConfirm(detail)}
                                  onKeyDown={(e) => e.key === "Enter" && handleQuantityConfirm(detail)}
                                />
                                <input
                                  type="button"
                                  value="+"
                                  className="button-plus form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0"
                                  data-field="quantity"
                                  onClick={() => handleUpdateQuantity(detail, 1)}
                                />
                              </div>
                            </div>
                            <div className="col-2 text-lg-end text-start text-md-end col-md-2">
                              <span className="fw-bold">
                                {(detail.quantity * detail.price || 0).toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {/* btn */}
                    <div className="d-flex justify-content-between mt-4">
                      <Link to
                      ="/Shop" className="btn btn-primary">
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
                {/* sidebar */}
                <div className="col-12 col-lg-4 col-md-5">
                  {/* card */}
                  <div className="mb-5 card mt-6">
                    <div className="card-body p-6">
                      {/* heading */}
                      <h2 className="h5 mb-4">Summary</h2>
                      <div className="card mb-2">
                        {/* list group */}
                        <ul className="list-group list-group-flush">
                          {/* list group item */}

                         <li className="list-group-item d-flex justify-content-between align-items-start">
                          <div className="me-auto">
                            <div className="fw-bold">Total</div>
                          </div>
                          <span className="fw-bold">
                            {(cart?.cartDetails?.reduce((total, detail) => total + detail.quantity * detail.price, 0) || 0).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </li>
                        </ul>
                      </div>
                     <div className="d-grid mb-1 mt-4">
                      <button
                        className="btn btn-primary btn-lg d-flex justify-content-between align-items-center"
                        type="button"
                        onClick={() => handleCompleteOrder()}
                      >
                        Go to Checkout <span className="fw-bold">
                          {(cartDetails.reduce((total, detail) => total + detail.quantity * detail.price, 0) || 0).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </button>
                    </div>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    </>
    )}
  </div>
    </div>
  );
};

export default ShopCart;
