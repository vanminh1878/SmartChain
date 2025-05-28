import React, { useEffect, useState } from "react";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import { IoIosSearch } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StoreManagement.css";
// import AddStore from "../../../components/Admin/StoreManagement/AddStore/AddStore";
// import EditStore from "../../../components/Admin/StoreManagement/EditStore/EditStore";
// import LockStore from "../../../components/Admin/StoreManagement/LockStore/LockStore";

export default function StoreManagement() {
  const [listStores, setListStores] = useState([]);
  const [listStoresShow, setListStoresShow] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  // Lấy danh sách cửa hàng từ backend
  useEffect(() => {
    const uri = "/api/admin/stores";
    fetchGet(
      uri,
      (sus) => {
        console.log("Dữ liệu cửa hàng từ BE:", sus);
        setListStores(sus.data.items);
        setListStoresShow(sus.data.items); // Khởi tạo danh sách hiển thị
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách cửa hàng");
      }
    );
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value;
    setDataSearch(value);
    applySearch(value);
  };

  // Lọc danh sách cửa hàng theo từ khóa tìm kiếm
  const applySearch = (searchValue) => {
    let filteredList = [...listStores];
    if (searchValue.trim()) {
      const lowercasedSearch = searchValue.toLowerCase();
      filteredList = filteredList.filter((item) =>
        item.tenCuaHang.toLowerCase().includes(lowercasedSearch)
      );
    }
    setListStoresShow(filteredList);
  };

  // Cập nhật danh sách hiển thị khi danh sách cửa hàng hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    applySearch(dataSearch);
  }, [listStores, dataSearch]);

  // Xử lý khóa cửa hàng
  const handleLockStore = (storeId, isLocked) => {
    const uri = `/api/admin/stores/${storeId}/lock`;
    fetchPut(
      uri,
      { isLocked: !isLocked }, // Đảo trạng thái khóa
      (sus) => {
        setListStores((prev) =>
          prev.map((item) =>
            item._id === storeId ? { ...item, isLocked: !isLocked } : item
          )
        );
        toast.success(`Cửa hàng đã được ${isLocked ? "mở khóa" : "khóa"} thành công!`);
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi khóa/mở khóa cửa hàng");
      }
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="store-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng cửa hàng: {listStoresShow.length}
        </div>
        <div className="row mx-0 my-0">
          <div className="col-12 pb-4 px-0 d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center col-10">
              <div className="contain_Search position-relative col-4 me-3">
                <input
                  onChange={handleSearch}
                  value={dataSearch}
                  className="search rounded-2 px-3"
                  placeholder="Nhập tên cửa hàng muốn tìm"
                />
                <IoIosSearch className="icon_search translate-middle-y text-secondary" />
              </div>
            </div>
            {/* <AddStore
              setListStores={setListStores}
              listStores={listStores}
            /> */}
          </div>
          <div className="contain_Table mx-0 col-12 bg-white rounded-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên cửa hàng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listStoresShow && listStoresShow.length > 0 ? (
                  listStoresShow.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.tenCuaHang}</td>
                      <td>{item.isLocked ? "Khóa" : "Hoạt động"}</td>
                      <td>
                        <div className="list_Action">
                          {/* <EditStore
                            item={item}
                            setListStores={setListStores}
                            listStores={listStores}
                          />
                          <LockStore
                            item={item}
                            handleLockStore={handleLockStore}
                          /> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Không có cửa hàng nào
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