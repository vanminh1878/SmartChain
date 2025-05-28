import React, { useEffect, useState } from "react";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import { IoIosSearch } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SupplierManagement.css";

export default function SupplierManagement() {
  const [listSuppliers, setListSuppliers] = useState([]);
  const [listSuppliersShow, setListSuppliersShow] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  useEffect(() => {
    const uri = "/api/admin/suppliers";
    fetchGet(
      uri,
      (sus) => {
        console.log("Dữ liệu nhà cung cấp từ BE:", sus);
        setListSuppliers(sus.data.items);
        setListSuppliersShow(sus.data.items);
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách nhà cung cấp");
      }
    );
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setDataSearch(value);
    applySearch(value);
  };

  const applySearch = (searchValue) => {
    let filteredList = [...listSuppliers];
    if (searchValue.trim()) {
      const lowercasedSearch = searchValue.toLowerCase();
      filteredList = filteredList.filter((item) =>
        item.tenNhaCungCap.toLowerCase().includes(lowercasedSearch)
      );
    }
    setListSuppliersShow(filteredList);
  };

  useEffect(() => {
    applySearch(dataSearch);
  }, [listSuppliers, dataSearch]);

  const handleLockSupplier = (supplierId, isLocked) => {
    const uri = `/api/admin/suppliers/${supplierId}/lock`;
    fetchPut(
      uri,
      { isLocked: !isLocked },
      (sus) => {
        setListSuppliers((prev) =>
          prev.map((item) =>
            item._id === supplierId ? { ...item, isLocked: !isLocked } : item
          )
        );
        toast.success(`Nhà cung cấp đã được ${isLocked ? "mở khóa" : "khóa"} thành công!`);
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi khóa/mở khóa nhà cung cấp");
      }
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="supplier-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng nhà cung cấp: {listSuppliersShow.length}
        </div>
        <div className="row mx-0 my-0">
          <div className="col-12 pb-4 px-0 d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center col-10">
              <div className="contain_Search position-relative col-4 me-3">
                <input
                  onChange={handleSearch}
                  value={dataSearch}
                  className="search rounded-2 px-3"
                  placeholder="Nhập tên nhà cung cấp muốn tìm"
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
                  <th>Tên nhà cung cấp</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listSuppliersShow && listSuppliersShow.length > 0 ? (
                  listSuppliersShow.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.tenNhaCungCap}</td>
                      <td>{item.isLocked ? "Khóa" : "Hoạt động"}</td>
                      <td>
                        <div className="list_Action"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Không có nhà cung cấp nào
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