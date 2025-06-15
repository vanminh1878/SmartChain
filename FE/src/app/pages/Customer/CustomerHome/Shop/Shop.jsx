import React, { useEffect, useState,useCallback } from "react";
import { MagnifyingGlass } from 'react-loader-spinner'
import assortment from "../../../../assets/images/assortment-citrus-fruits.png";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer, toast } from "react-toastify";
import { fetchGet, fetchPost } from "../../../../lib/httpHandler";
import product1 from "../../../../assets/images/category-baby-care.jpg";
import product2 from "../../../../assets/images/category-atta-rice-dal.jpg";
import product3 from "../../../../assets/images/category-bakery-biscuits.jpg";
import product4 from "../../../../assets/images/category-chicken-meat-fish.jpg";
import product5 from "../../../../assets/images/category-cleaning-essentials.jpg";
import product6 from "../../../../assets/images/category-dairy-bread-eggs.jpg";
import product7 from "../../../../assets/images/category-instant-food.jpg";
import product8 from "../../../../assets/images/category-pet-care.jpg";
import product9 from "../../../../assets/images/category-snack-munchies.jpg";
import product10 from "../../../../assets/images/category-tea-coffee-drinks.jpg";
import ScrollToTop from "../ScrollToTop";
import { showSuccessMessageBox } from "../../../../components/MessageBox/SuccessMessageBox/showSuccessMessageBox"
import {showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox"
import { BE_ENPOINT } from "../../../../lib/httpHandler";

function Dropdown() {
  const [openDropdowns, setOpenDropdowns] = useState([]);


    const [listCategories, setListCategories] = useState([]);
    const [listStores, setListStores] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [products, setProducts] = useState([]);
  
   // Hàm fetch danh sách danh mục 
  const fetchCategories = useCallback(() => {
    console.log('Bắt đầu fetch danh sách danh mục...');
    fetchGet(
      '/categories',
      (sus) => {
        const categories = Array.isArray(sus) ? sus : [];
        console.log('Dữ liệu từ server:', categories);
        if (!categories.length && sus) {
          toast.error('Dữ liệu từ server không hợp lệ');
        }
        const validatedCategories = categories.map((item, index) => ({
          ...item,
          id: item.id || `temp-${Date.now()}-${index}`,
          name: item.name || item.tenDanhMuc || 'Không có tên',
          isLocked: item.isLocked || false,
        }));
        console.log('Danh sách danh mục đã xử lý:', validatedCategories);
        setListCategories(validatedCategories);
        // Đặt danh mục đầu tiên làm mặc định
        if (validatedCategories.length > 0) {
          setSelectedCategory(validatedCategories[0]);
        }
      },
      (fail) => {
        console.error('Lỗi khi lấy danh sách danh mục:', fail);
        toast.error(fail.message || 'Lỗi khi lấy danh sách danh mục');
        setListCategories([]);
      },
      () => {
        console.log('Yêu cầu fetch danh sách danh mục hoàn tất');
      }
    );
  }, []);

   // Hàm fetch danh sách cửa hàng
  const fetchStores = useCallback(() => {
    console.log('Bắt đầu fetch danh sách cửa hàng...');
    fetchGet(
      '/Stores',
      (sus) => {
        const Stores = Array.isArray(sus) ? sus : [];
        console.log('Dữ liệu từ server:', Stores);
        if (!Stores.length && sus) {
          toast.error('Dữ liệu từ server không hợp lệ');
        }
        const validatedStores = Stores.map((item, index) => ({
          ...item,
          id: item.id || `temp-${Date.now()}-${index}`,
          name: item.name || 'Không có tên',
          isLocked: item.isLocked || false,
        }));
        console.log('Danh sách cửa hàng đã xử lý:', validatedStores);
        setListStores(validatedStores);
      },
      (fail) => {
        console.error('Lỗi khi lấy danh sách cửa hàng:', fail);
        toast.error(fail.message || 'Lỗi khi lấy danh sách cửa hàng');
        setListStores([]);
      },
      () => {
        console.log('Yêu cầu fetch danh sách cửa hàng hoàn tất');
      }
    );
  }, []);

  // Hàm fetch danh sách sản phẩm theo categoryId
  const fetchProductsByCategory = useCallback((categoryId) => {
    console.log(`Bắt đầu fetch danh sách sản phẩm cho danh mục ${categoryId}...`);
    fetchGet(
      `/Products/category/${categoryId}`,
      (sus) => {
        const products = Array.isArray(sus) ? sus : [];
        console.log('Danh sách sản phẩm từ server:', products);
        if (!products.length && sus) {
          toast.info('Không có sản phẩm nào trong danh mục này');
        }
        setProducts(products);
      },
      (fail) => {
        console.error('Lỗi khi lấy danh sách sản phẩm:', fail);
        toast.error(fail.message || 'Lỗi khi lấy danh sách sản phẩm');
        setProducts([]);
      },
      () => {
        console.log('Yêu cầu fetch danh sách sản phẩm hoàn tất');
      }
    );
  }, []);


// Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (productId, quantity = 1) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    // Gọi API /Customers/Profile để lấy customerId và storeId
    fetchGet(
      "/Customers/Profile",
      (profile) => {
        const { customerId, storeId } = profile;
        if (!customerId || !storeId) {
          toast.error("Không thể lấy thông tin hồ sơ người dùng!");
          return;
        }

        const cartData = {
          customerId,
          storeId,
          productId,
          quantity,
        };

        fetchPost(
          "/Carts",
          cartData,
          () => {
            showSuccessMessageBox("Thêm sản phẩm vào giỏ hàng thành công!");
          },
          (err) => {
            console.error("Add to cart error:", err);
            showErrorMessageBox(err.message || "Thêm sản phẩm vào giỏ hàng thất bại!");
          },
          () => {
            console.log("Add to cart completed");
          }
        );
      },
      (err) => {
        console.error("Get profile error:", err);
        toast.error(err.message || "Không thể lấy thông tin hồ sơ người dùng!");
      },
      () => {
        console.log("Get profile completed");
      }
    );
  };

    // Fetch danh sách khi component mount
    useEffect(() => {
      fetchCategories();
    }, [fetchCategories]);
     // Fetch danh sách khi component mount
    useEffect(() => {
      fetchStores();
    }, [fetchStores]);
  
     // Fetch danh sách sản phẩm khi selectedCategory thay đổi
  useEffect(() => {
    if (selectedCategory && selectedCategory.id) {
      fetchProductsByCategory(selectedCategory.id);
    }
  }, [selectedCategory, fetchProductsByCategory]);

    // Hàm xử lý khi chọn danh mục
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const toggleDropdown = (index) => {
    if (openDropdowns.includes(index)) {
      setOpenDropdowns(openDropdowns.filter((item) => item !== index));
    } else {
      setOpenDropdowns([...openDropdowns, index]);
    }
  };

     // loading
     const [loaderStatus, setLoaderStatus] = useState(true);
     useEffect(() => {
       setTimeout(() => {
         setLoaderStatus(false);
       }, 1500);
     }, []);
   
  return (
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
    <div className="container ">
      
{/* Category */}
      <div className="row">
        {/* Vertical Dropdowns Column */}
        <h5 className="mb-3 mt-8">Categories</h5>
        <div className="col-md-3">
         {listCategories.map((category, index) => (
    <ul className="nav flex-column" key={category.id}>
      <li className="nav-item">
        <Link
          className="nav-link"
          to="#"
          onClick={() => {
                  toggleDropdown(index);
                  handleCategorySelect(category); // Cập nhật danh mục được chọn
                }}
          aria-expanded={openDropdowns.includes(index) ? "true" : "false"}
          aria-controls={`categoryFlush${index + 1}`}
        >
          {category.name} <i className="fa-chevron-down" />
        </Link>
        <div
          className={`collapse ${openDropdowns.includes(index) ? "show" : ""}`}
          id={`categoryFlush${index + 1}`}
        >
          <div>
            <ul className="nav flex-column ms-3">
              {/* Nếu có danh sách con, thêm logic ở đây */}
              {/* <li className="nav-item">
                <Link className="nav-link" to={`/Shop/${category.id}`}>
                  View {category.name}
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </li>
    </ul>
  ))}
          <div>
           <div className="py-4">
              <h5 className="mb-3">Stores</h5>
              <div className="my-4">
                {/* input */}
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by store"
                />
              </div>
              {/* Danh sách cửa hàng động */}
              {listStores.length > 0 ? (
                listStores.map((store, index) => (
                  <div className="form-check mb-2" key={store.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={store.id}
                      id={`store-${store.id}`}
                      defaultChecked={index === 0} // Checkbox đầu tiên được checked mặc định
                    />
                    <label className="form-check-label" htmlFor={`store-${store.id}`}>
                      {store.name}
                    </label>
                  </div>
                ))
              ) : (
                <div className="form-check mb-2">
                  <p className="text-muted">No stores available</p>
                </div>
              )}
            </div>

            <div className="py-4">
              {/* Banner Design */}
              {/* Banner Content */}
              <div className="position-absolute p-5 py-8">
                <h3 className="mb-0">Fresh Fruits </h3>
                <p>Get Upto 25% Off</p>
                <Link to="#" className="btn btn-dark">
                  Shop Now
                  <i className="feather-icon icon-arrow-right ms-1" />
                </Link>
              </div>
              {/* Banner Content */}
              {/* Banner Image */}
              {/* img */}
              <img
                src={assortment}
                alt="assortment"
                className="img-fluid rounded-3"
              />
              {/* Banner Image */}
            </div>
            {/* Banner Design */}
          </div>
        </div>
        {/* Cards Column */}
        <div className="col-lg-9 col-md-8">
          {/* card */}
          <div className="card mb-4 bg-light border-0">
           {/* Card Body với tiêu đề danh mục */}
            <div className=" card-body p-9">
              <h1 className="mb-0"> {selectedCategory ? selectedCategory.name : 'No Category Selected'}</h1>
            </div>
          </div>
          {/* list icon */}
          <div className="d-md-flex justify-content-between align-items-center">
           <div>
            <p className="mb-3 mb-md-0">
              <span className="text-dark">{products.length}</span> Products found
            </p>
          </div>
            {/* icon */}
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/ShopListCol" className="text-muted me-3">
                <i className="bi bi-list-ul" />
              </Link>
              <Link to="/ShopGridCol3" className=" me-3 active">
                <i className="bi bi-grid" />
              </Link>
              <Link to="/Shop" className="me-3 text-muted">
                <i className="bi bi-grid-3x3-gap" />
              </Link>
              <div className="me-2">
                {/* select option */}
                <select
                  className="form-select"
                  aria-label="Default select example"
                >
                  <option selected>Show: 50</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </div>
              <div>
                {/* select option */}
                <select
                  className="form-select"
                  aria-label="Default select example"
                >
                  <option selected>Sort by: Featured</option>
                  <option value="Low to High">Price: Low to High</option>
                  <option value="High to Low"> Price: High to Low</option>
                  <option value="Release Date"> Release Date</option>
                  <option value="Avg. Rating"> Avg. Rating</option>
                </select>
              </div>
            </div>
          </div>
          {/* row */}
         <div className="row g-4 row-cols-xl-4 row-cols-lg-3 row-cols-2 row-cols-md-2 mt-2">
  {products.length > 0 ? (
    products.map((product) => (
      <div className="col" key={product.id}>
        <div className="card card-product">
          <div className="card-body">
            {/* Badge */}
            {product.stockQuantity > 0 && (
            <div className="text-center position-relative">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={
                      product.image
                        ? `${BE_ENPOINT}/api/asset/view-image/${product.image}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={product.name || "Sản phẩm"}
                    className="mb-3 img-fluid"
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                </Link>
              </div>
            )}
            {/* Category */}
            <div className="text-small mb-1">
              <Link to="#!" className="text-decoration-none text-muted">
                <small>{selectedCategory?.name || 'Unknown Category'}</small>
              </Link>
            </div>
            {/* Product Name */}
            <h2 className="fs-6">
              <Link
                to={`/product/${product.id}`}
                className="text-inherit text-decoration-none"
              >
                {product.name}
              </Link>
            </h2>            
            {/* Price and Add to Cart */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                {product.price ? (
                  <span className="text-dark">{product.price.toLocaleString('vi-VN')} VND</span>
                ) : (
                  <span className="text-muted">Price unavailable</span>
                )}
              </div>
              {/* Nút add to cart */}
              <div>
      <button className="btn btn-primary btn-sm"onClick={() => handleAddToCart(product.id, 1)}>
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
          className="feather feather-plus"
        >
          <line x1={12} y1={5} x2={12} y2={19} />
          <line x1={5} y1={12} x2={19} y2={12} />
        </svg>
        Add
      </button>
    </div>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col">
      <p className="text-muted">No products available in this category.</p>
    </div>
  )}
</div>





          <div className="row mt-8">
            <div className="col">
              {/* nav */}
              <nav>
                <ul className="pagination">
                  <li className="page-item disabled">
                    <Link
                      className="page-link  mx-1 rounded-3 "
                      to="#"
                      aria-label="Previous"
                    >
                      <i className="fa fa-chevron-left" />
                    </Link>
                  </li>
                  <li className="page-item ">
                    <Link className="page-link  mx-1 rounded-3 active" to="#">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link mx-1 rounded-3 text-body" to="#">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link mx-1 rounded-3 text-body" to="#">
                      ...
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link mx-1 rounded-3 text-body" to="#">
                      12
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link
                      className="page-link mx-1 rounded-3 text-body"
                      to="#"
                      aria-label="Next"
                    >
                      <i className="fa fa-chevron-right" />
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
)}
</div>
  );
}

const dropdownData = [
  {
    title: "Dairy, Bread & Eggs",
    items: [
      "Milk",
      "Milk Drinks",
      "Curd & Yogurt",
      "Eggs",
      "Bread",
      "Buns & Bakery",
      "Butter & More",
      "Cheese",
      "Paneer & Tofu",
      "Cream & Whitener",
      "Condensed Milk",
      "Vegan Drinks",
    ],
  },
  {
    title: "Snacks & Munchies",
    items: [
      "Chips & Crisps",
      "Nachos",
      "Popcorn",
      "Bhujia & Mixtures",
      "Namkeen Snacks",
      "Healthy Snacks",
      "Cakes & Rolls",
      "Energy Bars",
      "Papad & Fryums",
      "Rusks & Wafers",
    ],
  },
  {
    title: "Fruits & Vegetables",
    items: [
      "Fresh Vegetables",
      "Herbs & Seasonings",
      "Fresh Fruits",
      "Organic Fruits & Vegetables",
      "Cuts & Sprouts",
      "Exotic Fruits & Veggies",
      "Flower Bouquets, Bunches",
    ],
  },
  {
    title: "Cold Drinks & Juices" ,
    items: [
      "Soft Drinks",
      "Fruit Juices",
      "Coldpress",
      "Energy Drinks",
      "Water & Ice Cubes",
      "Soda & Mixers",
      "Concentrates & Syrups",
      "Detox & Energy Drinks",
      "Juice Collection",
    ],
  },
];


export default Dropdown;
