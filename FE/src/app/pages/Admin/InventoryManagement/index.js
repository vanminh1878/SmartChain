import React, { useEffect, useState } from "react";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import { IoIosSearch } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./InventoryManagement.css";

export default function InventoryManagement() {
  const [listProducts, setListProducts] = useState([]);
  const [listProductsShow, setListProductsShow] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  useEffect(() => {
    const uri = "/api/admin/inventory";
    fetchGet(
      uri,
      (sus) => {
        console.log("Dữ liệu sản phẩm từ BE:", sus);
        setListProducts(sus.data.items);
        setListProductsShow(sus.data.items);
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
      }
    );
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setDataSearch(value);
    applySearch(value);
  };

  const applySearch = (searchValue) => {
    let filteredList = [...listProducts];
    if (searchValue.trim()) {
      const lowercasedSearch = searchValue.toLowerCase();
      filteredList = filteredList.filter((item) =>
        item.tenSanPham.toLowerCase().includes(lowercasedSearch)
      );
    }
    setListProductsShow(filteredList);
  };

  useEffect(() => {
    applySearch(dataSearch);
  }, [listProducts, dataSearch]);

  const handleLockProduct = (productId, isLocked) => {
    const uri = `/api/admin/inventory/${productId}/lock`;
    fetchPut(
      uri,
      { isLocked: !isLocked },
      (sus) => {
        setListProducts((prev) =>
          prev.map((item) =>
            item._id === productId ? { ...item, isLocked: !isLocked } : item
          )
        );
        toast.success(`Sản phẩm đã được ${isLocked ? "mở khóa" : "khóa"} thành công!`);
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi khóa/mở khóa sản phẩm");
      }
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="inventory-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng sản phẩm: {listProductsShow.length}
        </div>
        <div className="row mx-0 my-0">
          <div className="col-12 pb-4 px-0 d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center col-10">
              <div className="contain_Search position-relative col-4 me-3">
                <input
                  onChange={handleSearch}
                  value={dataSearch}
                  className="search rounded-2 px-3"
                  placeholder="Nhập tên sản phẩm muốn tìm"
                />
                <IoIosSearch className="icon_search translate-middle-y text-secondary" />
              </div>
            </div>
          </div>
          <div className="contain_Table mx-0 col-12 bg-white rounded-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sản phẩm</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listProductsShow && listProductsShow.length > 0 ? (
                  listProductsShow.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.tenSanPham}</td>
                      <td>{item.isLocked ? "Khóa" : "Hoạt động"}</td>
                      <td>
                        <div className="list_Action"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <nav className="contain_pagination">
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link page-link-two" href="#">
                    «
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link page-link-two" href="#">
                    »
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}