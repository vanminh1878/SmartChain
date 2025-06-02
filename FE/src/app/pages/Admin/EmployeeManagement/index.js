import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoIosSearch, IoIosLock, IoIosUnlock } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchDelete, fetchPut } from "../../../lib/httpHandler";
import { showYesNoMessageBox } from "../../../components/MessageBox/YesNoMessageBox/showYesNoMessgeBox.js";
import DetailEmployee from "../../../components/Admin/EmployeeManagement/DetailEmployee/DetailEmployee.jsx";
import AddEmployee from "../../../components/Admin/EmployeeManagement/AddEmployee/AddEmployee.jsx";
import "./EmployeeManagement.css";

export default function EmployeeManagement() {
  const [listEmployees, setListEmployees] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  // Hàm fetch danh sách nhân viên từ backend
  const fetchEmployees = useCallback(() => {
    console.log("Bắt đầu fetch danh sách nhân viên...");
    fetchGet(
      "/employees",
      async (res) => {
        const employees = Array.isArray(res) ? res : [];
        console.log("Dữ liệu từ /employees:", employees);
        if (!employees.length && res) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }

        // Gọi các API bổ sung cho mỗi nhân viên
        const validatedEmployees = await Promise.all(
          employees.map(async (item, index) => {
            if (!item.id) {
              console.warn(`Nhân viên tại index ${index} thiếu id:`, item);
              toast.warn(`Nhân viên tại index ${index} thiếu id, sử dụng ID tạm thời`);
            }

            // Gọi API User
            let userData = {};
            if (item.userId) {
              try {
                await fetchGet(
                  `/Users/${item.userId}`,
                  (userRes) => {
                    console.log(`Dữ liệu từ /Users/${item.userId}:`, userRes);
                    userData = userRes;
                  },
                  (fail) => {
                    console.error(`Lỗi khi lấy dữ liệu user ${item.userId}:`, fail);
                    toast.error(`Lỗi khi lấy thông tin user ${item.userId}`);
                  }
                );
              } catch (error) {
                console.error(`Lỗi khi gọi API /Users/${item.userId}:`, error);
              }
            }

            // Gọi API Account
            let accountData = {};
            if (userData.accountId) {
              try {
                await fetchGet(
                  `/Accounts/${userData.accountId}`,
                  (accountRes) => {
                    console.log(`Dữ liệu từ /Accounts/${userData.accountId}:`, accountRes);
                    accountData = accountRes;
                  },
                  (fail) => {
                    console.error(`Lỗi khi lấy dữ liệu account ${userData.accountId}:`, fail);
                    toast.error(`Lỗi khi lấy thông tin account ${userData.accountId}`);
                  }
                );
              } catch (error) {
                console.error(`Lỗi khi gọi API /Accounts/${userData.accountId}:`, error);
              }
            }

            // Gọi API Store
            let storeData = {};
            if (item.storeId) {
              try {
                await fetchGet(
                  `/Stores/${item.storeId}`,
                  (storeRes) => {
                    console.log(`Dữ liệu từ /Stores/${item.storeId}:`, storeRes);
                    storeData = storeRes;
                  },
                  (fail) => {
                    console.error(`Lỗi khi lấy dữ liệu store ${item.storeId}:`, fail);
                    toast.error(`Lỗi khi lấy thông tin store ${item.storeId}`);
                  }
                );
              } catch (error) {
                console.error(`Lỗi khi gọi API /Stores/${item.storeId}:`, error);
              }
            }

            return {
              ...item,
              id: item.id || `temp-${Date.now()}-${index}`,
              fullname: userData.fullname || "Không có tên",
              birthday: userData.birthday ? new Date(userData.birthday).toLocaleDateString("vi-VN") : "Không có",
              phoneNumber: userData.phoneNumber || "Không có",
              sex: userData.sex !== undefined ? (userData.sex === 1 ? "Nam" : "Nữ") : "Không có",
              storeName: storeData.name || "Không có",
              status: accountData.status !== undefined ? (accountData.status === 1 ? "Active" : "Locked") : "Không có",
            };
          })
        );

        console.log("Danh sách nhân viên đã xử lý:", validatedEmployees);
        setListEmployees(validatedEmployees);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách nhân viên:", fail);
        toast.error(fail.message || "Lỗi khi lấy danh sách nhân viên");
        setListEmployees([]);
      },
      () => {
        console.log("Yêu cầu fetch danh sách nhân viên hoàn tất");
      }
    );
  }, []);

  // Fetch danh sách khi component mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Optimize search with useMemo
  const listEmployeesShow = useMemo(() => {
    if (!Array.isArray(listEmployees)) {
      console.error("listEmployees không phải mảng:", listEmployees);
      return [];
    }
    console.log("Danh sách hiển thị trước khi lọc:", listEmployees);
    if (!dataSearch.trim()) return listEmployees;
    const lowercasedSearch = dataSearch.toLowerCase();
    const filtered = listEmployees.filter((item) =>
      item.fullname?.toLowerCase()?.includes(lowercasedSearch)
    );
    console.log("Danh sách hiển thị sau khi lọc:", filtered);
    return filtered;
  }, [listEmployees, dataSearch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    console.log("Tìm kiếm với giá trị:", e.target.value);
    setDataSearch(e.target.value);
  }, []);

  // Handle lock/unlock employee
  const handleLockEmployee = useCallback(async (employeeId, isActive) => {
    console.log(`Bắt đầu ${isActive ? "khóa" : "mở khóa"} nhân viên với ID:`, employeeId);
    if (!employeeId) {
      console.error("ID nhân viên không tồn tại");
      toast.error("ID nhân viên không tồn tại. Không thể thực hiện.");
      return;
    }
    if (employeeId.startsWith("temp-")) {
      console.error("ID nhân viên tạm thời:", employeeId);
      toast.error("Nhân viên này chưa được lưu trên server. Vui lòng làm mới trang.");
      return;
    }
    const action = isActive ? "khóa" : "mở khóa";
    const confirmAction = await showYesNoMessageBox(`Bạn có muốn ${action} nhân viên này không?`);
    if (!confirmAction) {
      console.log(`Hủy ${action} nhân viên`);
      return;
    }
    fetchPut(
      `/employees/lock/${employeeId}`,
      { status: !isActive },
      (response) => {
        console.log(`${action} nhân viên thành công, phản hồi từ server:`, response);
        toast.success(`Nhân viên đã được ${action} thành công!`);
        setListEmployees((prev) => {
          console.log("Danh sách trước khi cập nhật:", prev);
          const updatedList = prev.map((item) =>
            item.id === employeeId ? { ...item, status: isActive ? "Locked" : "Active" } : item
          );
          console.log("Danh sách sau khi cập nhật:", updatedList);
          return updatedList;
        });
      },
      (fail) => {
        console.error("Phản hồi lỗi từ server:", fail);
        toast.error(fail.message || fail.title || `Lỗi khi ${action} nhân viên`);
      },
      () => {
        console.log(`Yêu cầu ${action} nhân viên hoàn tất`);
      }
    );
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="employee-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng nhân viên: {listEmployeesShow.length || 0}
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
            <AddEmployee fetchEmployees={fetchEmployees} />
          </div>
          <div className="contain_Table mx-0 col-12 bg-white rounded-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ tên</th>
                  <th>Ngày sinh</th>
                  <th>Số điện thoại</th>
                  <th>Giới tính</th>
                  <th>Cửa hàng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listEmployeesShow.length > 0 ? (
                  listEmployeesShow.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.fullname}</td>
                      <td>{item.birthday}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.sex}</td>
                      <td>{item.storeName}</td>
                      <td>{item.status === "Active" ? "Hoạt động" : "Khóa"}</td>
                      <td>
                        <div className="list_Action d-flex gap-2">
                          <DetailEmployee item={item} setListEmployees={setListEmployees} key={item.id} />
                          <button
                            onClick={() => handleLockEmployee(item.id, item.status === "Active")}
                            className="btn btn-sm btn-link p-0"
                            title={item.status === "Active" ? "Khóa" : "Mở khóa"}
                          >
                            {item.status === "Active" ? (
                              <IoIosLock size={20} className="text-warning" />
                            ) : (
                              <IoIosUnlock size={20} className="text-success" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
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