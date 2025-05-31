import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchDelete } from "../../../lib/httpHandler";
import { showYesNoMessageBox } from "../../../components/MessageBox/YesNoMessageBox/showYesNoMessgeBox.js";
import AddSupplier from "../../../components/Admin/SupplierManagement/AddSupplier/AddSupplier.jsx";
import EditSupplier from "../../../components/Admin/SupplierManagement/DetailSupplier/DetailSupplier.jsx";
import "./SupplierManagement.css";

export default function SupplierManagement() {
  const [listSuppliers, setListSuppliers] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  // Hàm fetch danh sách nhà cung cấp từ backend
  const fetchSuppliers = useCallback(() => {
    console.log("Bắt đầu fetch danh sách nhà cung cấp...");
    fetchGet(
      "/suppliers",
      (sus) => {
        const suppliers = Array.isArray(sus) ? sus : [];
        console.log("Dữ liệu từ server:", suppliers);
        if (!suppliers.length && sus) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }
        const validatedSuppliers = suppliers.map((item, index) => {
          if (!item.id) {
            console.warn(`Nhà cung cấp tại index ${index} thiếu id:`, item);
            toast.warn(`Nhà cung cấp tại index ${index} thiếu id, sử dụng ID tạm thời`);
          }
          return {
            ...item,
            id: item.id || `temp-${Date.now()}-${index}`,
            name: item.name || item.tenNhaCungCap || "Không có tên",
            contactName: item.contact_Name || item.contact_Name || "Không có",
            phoneNumber: item.phoneNumber || item.phone_number || "Không có",
            email: item.email || "Không có",
            address: item.address || "Không có",
            isLocked: item.isLocked || false,
          };
        });
        console.log("Danh sách nhà cung cấp đã xử lý:", validatedSuppliers);
        setListSuppliers(validatedSuppliers);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", fail);
        toast.error(fail.message || "Lỗi khi lấy danh sách nhà cung cấp");
        setListSuppliers([]);
      },
      () => {
        console.log("Yêu cầu fetch danh sách nhà cung cấp hoàn tất");
      }
    );
  }, []);

  // Fetch danh sách khi component mount
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Optimize search with useMemo
  const listSuppliersShow = useMemo(() => {
    if (!Array.isArray(listSuppliers)) {
      console.error("listSuppliers không phải mảng:", listSuppliers);
      return [];
    }
    console.log("Danh sách hiển thị trước khi lọc:", listSuppliers);
    if (!dataSearch.trim()) return listSuppliers;
    const lowercasedSearch = dataSearch.toLowerCase();
    const filtered = listSuppliers.filter((item) =>
      item.name?.toLowerCase()?.includes(lowercasedSearch)
    );
    console.log("Danh sách hiển thị sau khi lọc:", filtered);
    return filtered;
  }, [listSuppliers, dataSearch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    console.log("Tìm kiếm với giá trị:", e.target.value);
    setDataSearch(e.target.value);
  }, []);

  // Handle delete supplier
  const handleDeleteSupplier = useCallback(async (supplierId) => {
    console.log("Bắt đầu xóa nhà cung cấp với ID:", supplierId);
    if (!supplierId) {
      console.error("ID nhà cung cấp không tồn tại");
      toast.error("ID nhà cung cấp không tồn tại. Không thể xóa.");
      return;
    }
    if (supplierId.startsWith("temp-")) {
      console.error("ID nhà cung cấp tạm thời:", supplierId);
      toast.error("Nhà cung cấp này chưa được lưu trên server. Vui lòng làm mới trang.");
      return;
    }
    const confirmDelete = await showYesNoMessageBox("Bạn có muốn xóa nhà cung cấp này không?");
    if (!confirmDelete) {
      console.log("Hủy xóa nhà cung cấp");
      return;
    }
    fetchDelete(
      `/suppliers/${supplierId}`,
      (response) => {
        console.log("Xóa nhà cung cấp thành công, phản hồi từ server:", response);
        toast.success("Xóa nhà cung cấp thành công!");
        setListSuppliers((prev) => {
          console.log("Danh sách trước khi lọc:", prev);
          const updatedList = prev.filter((item) => item.id !== supplierId);
          console.log("Danh sách sau khi lọc:", updatedList);
          return updatedList;
        });
      },
      (fail) => {
        console.error("Phản hồi lỗi từ server:", fail);
        if (fail.message === "Xóa thành công") {
          console.log("Server báo thành công trong errorCallback, cập nhật danh sách cục bộ");
          toast.success("Xóa nhà cung cấp thành công!");
          setListSuppliers((prev) => {
            console.log("Danh sách trước khi lọc:", prev);
            const updatedList = prev.filter((item) => item.id !== supplierId);
            console.log("Danh sách sau khi lọc:", updatedList);
            return updatedList;
          });
        } else {
          toast.error(fail.message || "Lỗi khi xóa nhà cung cấp");
        }
      },
      () => {
        console.log("Yêu cầu xóa nhà cung cấp hoàn tất");
      }
    );
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="supplier-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng nhà cung cấp: {listSuppliersShow.length || 0}
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
            <AddSupplier fetchSuppliers={fetchSuppliers} />
          </div>
          <div className="contain_Table mx-0 col-12 bg-white rounded-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên nhà cung cấp</th>
                  <th>Người liên hệ</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Địa chỉ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listSuppliersShow.length > 0 ? (
                  listSuppliersShow.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.contactName}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.email}</td>
                      <td>{item.address}</td>
                      <td>
                        <div className="list_Action d-flex gap-2">
                          <EditSupplier
                            item={item}
                            fetchSuppliers={fetchSuppliers}
                          />
                          <button
                            onClick={() => handleDeleteSupplier(item.id)}
                            className="btn btn-sm btn-link p-0"
                            title="Xóa nhà cung cấp"
                          >
                            <FaTrash size={20} className="text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
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