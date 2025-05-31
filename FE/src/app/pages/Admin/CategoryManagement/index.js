import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoIosSearch, IoIosLock, IoIosUnlock } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchPut } from "../../../lib/httpHandler";
import AddCategory from "../../../components//Admin/CategoryManagement/AddCategory/AddCategory.jsx";
import EditCategory from "../../../components/Admin/CategoryManagement/DetailCategory/DetailCategory.jsx";
import "./CategoryManagement.css";

export default function CategoryManagement() {
  const [listCategories, setListCategories] = useState([]);
  const [dataSearch, setDataSearch] = useState("");

  // Fetch danh sách danh mục từ backend
  useEffect(() => {
    fetchGet(
      "/categories",
      (sus) => {
        const categories = Array.isArray(sus) ? sus : [];
        if (!categories.length && sus) {
          toast.error("Dữ liệu từ server không hợp lệ");
        }
        // Ensure each category has required properties
        const validatedCategories = categories.map((item, index) => ({
          ...item,
          _id: item._id || `fallback-${index}`, // Fallback for missing _id
          name: item.name || item.tenDanhMuc || "Không có tên", // Normalize name
          isLocked: item.isLocked || false, // Default isLocked
        }));
        setListCategories(validatedCategories);
      },
      (fail) => {
        toast.error(fail.message || "Lỗi khi lấy danh sách danh mục");
        setListCategories([]);
      },
      () => {
        toast.error("Có lỗi xảy ra khi lấy danh sách danh mục");
        setListCategories([]);
      }
    );
  }, []);

  // Optimize search with useMemo
  const listCategoriesShow = useMemo(() => {
    if (!Array.isArray(listCategories)) {
      console.error("listCategories không phải mảng:", listCategories);
      return [];
    }
    if (!dataSearch.trim()) return listCategories;
    const lowercasedSearch = dataSearch.toLowerCase();
    return listCategories.filter((item) =>
      item.name?.toLowerCase()?.includes(lowercasedSearch)
    );
  }, [listCategories, dataSearch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    setDataSearch(e.target.value);
  }, []);

  // Handle lock/unlock category
  const handleLockCategory = useCallback((categoryId, isLocked) => {
    fetchPut(
      `/categories/lock/${categoryId}`,
      { isLocked: !isLocked },
      (sus) => {
        setListCategories((prev) =>
          prev.map((item) =>
            item._id === categoryId ? { ...item, isLocked: !isLocked } : item
          )
        );
        toast.success(`Danh mục đã được ${isLocked ? "mở khóa" : "khóa"} thành công!`);
      },
      (fail) => {
        toast.error(fail.message || "Lỗi khi khóa/mở khóa danh mục");
      },
      () => {
        toast.error("Có lỗi xảy ra khi khóa/mở khóa danh mục");
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
            <AddCategory setListCategories={setListCategories} />
          </div>
          <div className="contain_Table mx-0 col-12 bg-white rounded-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên danh mục</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listCategoriesShow.length > 0 ? (
                  listCategoriesShow.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.isLocked ? "Khóa" : "Hoạt động"}</td>
                      <td>
                        <div className="list_Action d-flex gap-2">
                          <EditCategory
                            item={item}
                            setListCategories={setListCategories}
                          />
                          <button
                            onClick={() => handleLockCategory(item._id, item.isLocked)} // Fixed: Use isLocked instead of status
                            className="btn btn-sm btn-link p-0"
                            title={item.isLocked ? "Mở khóa" : "Khóa"}
                          >
                            {item.isLocked ? (
                              <IoIosUnlock size={20} className="text-success" />
                            ) : (
                              <IoIosLock size={20} className="text-warning" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
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