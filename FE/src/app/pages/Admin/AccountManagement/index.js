import React, { useEffect, useState } from "react";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import { IoIosSearch } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AccountManagement.css";

export default function AccountManagement() {
  const [listAccounts, setListAccounts] = useState([]);
  const [listAccountsShow, setListAccountsShow] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  useEffect(() => {
    const uri = "/api/admin/accounts";
    fetchGet(
      uri,
      (sus) => {
        console.log("Dữ liệu tài khoản từ BE:", sus);
        setListAccounts(sus.data.items);
        setListAccountsShow(sus.data.items);
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách tài khoản");
      }
    );
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setDataSearch(value);
    applySearch(value);
  };

  const applySearch = (searchValue) => {
    let filteredList = [...listAccounts];
    if (searchValue.trim()) {
      const lowercasedSearch = searchValue.toLowerCase();
      filteredList = filteredList.filter((item) =>
        item.username.toLowerCase().includes(lowercasedSearch)
      );
    }
    setListAccountsShow(filteredList);
  };

  useEffect(() => {
    applySearch(dataSearch);
  }, [listAccounts, dataSearch]);

  const handleLockAccount = (accountId, isLocked) => {
    const uri = `/api/admin/accounts/${accountId}/lock`;
    fetchPut(
      uri,
      { isLocked: !isLocked },
      (sus) => {
        setListAccounts((prev) =>
          prev.map((item) =>
            item._id === accountId ? { ...item, isLocked: !isLocked } : item
          )
        );
        toast.success(`Tài khoản đã được ${isLocked ? "mở khóa" : "khóa"} thành công!`);
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi khóa/mở khóa tài khoản");
      }
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="account-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng tài khoản: {listAccountsShow.length}
        </div>
        <div className="row mx-0 my-0">
          <div className="col-12 pb-4 px-0 d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center col-10">
              <div className="contain_Search position-relative col-4 me-3">
                <input
                  onChange={handleSearch}
                  value={dataSearch}
                  className="search rounded-2 px-3"
                  placeholder="Nhập tên tài khoản muốn tìm"
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
                  <th>Tên tài khoản</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listAccountsShow && listAccountsShow.length > 0 ? (
                  listAccountsShow.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.username}</td>
                      <td>{item.isLocked ? "Khóa" : "Hoạt động"}</td>
                      <td>
                        <div className="list_Action"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Không có tài khoản nào
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