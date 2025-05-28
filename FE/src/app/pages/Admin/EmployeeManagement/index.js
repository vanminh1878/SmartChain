import React, { useEffect, useState } from "react";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import { IoIosSearch } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EmployeeManagement.css";

export default function EmployeeManagement() {
  const [listEmployees, setListEmployees] = useState([]);
  const [listEmployeesShow, setListEmployeesShow] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  useEffect(() => {
    const uri = "/api/admin/employees";
    fetchGet(
      uri,
      (sus) => {
        console.log("Dữ liệu nhân viên từ BE:", sus);
        setListEmployees(sus.data.items);
        setListEmployeesShow(sus.data.items);
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách nhân viên");
      }
    );
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setDataSearch(value);
    applySearch(value);
  };

  const applySearch = (searchValue) => {
    let filteredList = [...listEmployees];
    if (searchValue.trim()) {
      const lowercasedSearch = searchValue.toLowerCase();
      filteredList = filteredList.filter((item) =>
        item.tenNhanVien.toLowerCase().includes(lowercasedSearch)
      );
    }
    setListEmployeesShow(filteredList);
  };

  useEffect(() => {
    applySearch(dataSearch);
  }, [listEmployees, dataSearch]);

  const handleLockEmployee = (employeeId, isLocked) => {
    const uri = `/api/admin/employees/${employeeId}/lock`;
    fetchPut(
      uri,
      { isLocked: !isLocked },
      (sus) => {
        setListEmployees((prev) =>
          prev.map((item) =>
            item._id === employeeId ? { ...item, isLocked: !isLocked } : item
          )
        );
        toast.success(`Nhân viên đã được ${isLocked ? "mở khóa" : "khóa"} thành công!`);
      },
      (fail) => {
        toast.error(fail.message);
      },
      () => {
        toast.error("Có lỗi xảy ra khi khóa/mở khóa nhân viên");
      }
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="employee-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng nhân viên: {listEmployeesShow.length}
        </div>
        <div className="row mx-0 my-0">
          <div className="col-12 pb-4 px-0 d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center col-10">
              <div className="contain_Search position-relative col-4 me-3">
                <input
                  onChange={handleSearch}
                  value={dataSearch}
                  className="search rounded-2 px-3"
                  placeholder="Nhập tên nhân viên muốn tìm"
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
                  <th>Tên nhân viên</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listEmployeesShow && listEmployeesShow.length > 0 ? (
                  listEmployeesShow.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.tenNhanVien}</td>
                      <td>{item.isLocked ? "Khóa" : "Hoạt động"}</td>
                      <td>
                        <div className="list_Action"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Không có nhân viên nào
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