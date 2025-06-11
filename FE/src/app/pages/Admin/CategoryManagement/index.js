import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchDelete } from "../../../lib/httpHandler";
import { showYesNoMessageBox } from "../../../components/MessageBox/YesNoMessageBox/showYesNoMessgeBox.js";
import { showErrorMessageBox } from "../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox.js";
import AddCategory from "../../../components/Admin/CategoryManagement/AddCategory/AddCategory.jsx";
import EditCategory from "../../../components/Admin/CategoryManagement/DetailCategory/DetailCategory.jsx";
import "./CategoryManagement.css";

export default function CategoryManagement() {
  const [listCategories, setListCategories] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  // Hàm fetch danh sách danh mục từ backend
  const fetchCategories = useCallback(() => {
    console.log("Bắt đầu fetch danh sách danh mục...");
    fetchGet(
      "/categories",
      (sus) => {
        const categories = Array.isArray(sus) ? sus : [];
        console.log("Dữ liệu từ server:", categories);
        if (!categories.length && sus) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }
        const validatedCategories = categories.map((item, index) => {
          if (!item.id) {
            console.warn(`Danh mục tại index ${index} thiếu id:`, item);
            toast.warn(`Danh mục tại index ${index} thiếu id, sử dụng ID tạm thời`);
          }
          return {
            ...item,
            id: item.id || `temp-${Date.now()}-${index}`,
            name: item.name || item.tenDanhMuc || "Không có tên",
            isLocked: item.isLocked || false,
          };
        });
        console.log("Danh sách danh mục đã xử lý:", validatedCategories);
        setListCategories(validatedCategories);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách danh mục:", fail);
        toast.error(fail.message || "Lỗi khi lấy danh sách danh mục");
        setListCategories([]);
      },
      () => {
        console.log("Yêu cầu fetch danh sách danh mục hoàn tất");
      }
    );
  }, []);

  // Fetch danh sách khi component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Optimize search with useMemo
  const listCategoriesShow = useMemo(() => {
    if (!Array.isArray(listCategories)) {
      console.error("listCategories không phải mảng:", listCategories);
      return [];
    }
    console.log("Danh sách hiển thị trước khi lọc:", listCategories);
    if (!dataSearch.trim()) return listCategories;
    const lowercasedSearch = dataSearch.toLowerCase();
    const filtered = listCategories.filter((item) =>
      item.name?.toLowerCase()?.includes(lowercasedSearch)
    );
    console.log("Danh sách hiển thị sau khi lọc:", filtered);
    return filtered;
  }, [listCategories, dataSearch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    console.log("Tìm kiếm với giá trị:", e.target.value);
    setDataSearch(e.target.value);
  }, []);

  // Handle delete category
  const handleDeleteCategory = useCallback(async (categoryId) => {
  console.log("Bắt đầu xóa danh mục với ID:", categoryId);
  if (!categoryId) {
    console.error("ID danh mục không tồn tại");
    await showErrorMessageBox("ID danh mục không tồn tại. Không thể xóa.");
    return;
  }
  if (categoryId.startsWith("temp-")) {
    console.error("ID danh mục tạm thời:", categoryId);
    await showErrorMessageBox("Danh mục này chưa được lưu trên server. Vui lòng làm mới trang.");
    return;
  }
  const confirmDelete = await showYesNoMessageBox("Bạn có muốn xóa danh mục này không?");
  if (!confirmDelete) {
    console.log("Hủy xóa danh mục");
    return;
  }
  fetchDelete(
    `/categories/${categoryId}`,
    null, // Không cần reqData cho DELETE
    (response) => {
      console.log("Xóa danh mục thành công, phản hồi từ server:", response);
      toast.success("Xóa danh mục thành công!");
      setListCategories((prev) => {
        console.log("Danh sách trước khi lọc:", prev);
        const updatedList = prev.filter((item) => item.id !== categoryId);
        console.log("Danh sách sau khi lọc:", updatedList);
        return updatedList;
      });
    },
    async (fail) => {
      console.error("Phản hồi lỗi từ server:", fail);
      // Hiển thị lỗi từ server bằng showErrorMessageBox
      await showErrorMessageBox(fail.message || "Không thể xóa danh mục đã có sản phẩm");
    },
    () => {
      console.log("Yêu cầu xóa danh mục hoàn tất");
    }
  );
}, []);

  return (
    <>
      <ToastContainer />
      <div className="category-management">
        <div className="title py-3 fs-5 mb-2">
          Số lượng danh mục: {listCategoriesShow.length || 0}
        </div>
        <div className="row mx-0 my-0">
          <div className="col-12 pb-4 px-0 d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center col-10">
              <div className="contain_Search position-relative col-4 me-3">
                <input
                  onChange={handleSearch}
                  value={dataSearch}
                  className="search rounded-2 px-3"
                  placeholder="Nhập tên danh mục muốn tìm"
                />
                <IoIosSearch className="icon_search translate-middle-y text-secondary" />
              </div>
            </div>
            <AddCategory fetchCategories={fetchCategories} />
          </div>
          <div className="contain_Table mx-0 col-12 bg-white rounded-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên danh mục</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listCategoriesShow.length > 0 ? (
                  listCategoriesShow.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <div className="list_Action d-flex gap-2">
                          <EditCategory
                            item={item}
                            fetchCategories={fetchCategories}
                          />
                          <button
                            onClick={() => handleDeleteCategory(item.id)}
                            className="btn btn-sm btn-link p-0"
                            title="Xóa danh mục"
                          >
                            <FaTrash size={20} className="text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      Không có danh mục nào
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